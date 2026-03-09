import { Router } from 'express';
import { authenticate, authorizeRole } from '../middleware/auth';
import { auditLogger } from '../middleware/auditLogger';

const router = Router();

router.use(authenticate);

router.get('/', (req, res) => {
    res.json({ message: 'Get active checklists' });
});

router.post('/', authorizeRole(['admin']), auditLogger('CREATE_CHECKLIST', 'Checklist'), (req, res) => {
    res.status(201).json({ message: 'Checklist created' });
});

router.post('/:id/version', authorizeRole(['admin']), auditLogger('CREATE_CHECKLIST_VERSION', 'ChecklistVersion'), (req, res) => {
    res.status(201).json({ message: `New version created for checklist ${req.params.id}` });
});

export default router;
