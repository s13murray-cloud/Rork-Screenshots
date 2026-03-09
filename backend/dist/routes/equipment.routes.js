"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const auditLogger_1 = require("../middleware/auditLogger");
const equipment_controller_1 = require("../controllers/equipment.controller");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', equipment_controller_1.getAllEquipment);
router.get('/:id', equipment_controller_1.getEquipmentById);
router.post('/', (0, auth_1.authorizeRole)(['admin']), (0, auditLogger_1.auditLogger)('CREATE_EQUIPMENT', 'Equipment'), equipment_controller_1.createEquipment);
router.put('/:id', (0, auth_1.authorizeRole)(['admin']), (0, auditLogger_1.auditLogger)('UPDATE_EQUIPMENT', 'Equipment'), (req, res) => {
    res.json({ message: `Equipment ${req.params.id} updated` });
});
exports.default = router;
