"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const auditLogger_1 = require("../middleware/auditLogger");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// View faults
router.get('/', (0, auth_1.authorizeRole)(['supervisor', 'admin']), (req, res) => {
    res.json({ message: 'List faults based on query params' });
});
// Rectify or transition a fault (Supervisor/Admin)
router.post('/:id/transition', (0, auth_1.authorizeRole)(['supervisor', 'admin']), (0, auditLogger_1.auditLogger)('TRANSITION_FAULT', 'FaultReport'), (req, res) => {
    const { new_state, notes, photo_evidence_ids } = req.body;
    res.json({ message: `Fault ${req.params.id} transitioned to ${new_state}` });
});
exports.default = router;
