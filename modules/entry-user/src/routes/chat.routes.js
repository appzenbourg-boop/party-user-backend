import express from 'express';
import { getChatHistory, markAsRead, getChatPeers, deleteConversation, deleteMessage, editMessage } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All chat routes require authentication

router.get('/peers', getChatPeers);
router.get('/history/:peerId', getChatHistory);
router.post('/read', markAsRead);
router.patch('/messages/:messageId', editMessage);     // ← edit a message
router.delete('/messages/:messageId', deleteMessage);  // ← delete single message
router.delete('/:peerId', deleteConversation);         // ← delete full conversation

export default router;
