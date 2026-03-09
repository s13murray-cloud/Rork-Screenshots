import { Router } from 'express';
import { getUsers } from '../controllers/users.controller';
import { authenticate, authorizeRole } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorizeRole(['admin']), getUsers);

export default router;
