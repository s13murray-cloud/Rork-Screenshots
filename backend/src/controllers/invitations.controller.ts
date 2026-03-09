import { Request, Response } from 'express';
import { db } from '../config/db';
import { env } from '../config/env';
import jwt from 'jsonwebtoken';

export const createInvitation = async (req: Request, res: Response) => {
    const { email, role_id, team_name } = req.body;

    // Validate role is 'worker' or 'admin' 
    // Usually company_id is from req.user
    // Using a hardcoded or derived company for basic MVP

    try {
        const adminUser = await db.query('SELECT company_id FROM Users WHERE id = $1', [(req as any).user.id]);
        if (adminUser.rows.length === 0) return res.status(401).json({ message: 'Unauthorized' });

        const company_id = adminUser.rows[0].company_id;

        // Find or create team
        let team_id = null;
        if (team_name) {
            let teamRes = await db.query('SELECT id FROM Teams WHERE company_id = $1 AND name = $2', [company_id, team_name]);
            if (teamRes.rows.length === 0) {
                teamRes = await db.query('INSERT INTO Teams (company_id, name) VALUES ($1, $2) RETURNING id', [company_id, team_name]);
            }
            team_id = teamRes.rows[0].id;
        }

        // 7 days expiration
        const expires_at = new Date();
        expires_at.setDate(expires_at.getDate() + 7);

        const result = await db.query(`
            INSERT INTO Invitations (company_id, email, role_id, team_id, expires_at)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING token
        `, [company_id, email, role_id, team_id, expires_at]);

        const token = result.rows[0].token;
        // MOCK EMAIL SEND
        console.log(`[Mock Email] Invite sent to ${email}. Link: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/invite/${token}`);

        res.status(201).json({ message: 'Invitation created', token });
    } catch (err) {
        console.error('Error creating invitation:', err);
        res.status(500).json({ message: 'Error creating invitation' });
    }
};

export const getInvitation = async (req: Request, res: Response) => {
    const { token } = req.params;

    try {
        const result = await db.query(`
            SELECT i.email, t.name as team_name, i.status, i.expires_at, r.name as role_name
            FROM Invitations i
            JOIN Roles r ON i.role_id = r.id
            LEFT JOIN Teams t ON i.team_id = t.id
            WHERE i.token = $1
        `, [token]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        const inv = result.rows[0];
        if (inv.status !== 'pending') {
            return res.status(400).json({ message: 'Invitation is already ' + inv.status });
        }

        if (new Date() > new Date(inv.expires_at)) {
            return res.status(400).json({ message: 'Invitation has expired' });
        }

        res.json({ email: inv.email, role: inv.role_name, team_name: inv.team_name });
    } catch (err) {
        console.error('Error fetching invitation:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const acceptInvitation = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { full_name, pin } = req.body;

    // Validate 4-digit PIN
    if (!pin || !/^\d{4}$/.test(pin)) {
        return res.status(400).json({ message: 'Invalid 4-digit PIN' });
    }

    try {
        // Begin Transaction
        await db.query('BEGIN');

        const invQuery = await db.query(`
            SELECT id, email, role_id, company_id, team_id, status, expires_at 
            FROM Invitations 
            WHERE token = $1 FOR UPDATE
        `, [token]);

        if (invQuery.rows.length === 0) {
            await db.query('ROLLBACK');
            return res.status(404).json({ message: 'Invitation not found' });
        }

        const inv = invQuery.rows[0];
        if (inv.status !== 'pending' || new Date() > new Date(inv.expires_at)) {
            await db.query('ROLLBACK');
            return res.status(400).json({ message: 'Invitation invalid or expired' });
        }

        // Hash PIN
        // TODO: bcrypt.hashSync(pin, 10)
        const password_hash = 'hashed_' + pin;

        // Insert User
        const userResult = await db.query(`
            INSERT INTO Users (email, password_hash, role_id, company_id, full_name, team_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, role_id, company_id, email, full_name
        `, [inv.email, password_hash, inv.role_id, inv.company_id, full_name, inv.team_id]);

        const newUser = userResult.rows[0];

        // Get Role name
        const roleResult = await db.query('SELECT name FROM Roles WHERE id = $1', [newUser.role_id]);
        const roleName = roleResult.rows[0].name;

        // Update Invitation
        await db.query('UPDATE Invitations SET status = $1 WHERE id = $2', ['accepted', inv.id]);

        await db.query('COMMIT');

        // Generate JWT
        const jwtToken = jwt.sign(
            { id: newUser.id, company_id: newUser.company_id, role: roleName, email: newUser.email, full_name: newUser.full_name },
            env.JWT_SECRET as string,
            { expiresIn: env.JWT_EXPIRES_IN as any }
        );

        res.status(200).json({
            token: jwtToken,
            user: { id: newUser.id, role: roleName, full_name: newUser.full_name, email: newUser.email }
        });

    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Error accepting invitation:', err);
        res.status(500).json({ message: 'Error accepting invitation' });
    }
};
