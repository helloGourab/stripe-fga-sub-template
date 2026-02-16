import stripe from '../../lib/stripeClient.js';
import Subscription from '../../models/Subscription.js';
import Payment from '../../models/Payment.js';
import User from '../../models/User.js';
import { fgaClient } from '../../lib/fgaClient.js';
import dotenv from 'dotenv';
dotenv.config();

export const createCheckoutSession = async (userId, tier) => {
    console.log(`[Stripe] Creating checkout session for User: ${userId}, Tier: ${tier}`);

    // 1. Fetch user to get stripeCustomerId
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const priceId = tier === 'pro' ? process.env.STRIPE_PRO_PRICE_ID : process.env.STRIPE_BASIC_PRICE_ID;

    const sessionPayload = {
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
        // Metadata on the SESSION (for checkout.session.completed)
        metadata: { userId, tier },
        // Metadata on the SUBSCRIPTION (for customer.subscription.updated)
        subscription_data: {
            metadata: { userId, tier }
        }
    };

    // 2. Attach existing Stripe Customer ID to prevent duplicates
    if (user.stripeCustomerId) {
        sessionPayload.customer = user.stripeCustomerId;
        // NOTE: If you pass 'customer', do NOT pass 'customer_email'. 
        // Stripe handles the email from the existing customer record.
    } else {
        // Fallback: If for some reason your user doesn't have an ID yet
        sessionPayload.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    return session;
};

// Triggered by checkout.session.completed
export const handleSubscriptionCreated = async (session) => {
    console.log(`[Webhook] Handling checkout.session.completed for Session ID: ${session.id}`);

    const { userId, tier } = session.metadata;

    if (!userId) {
        console.error('[Error] userId missing in session metadata during handleSubscriptionCreated');
        return;
    }

    // 1. Update/Create Subscription in DB
    await Subscription.findOneAndUpdate(
        { userId },
        {
            stripeSubscriptionId: session.subscription,
            status: 'active',
            planId: tier,
        },
        { upsert: true, new: true }
    );
    console.log(`[DB] Subscription created/updated locally for user ${userId}`);

    // 2. FGA Logic (ADD THIS!)
    // We grant immediate access here because checkout is done.
    try {
        console.log(`[FGA] Writing IMMEDIATE tuple: user:${userId} is member of plan:${tier}`);
        await fgaClient.write({
            writes: [{ user: `user:${userId}`, relation: 'member', object: `plan:${tier}` }]
        });
        console.log(`[FGA] Tuple written successfully.`);
    } catch (err) {
        console.error(`[FGA Error] Failed to write tuple during checkout completion: ${err.message}`);
    }
};

// Triggered by customer.subscription.updated / deleted
export const syncSubscriptionState = async (stripeSubscriptionId) => {
    console.log(`[Webhook] Syncing state for Stripe Sub ID: ${stripeSubscriptionId}`);

    // Always fetch fresh data to avoid race conditions
    const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
    const { userId, tier } = subscription.metadata;

    // DEBUG: Check if metadata is actually coming through
    if (!userId) {
        console.error(`[Error] Missing userId in subscription metadata. Data:`, JSON.stringify(subscription.metadata));
        // Fallback: Try to find the user via the Stripe Customer ID if metadata failed
        const user = await User.findOne({ stripeCustomerId: subscription.customer });
        if (!user) {
            console.error(`[Error] Orphaned subscription. No User found for Customer ID: ${subscription.customer}`);
            return;
        }
        console.log(`[Recovery] Found user ${user._id} via stripeCustomerId lookup.`);
        // Proceed using the recovered ID
    }

    // Use the userId from metadata OR the recovery lookup
    const targetUserId = userId || (await User.findOne({ stripeCustomerId: subscription.customer }))._id.toString();

    await Subscription.findOneAndUpdate(
        { userId: targetUserId },
        {
            stripeSubscriptionId,
            status: subscription.status,
            planId: tier || 'basic', // Default to basic if tier metadata is missing (rare)
            currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        },
        { upsert: true }
    );

    console.log(`[DB] Subscription synced. Status: ${subscription.status}`);

    // FGA Logic
    try {
        if (['active', 'trialing'].includes(subscription.status)) {
            console.log(`[FGA] Writing tuple: user:${targetUserId} is member of plan:${tier}`);
            await fgaClient.write({
                writes: [{ user: `user:${targetUserId}`, relation: 'member', object: `plan:${tier}` }]
            });
        } else {
            console.log(`[FGA] Deleting tuple: user:${targetUserId} is member of plan:${tier}`);
            await fgaClient.write({
                deletes: [{ user: `user:${targetUserId}`, relation: 'member', object: `plan:${tier}` }]
            });
        }
    } catch (err) {
        console.error(`[FGA Error] Failed to write tuples: ${err.message}`);
    }
};

// Triggered by invoice.payment_succeeded OR invoice.payment_failed
export const recordPayment = async (invoice, status) => {
    console.log(`[Webhook] Recording payment (${status}) for Invoice: ${invoice.id}`);

    let userId = invoice.metadata?.userId;

    // Fallback: lookup via subscription
    if (!userId && invoice.subscription) {
        const sub = await Subscription.findOne({ stripeSubscriptionId: invoice.subscription });
        if (sub) userId = sub.userId;
    }

    // Fallback 2: lookup via customer ID
    if (!userId && invoice.customer) {
        const user = await User.findOne({ stripeCustomerId: invoice.customer });
        if (user) userId = user._id;
    }

    if (!userId) {
        console.error(`[Error] Missing userId for invoice ${invoice.id}. Skipping DB record.`);
        return;
    }

    await Payment.create({
        userId,
        stripePaymentIntentId: invoice.payment_intent || `invoice_${invoice.id}`, // Fallback if no intent (e.g. 100% off coupon)
        amount: invoice.amount_paid || invoice.amount_due,
        status: status,
        currency: invoice.currency,
    });

    console.log(`[DB] Payment recorded for user ${userId}`);
};

export const handleInvoiceFailed = async (invoice) => {
    console.log(`[Webhook] Invoice failed for subscription ${invoice.subscription}`);
};

export const getAllSubscriptions = async () => {
    return await Subscription.find().populate('userId', 'name email');
};

export const getAllPayments = async () => {
    return await Payment.find().sort({ createdAt: -1 });
};