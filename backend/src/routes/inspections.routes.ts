import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { auditLogger } from '../middleware/auditLogger';
import { syncOfflineInspections, getInspectionHistory } from '../controllers/inspections.controller';

const router = Router();

// Apply auth middleware
router.use(authenticate);

// Start an inspection
router.post('/start', (req, res) => {
    res.json({ message: 'Inspection started', started_at: new Date() });
});

// Submit / Sync single or multiple offline payloads
router.post('/sync', auditLogger('INSPECTIONS_SYNCED', 'Inspection'), syncOfflineInspections);

// Get History
router.get('/history', getInspectionHistory);

export default router;
