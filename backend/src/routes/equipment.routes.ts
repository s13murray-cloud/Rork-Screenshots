import { Router } from 'express';
import { authenticate, authorizeRole } from '../middleware/auth';
import { auditLogger } from '../middleware/auditLogger';
import { getAllEquipment, getEquipmentById, createEquipment } from '../controllers/equipment.controller';

const router = Router();

router.use(authenticate);

router.get('/', getAllEquipment);

router.get('/:id', getEquipmentById);

router.post('/', authorizeRole(['admin']), auditLogger('CREATE_EQUIPMENT', 'Equipment'), createEquipment);

router.put('/:id', authorizeRole(['admin']), auditLogger('UPDATE_EQUIPMENT', 'Equipment'), (req, res) => {
    res.json({ message: `Equipment ${req.params.id} updated` });
});

export default router;
