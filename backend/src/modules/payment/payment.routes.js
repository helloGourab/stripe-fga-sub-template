import { Router } from 'express';
import * as paymentController from './payment.controller.js';
import express from 'express';

const router = Router();

// Standard route
router.post('/checkout', express.json(), paymentController.startCheckout);

// Fetching DB records
router.get('/subscriptions', paymentController.getSubscriptions);
router.get('/', paymentController.getPayments);

// WEBHOOK ROUTE - Needs raw body
router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.stripeWebhookHandler);

export default router;