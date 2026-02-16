import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stripeSubscriptionId: { type: String, unique: true },
    status: { type: String }, // 'active', 'incomplete', 'canceled'
    planId: { type: String },
    currentPeriodEnd: { type: Date }
}, { timestamps: true });

export default mongoose.model('Subscription', subscriptionSchema);