"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../config/db");
const env_1 = require("../config/env");
const login = async (req, res) => {
    // Scaffold login logic (assuming pre-hashed passwords validation omitted for brevity)
    const { email, password } = req.body;
    try {
        const result = await db_1.db.query(`
            SELECT u.id, u.email, u.password_hash, r.name as role 
            FROM Users u 
            JOIN Roles r ON u.role_id = r.id 
            WHERE u.email = $1
        `, [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const user = result.rows[0];
        // TODO: bcrypt.compareSync(password, user.password_hash)
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, email: user.email }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
        res.json({ token, user: { id: user.id, role: user.role } });
    }
    catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.login = login;
const register = async (req, res) => {
    // Note: Usually Admin only
    const { email, password, role_id, first_name, last_name } = req.body;
    try {
        // TODO: bcrypt.hashSync(password, 10)
        const password_hash = 'hashed_' + password;
        const result = await db_1.db.query(`
            INSERT INTO Users (email, password_hash, role_id, first_name, last_name)
            VALUES ($1, $2, $3, $4, $5) RETURNING id, email
        `, [email, password_hash, role_id, first_name, last_name]);
        res.status(201).json({ user: result.rows[0] });
    }
    catch (err) {
        res.status(500).json({ message: 'Failed to register user (email might exist)' });
    }
};
exports.register = register;
