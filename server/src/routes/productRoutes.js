import { Router } from 'express';
import { list, detail, create, update, remove } from '../controllers/productController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', list);
router.get('/:slug', detail);
router.get('/id/:id', detail);

router.post('/', requireAuth(['admin']), create);
router.put('/:id', requireAuth(['admin']), update);
router.delete('/:id', requireAuth(['admin']), remove);

export default router;
