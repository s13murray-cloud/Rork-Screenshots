import { Router } from 'express';
import { createInvitation, getInvitation, acceptInvitation } from '../controllers/invitations.controller';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

// Admins only can create invitations
router.post('/', authenticate, authorizeRole(['admin']), createInvitation);

// Public routes for invited users to see details and accept
router.get('/:token', getInvitation);
router.post('/:token/accept', acceptInvitation);

export default router;
