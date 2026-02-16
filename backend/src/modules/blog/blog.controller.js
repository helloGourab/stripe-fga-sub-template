import * as blogService from './blog.service.js';

export const createBlog = async (req, res) => {
    try {
        const { title, body, userId, tier } = req.body;
        const blog = await blogService.createBlogService(title, body, userId, tier);
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { userid: userId } = req.headers; // Pass 'userid' in headers to test access

        if (!userId) return res.status(400).json({ error: 'User ID header required' });

        const blog = await blogService.getBlogByIdService(id, userId);
        res.json(blog);
    } catch (error) {
        const status = error.message.includes('Forbidden') ? 403 : 500;
        res.status(status).json({ error: error.message });
    }
};