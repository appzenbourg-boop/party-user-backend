import express from 'express';
import { getChatHistory, markAsRead, getChatPeers, deleteConversation } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All chat routes require authentication

router.get('/peers', getChatPeers);         // ← conversations list
router.get('/history/:peerId', getChatHistory);
router.post('/read', markAsRead);
router.delete('/:peerId', deleteConversation); // ← delete conversation

export default router;
