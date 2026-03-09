import { Response } from 'express';
import { db } from '../config/db';
import { AuthRequest } from '../middleware/auth';

export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const companyId = req.user?.company_id;
        const result = await db.query(`
            SELECT u.id, u.email, u.full_name, t.name as team_name, r.name as role, u.is_active, u.created_at
            FROM Users u
            JOIN Roles r ON u.role_id = r.id
            LEFT JOIN Teams t ON u.team_id = t.id
            WHERE u.company_id = $1
            ORDER BY u.created_at DESC
        `, [companyId]);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
