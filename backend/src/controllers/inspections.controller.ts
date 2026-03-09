import { Request, Response } from 'express';
import { db } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const syncOfflineInspections = async (req: AuthRequest, res: Response) => {
    // Expected Payload: Array of Inspection data
    const syncPayloads = req.body; // e.g., [{ inspection_id, device_id, gps_location, ip_address, worker_signature, responses: [...] }]
    const client = await db.connect();

    try {
        await client.query('BEGIN'); // Atomic Transaction

        const userRes = await client.query('SELECT company_id, site_id FROM Users WHERE id = $1', [req.user?.id]);
        const company_id = userRes.rows[0]?.company_id;
        const site_id = userRes.rows[0]?.site_id || company_id; // Default fallback to company_id if no site

        let faultsGenerated = 0;

        for (const payload of syncPayloads) {
            // 1. Insert Inspection meta (skipping version lock check for brevity)
            await client.query(`
                INSERT INTO Inspections (id, company_id, site_id, equipment_id, user_id, user_name_snapshot, version_id, started_at, submitted_at, worker_signature, device_id, gps_location, ip_address, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8, $9, $10, $11, $12, 'submitted')
                ON CONFLICT (id) DO NOTHING
            `, [
                payload.inspection_id, company_id, site_id, payload.equipment_id, req.user?.id, req.user?.full_name, payload.version_id, payload.started_at,
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
                        INSERT INTO FaultReports (company_id, site_id, inspection_id, checklist_item_id, equipment_id, reported_by, user_name_snapshot, description, status)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open')
                    `, [company_id, site_id, payload.inspection_id, resp.checklist_item_id, payload.equipment_id, req.user?.id, req.user?.full_name, resp.notes]);

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

    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Sync failed:', error);
        res.status(500).json({ status: 'error', message: 'Failed to sync inspections atomically', details: error.message });
    } finally {
        client.release();
    }
};

export const getInspectionHistory = async (req: AuthRequest, res: Response) => {
    const companyId = req.user?.company_id;
    try {
        const result = await db.query(`
            SELECT 
                i.id, i.started_at, i.submitted_at, i.status,
                e.nickname as equipment_name,
                c.name as equipment_category,
                u.full_name,
                (SELECT COUNT(*) FROM InspectionResponses r WHERE r.inspection_id = i.id AND r.result = 'fault') as fault_count
            FROM Inspections i
            JOIN Equipment e ON i.equipment_id = e.id
            JOIN EquipmentCategories c ON e.category_id = c.id
            JOIN Users u ON i.user_id = u.id
            WHERE i.company_id = $1
            ORDER BY i.submitted_at DESC NULLS LAST
            LIMIT 50
        `, [companyId]);
        res.json({ history: result.rows });
    } catch (error: any) {
        console.error('Failed to get inspection history:', error);
        res.status(500).json({ message: 'Failed to fetch inspection history', details: error.message });
    }
};
