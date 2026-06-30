import express from 'express';
import { askSupport, getSupportChat, clearSupportChat } from '../controllers/support.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/support-chat', askSupport);
router.get('/support-chat', getSupportChat);
router.delete('/support-chat', clearSupportChat);

export default router;
