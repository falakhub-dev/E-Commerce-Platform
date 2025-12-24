import { Router } from 'express';
import { createIntent, confirm, webhook } from '../controllers/checkoutController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/create-intent', requireAuth(), createIntent);
router.post('/confirm', requireAuth(), confirm);
// raw body for Stripe webhook
router.post('/webhook', webhook);

export default router;
