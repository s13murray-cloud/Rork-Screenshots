"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    JWT_SECRET: process.env.JWT_SECRET || 'super-secret-default-key-change-in-prod',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    // Supabase / External DB Connection String
    DATABASE_URL: process.env.DATABASE_URL || '',
    // Fallbacks if connection string is not used (Optional)
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_NAME: process.env.DB_NAME || 'postgres'
};
