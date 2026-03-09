"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const auditLogger_1 = require("../middleware/auditLogger");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', (req, res) => {
    res.json({ message: 'Get active checklists' });
});
router.post('/', (0, auth_1.authorizeRole)(['admin']), (0, auditLogger_1.auditLogger)('CREATE_CHECKLIST', 'Checklist'), (req, res) => {
    res.status(201).json({ message: 'Checklist created' });
});
router.post('/:id/version', (0, auth_1.authorizeRole)(['admin']), (0, auditLogger_1.auditLogger)('CREATE_CHECKLIST_VERSION', 'ChecklistVersion'), (req, res) => {
    res.status(201).json({ message: `New version created for checklist ${req.params.id}` });
});
exports.default = router;
