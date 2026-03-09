import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

router.post('/login', login);
router.post('/register', authenticate, authorizeRole(['admin']), register);

export default router;
