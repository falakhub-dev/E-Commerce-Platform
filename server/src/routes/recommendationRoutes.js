import { Router } from 'express';
import { home, similar, logEvent } from '../controllers/recommendationController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/home', requireAuth(), home);
router.get('/product/:id', similar);
router.post('/events', requireAuth(), logEvent);

export default router;
