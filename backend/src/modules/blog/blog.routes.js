import { Router } from 'express';
import * as blogController from './blog.controller.js';

const router = Router();

router.post('/', blogController.createBlog);
router.get('/:id', blogController.getBlog);

export default router;