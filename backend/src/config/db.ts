import { Pool, PoolConfig } from 'pg';
import { env } from './env';

let poolConfig: PoolConfig = {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};

// Use DATABASE_URL if provided (preferred for Supabase), otherwise fallback to individual vars
if (env.DATABASE_URL) {
    poolConfig.connectionString = env.DATABASE_URL;
    // Supabase requires SSL for remote connections
    poolConfig.ssl = { rejectUnauthorized: false };
} else {
    poolConfig.host = env.DB_HOST;
    poolConfig.port = env.DB_PORT;
    poolConfig.user = env.DB_USER;
    poolConfig.password = env.DB_PASSWORD;
    poolConfig.database = env.DB_NAME;
}

export const db = new Pool(poolConfig);

// Test connection on startup
db.connect()
    .then(client => {
        console.log('✅ Connected to PostgreSQL successfully (Supabase ready).');
        client.release();
    })
    .catch(err => {
        console.error('❌ Failed to connect to PostgreSQL:', err.message);
    });
