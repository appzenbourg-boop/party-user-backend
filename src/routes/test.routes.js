import express from 'express';
import { seedEventPresence, clearEventPresence, getEventPresence } from '../controllers/test.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Test endpoints for EventPresence management
router.post('/seed-presence/:eventId', authenticate, seedEventPresence);
router.delete('/clear-presence/:eventId', authenticate, clearEventPresence);
router.get('/presence/:eventId', authenticate, getEventPresence);

export default router;
