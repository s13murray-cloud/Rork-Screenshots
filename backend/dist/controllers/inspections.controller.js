"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInspectionHistory = exports.syncOfflineInspections = void 0;
const db_1 = require("../config/db");
const syncOfflineInspections = async (req, res) => {
    // Expected Payload: Array of Inspection data
    const syncPayloads = req.body; // e.g., [{ inspection_id, device_id, gps_location, ip_address, worker_signature, responses: [...] }]
    const client = await db_1.db.connect();
    try {
        await client.query('BEGIN'); // Atomic Transaction
        let faultsGenerated = 0;
        for (const payload of syncPayloads) {
            // 1. Insert Inspection meta (skipping version lock check for brevity)
            await client.query(`
                INSERT INTO Inspections (id, equipment_id, user_id, version_id, started_at, submitted_at, worker_signature, device_id, gps_location, ip_address, status)
                VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8, $9, 'submitted')
                ON CONFLICT (id) DO NOTHING
            `, [
                payload.inspection_id, payload.equipment_id, req.user?.id, payload.version_id, payload.started_at,
                payload.worker_signature, payload.device_id, payload.gps_location, payload.ip_address
            ]);
            // 2. Insert Responses
            for (const resp of payload.responses) {
                await client.query(`
                    INSERT INTO InspectionResponses (inspection_id, checklist_item_id, result, notes)
                    VALUES ($1, $2, $3, $4)
                `, [payload.inspection_id, resp.checklist_item_id, resp.result, resp.notes]);
                // 3. Generate faults if result is 'fault'
                if (resp.result === 'fault') {
                    // Check if critical
                    const itemQ = await client.query('SELECT is_critical FROM ChecklistItems WHERE id = $1', [resp.checklist_item_id]);
                    const isCritical = itemQ.rows[0]?.is_critical || false;
                    await client.query(`
                        INSERT INTO FaultReports (inspection_id, checklist_item_id, equipment_id, reported_by, description, status)
                        VALUES ($1, $2, $3, $4, $5, 'open')
                    `, [payload.inspection_id, resp.checklist_item_id, payload.equipment_id, req.user?.id, resp.notes]);
                    // Update Equipment Status
                    const newStatus = isCritical ? 'red' : 'amber';
                    await client.query(`
                        UPDATE Equipment SET status = $1 WHERE id = $2 AND status != 'red'
                    `, [newStatus, payload.equipment_id]);
                    faultsGenerated++;
                }
            }
        }
        await client.query('COMMIT');
        res.json({ status: 'success', synced: syncPayloads.length, faults_generated: faultsGenerated });
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Sync failed:', error);
        res.status(500).json({ status: 'error', message: 'Failed to sync inspections atomically', details: error.message });
    }
    finally {
        client.release();
    }
};
exports.syncOfflineInspections = syncOfflineInspections;
const getInspectionHistory = async (req, res) => {
    try {
        const result = await db_1.db.query(`
            SELECT 
                i.id, i.started_at, i.submitted_at, i.status,
                e.nickname as equipment_name,
                c.name as equipment_category,
                u.first_name, u.last_name,
                (SELECT COUNT(*) FROM InspectionResponses r WHERE r.inspection_id = i.id AND r.result = 'fault') as fault_count
            FROM Inspections i
            JOIN Equipment e ON i.equipment_id = e.id
            JOIN EquipmentCategories c ON e.category_id = c.id
            JOIN Users u ON i.user_id = u.id
            ORDER BY i.submitted_at DESC NULLS LAST
            LIMIT 50
        `);
        res.json({ history: result.rows });
    }
    catch (error) {
        console.error('Failed to get inspection history:', error);
        res.status(500).json({ message: 'Failed to fetch inspection history', details: error.message });
    }
};
exports.getInspectionHistory = getInspectionHistory;
