"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
const env_1 = require("./env");
let poolConfig = {
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
};
// Use DATABASE_URL if provided (preferred for Supabase), otherwise fallback to individual vars
if (env_1.env.DATABASE_URL) {
    poolConfig.connectionString = env_1.env.DATABASE_URL;
    // Supabase requires SSL for remote connections
    poolConfig.ssl = { rejectUnauthorized: false };
}
else {
    poolConfig.host = env_1.env.DB_HOST;
    poolConfig.port = env_1.env.DB_PORT;
    poolConfig.user = env_1.env.DB_USER;
    poolConfig.password = env_1.env.DB_PASSWORD;
    poolConfig.database = env_1.env.DB_NAME;
}
exports.db = new pg_1.Pool(poolConfig);
// Test connection on startup
exports.db.connect()
    .then(client => {
    console.log('✅ Connected to PostgreSQL successfully (Supabase ready).');
    client.release();
})
    .catch(err => {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
});
