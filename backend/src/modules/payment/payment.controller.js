import * as paymentService from './payment.service.js';
import stripe from '../../lib/stripeClient.js';

export const startCheckout = async (req, res) => {
    try {
        const { userId, tier } = req.body;
        const session = await paymentService.createCheckoutSession(userId, tier);
        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Ensure req.body is the raw buffer here, not parsed JSON
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Signature Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const data = event.data.object;

    try {
        switch (event.type) {
            // 1. Initial Subscription Setup
            case 'checkout.session.completed':
                // Only handle subscription mode sessions
                if (data.mode === 'subscription') {
                    await paymentService.handleSubscriptionCreated(data);
                }
                break;

            // 2. Subscription Status Changes (Renewals, Cancellations, Pauses)
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                await paymentService.syncSubscriptionState(data.id);
                break;

            // 3. Payment Ledger (Success) - Covers both first payment and renewals
            case 'invoice.payment_succeeded':
                await paymentService.recordPayment(data, 'succeeded');
                break;

            // 4. Payment Ledger (Failure)
            case 'invoice.payment_failed':
                await paymentService.recordPayment(data, 'failed');
                await paymentService.handleInvoiceFailed(data);
                break;
        }
    } catch (error) {
        console.error(`Webhook Handler Error: ${error.message}`);
        // Return 200 to Stripe anyway so they don't retry and hammer your server if it's a logic bug
        return res.json({ received: true, error: error.message });
    }

    res.json({ received: true });
};

export const getSubscriptions = async (req, res) => {
    try {
        const subscriptions = await paymentService.getAllSubscriptions();
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};