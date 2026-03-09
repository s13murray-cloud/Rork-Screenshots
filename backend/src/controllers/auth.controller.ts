import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';
import { env } from '../config/env';

export const login = async (req: Request, res: Response) => {
    // Scaffold login logic (assuming pre-hashed passwords validation omitted for brevity)
    const { email, password } = req.body;

    try {
        const result = await db.query(`
            SELECT u.id, u.email, u.password_hash, u.company_id, r.name as role 
            FROM Users u 
            JOIN Roles r ON u.role_id = r.id 
            WHERE u.email = $1
        `, [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];
        // TODO: bcrypt.compareSync(password, user.password_hash)

        const token = jwt.sign(
            { id: user.id, company_id: user.company_id, role: user.role, email: user.email },
            env.JWT_SECRET as string,
            { expiresIn: env.JWT_EXPIRES_IN as any }
        );

        res.json({ token, user: { id: user.id, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const register = async (req: Request, res: Response) => {
    // Note: Usually Admin only
    const { email, password, role_id, full_name } = req.body;

    try {
        // TODO: bcrypt.hashSync(password, 10)
        const password_hash = 'hashed_' + password;

        const result = await db.query(`
            INSERT INTO Users (email, password_hash, role_id, company_id, full_name)
            VALUES ($1, $2, $3, $4, $5) RETURNING id, email
        `, [email, password_hash, role_id, req.body.company_id || '00000000-0000-0000-0000-000000000000', full_name]);

        res.status(201).json({ user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ message: 'Failed to register user (email might exist)' });
    }
};
