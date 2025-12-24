import { Router } from 'express';
import { getCart, addItem, updateItem, removeItem, clearCart } from '../controllers/cartController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth(), getCart);
router.post('/add', requireAuth(), addItem);
router.post('/update', requireAuth(), updateItem);
router.post('/remove', requireAuth(), removeItem);
router.post('/clear', requireAuth(), clearCart);

export default router;
