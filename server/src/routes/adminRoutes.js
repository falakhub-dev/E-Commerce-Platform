import { Router } from 'express';
import { dashboard, listOrders, updateStock } from '../controllers/adminController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', requireAuth(['admin']), dashboard);
router.get('/orders', requireAuth(['admin']), listOrders);
router.put('/products/:id/stock', requireAuth(['admin']), updateStock);

export default router;
