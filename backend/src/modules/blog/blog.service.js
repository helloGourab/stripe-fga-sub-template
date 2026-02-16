import Blog from '../../models/Blog.js';
import { fgaClient } from '../../lib/fgaClient.js';

export const createBlogService = async (title, body, authorId, tier = 'free') => {
    // 1. Save to MongoDB
    const blog = new Blog({ title, body, authorId, tier });
    await blog.save();

    // 2. OpenFGA Writes
    const writes = [
        // Relation 1: The creator is the owner
        {
            user: `user:${authorId}`,
            relation: 'owner',
            object: `blog:${blog._id}`
        }
    ];

    // Relation 2: If it's not a free blog, link it to a plan
    if (tier !== 'free') {
        writes.push({
            user: `plan:${tier}`, // e.g., plan:pro
            relation: 'required_plan',
            object: `blog:${blog._id}`
        });
    }

    await fgaClient.write({ writes });

    return blog;
};

export const getBlogByIdService = async (blogId, userId) => {
    // Check OpenFGA for 'can_read'
    const { allowed } = await fgaClient.check({
        user: `user:${userId}`,
        relation: 'can_read',
        object: `blog:${blogId}`,
    });

    if (!allowed) {
        throw new Error('Forbidden: Your current plan does not cover this content');
    }

    return await Blog.findById(blogId);
};