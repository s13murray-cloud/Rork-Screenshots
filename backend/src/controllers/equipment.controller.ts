import { Response } from 'express';
import { db } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getAllEquipment = async (req: AuthRequest, res: Response) => {
    const companyId = req.user?.company_id;
    try {
        const result = await db.query(`
            SELECT e.id, e.nickname as name, e.status, e.photo_url, c.name as category
            FROM Equipment e
            JOIN EquipmentCategories c ON e.category_id = c.id
            WHERE e.is_active = true AND e.company_id = $1
            ORDER BY e.nickname ASC
        `, [companyId]);
        res.json({ equipment: result.rows });
    } catch (error: any) {
        console.error('Failed to get equipment:', error);
        res.status(500).json({ message: 'Failed to fetch equipment', details: error.message });
    }
};

export const getEquipmentById = async (req: AuthRequest, res: Response) => {
    const companyId = req.user?.company_id;
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT e.id, e.nickname as name, e.status, e.photo_url, c.name as category
            FROM Equipment e
            JOIN EquipmentCategories c ON e.category_id = c.id
            WHERE e.id = $1 AND e.is_active = true AND e.company_id = $2
        `, [id, companyId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Equipment not found' });
        }
        const equipment = result.rows[0];

        // Fetch checklist items for this equipment
        const itemsRes = await db.query(`
            SELECT ci.id, ci.title, ci.title as description, ci.is_critical as "isCriticalFault"
            FROM EquipmentChecklistAssignments eca
            JOIN ChecklistVersions cv ON eca.checklist_id = cv.checklist_id AND cv.is_published = true
            JOIN ChecklistItems ci ON cv.id = ci.version_id
            WHERE eca.equipment_id = $1
            ORDER BY ci.sequence_order ASC
        `, [id]);

        equipment.checklistItems = itemsRes.rows;

        // Fetch latest version_id for sync submission
        if (itemsRes.rows.length > 0) {
            const versionRes = await db.query(`
                SELECT cv.id as version_id
                FROM EquipmentChecklistAssignments eca
                JOIN ChecklistVersions cv ON eca.checklist_id = cv.checklist_id AND cv.is_published = true
                WHERE eca.equipment_id = $1
            `, [id]);
            equipment.version_id = versionRes.rows[0]?.version_id;
        }

        res.json({ equipment });
    } catch (error: any) {
        console.error('Failed to get equipment by id:', error);
        res.status(500).json({ message: 'Failed to fetch equipment', details: error.message });
    }
};

export const createEquipment = async (req: AuthRequest, res: Response) => {
    const { name, ref, categoryName, customItems } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const client = await db.connect();

    try {
        await client.query('BEGIN');

        // 1. Get user's company and site
        const userRes = await client.query('SELECT company_id, site_id FROM Users WHERE id = $1', [userId]);
        if (userRes.rows.length === 0) throw new Error('User not found');
        const { company_id, site_id } = userRes.rows[0];

        // 2. Get or create category
        let categoryId;
        const catRes = await client.query('SELECT id FROM EquipmentCategories WHERE name = $1', [categoryName || 'General']);
        if (catRes.rows.length > 0) {
            categoryId = catRes.rows[0].id;
        } else {
            const newCat = await client.query('INSERT INTO EquipmentCategories (name) VALUES ($1) RETURNING id', [categoryName || 'General']);
            categoryId = newCat.rows[0].id;
        }

        // 3. Insert Equipment
        const nickname = ref ? `${name} (${ref})` : name;
        const eqRes = await client.query(`
            INSERT INTO Equipment (company_id, site_id, nickname, category_id, status)
            VALUES ($1, $2, $3, $4, 'green')
            RETURNING id, nickname, status
        `, [company_id, site_id || company_id /* fallback if site_id is null */, nickname, categoryId]);

        const newEquipment = eqRes.rows[0];

        // 4. Create a specific Checklist and Version for this equipment
        const chkRes = await client.query(`
            INSERT INTO Checklists (name) VALUES ($1) RETURNING id
        `, [`Checklist for ${nickname}`]);
        const checklistId = chkRes.rows[0].id;

        const verRes = await client.query(`
            INSERT INTO ChecklistVersions (checklist_id, version_number, is_published)
            VALUES ($1, 1, true) RETURNING id
        `, [checklistId]);
        const versionId = verRes.rows[0].id;

        // 5. Assign checklist to equipment
        await client.query(`
            INSERT INTO EquipmentChecklistAssignments (equipment_id, checklist_id)
            VALUES ($1, $2)
        `, [newEquipment.id, checklistId]);

        // 6. Insert Custom Items
        if (customItems && Array.isArray(customItems)) {
            for (let i = 0; i < customItems.length; i++) {
                const item = customItems[i];
                await client.query(`
                    INSERT INTO ChecklistItems (version_id, title, sequence_order, is_critical)
                    VALUES ($1, $2, $3, $4)
                `, [versionId, item.item_text, i + 1, item.is_critical || false]);
            }
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Equipment created successfully', equipment: newEquipment });

    } catch (error: any) {
        await client.query('ROLLBACK');
        console.error('Failed to create equipment:', error);
        res.status(500).json({ message: 'Failed to create equipment', details: error.message });
    } finally {
        client.release();
    }
};
