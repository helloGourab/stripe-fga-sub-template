import User from '../../models/User.js';
import stripe from '../../lib/stripeClient.js';

export const createUserService = async (name, email) => {
    // 1. Create Stripe Customer
    const customer = await stripe.customers.create({ name, email });

    // 2. Create local DB User with the Stripe ID
    const user = new User({
        name,
        email,
        stripeCustomerId: customer.id,
    });

    return await user.save();
};

export const getAllUsersService = async () => {
    return await User.find();
};

export const getUserByIdService = async (id) => {
    return await User.findById(id);
};