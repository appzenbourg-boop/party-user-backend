import express from 'express';
import { createOrder, verifyPayment, createFoodOrder, verifyFoodPayment, iosCheckoutPage } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// ── iOS Checkout Page (public — no auth needed, HTML page served to Safari) ──
// Called by the mobile app on iOS to open Razorpay web checkout in SFAuthenticationSession.
router.get('/ios-checkout', iosCheckoutPage);

router.use(protect);

router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

// Food/Drink specific payment flow
router.post('/food/order', createFoodOrder);
router.post('/food/verify', verifyFoodPayment);

export default router;
