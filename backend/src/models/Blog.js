import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Define which plan is required to read this
    tier: {
        type: String,
        enum: ['free', 'basic', 'pro'],
        default: 'free'
    }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);