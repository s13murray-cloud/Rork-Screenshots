import { Router } from 'express';
import { authenticate, authorizeRole, AuthRequest } from '../middleware/auth';
import { auditLogger } from '../middleware/auditLogger';
import { db } from '../config/db';

const router = Router();

router.use(authenticate);

// View faults
router.get('/', authorizeRole(['worker', 'supervisor', 'admin']), async (req: AuthRequest, res) => {
    try {
        const companyId = req.user?.company_id;
        const result = await db.query(`
            SELECT 
                f.id, f.description as note, f.status, f.created_at as "dateReported",
                e.id as "equipmentId", e.nickname as "equipmentName",
                ci.title as "checklistItem",
                u.full_name as "reportedBy"
            FROM FaultReports f
            JOIN Equipment e ON f.equipment_id = e.id
            JOIN ChecklistItems ci ON f.checklist_item_id = ci.id
            JOIN Users u ON f.reported_by = u.id
            WHERE f.company_id = $1 AND f.status = 'open'
            ORDER BY f.created_at DESC
        `, [companyId]);

        res.json({ faults: result.rows });
    } catch (error: any) {
        console.error('Error fetching faults:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.post('/:id/transition', authorizeRole(['supervisor', 'admin']), auditLogger('TRANSITION_FAULT', 'FaultReport'), (req, res) => {
    const { new_state, notes, photo_evidence_ids } = req.body;
    res.json({ message: `Fault ${req.params.id} transitioned to ${new_state}` });
});

export default router;
