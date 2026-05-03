import express from 'express';
import { getChatHistory, markAsRead, getChatPeers, deleteConversation, deleteMessage } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All chat routes require authentication

router.get('/peers', getChatPeers);
router.get('/history/:peerId', getChatHistory);
router.post('/read', markAsRead);
router.delete('/messages/:messageId', deleteMessage); // ← single message — MUST be before /:peerId
router.delete('/:peerId', deleteConversation);         // ← full conversation

export default router;
