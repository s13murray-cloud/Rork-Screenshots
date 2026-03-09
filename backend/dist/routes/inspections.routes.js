"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const auditLogger_1 = require("../middleware/auditLogger");
const inspections_controller_1 = require("../controllers/inspections.controller");
const router = (0, express_1.Router)();
// Apply auth middleware
router.use(auth_1.authenticate);
// Start an inspection
router.post('/start', (req, res) => {
    res.json({ message: 'Inspection started', started_at: new Date() });
});
// Submit / Sync single or multiple offline payloads
router.post('/sync', (0, auditLogger_1.auditLogger)('INSPECTIONS_SYNCED', 'Inspection'), inspections_controller_1.syncOfflineInspections);
// Get History
router.get('/history', inspections_controller_1.getInspectionHistory);
exports.default = router;
