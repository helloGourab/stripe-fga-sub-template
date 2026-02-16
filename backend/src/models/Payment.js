import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stripePaymentIntentId: { type: String, unique: true },
    amount: { type: Number, required: true }, // Store in cents
    status: { type: String, required: true }, // 'succeeded', 'pending', 'failed'
    currency: { type: String, default: 'usd' }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);