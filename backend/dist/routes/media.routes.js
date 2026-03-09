"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const auditLogger_1 = require("../middleware/auditLogger");
const db_1 = require("../config/db");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.use(auth_1.authenticate);
router.post('/upload', upload.single('media'), (0, auditLogger_1.auditLogger)('UPLOAD_MEDIA', 'PhotoEvidence'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    try {
        // Pseudo logic: upload to S3, get URL, generate SHA-256 hash.
        const mockUrl = `https://storage.checkta.internal/${req.file.filename}`;
        const mockHash = 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e';
        const entityType = req.body.entity_type || 'equipment';
        const entityId = req.body.entity_id || '00000000-0000-0000-0000-000000000000';
        const result = await db_1.db.query(`
            INSERT INTO PhotoEvidence (entity_type, entity_id, uploader_id, url, file_hash)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `, [entityType, entityId, req.user?.id, mockUrl, mockHash]);
        res.status(201).json({
            status: 'success',
            media_id: result.rows[0].id,
            url: mockUrl,
            file_hash: mockHash
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to upload media', details: err.message });
    }
});
exports.default = router;
