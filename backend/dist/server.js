"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const errorHandler_1 = require("./middleware/errorHandler");
// Import Routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const equipment_routes_1 = __importDefault(require("./routes/equipment.routes"));
const checklists_routes_1 = __importDefault(require("./routes/checklists.routes"));
const inspections_routes_1 = __importDefault(require("./routes/inspections.routes"));
const faults_routes_1 = __importDefault(require("./routes/faults.routes"));
const media_routes_1 = __importDefault(require("./routes/media.routes"));
const app = (0, express_1.default)();
// Middleware
// CORS Configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8081', 'http://localhost:19006'], // Common frontend and Expo React Native web ports
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});
// API Routes
app.use('/auth', auth_routes_1.default);
app.use('/equipment', equipment_routes_1.default);
app.use('/checklists', checklists_routes_1.default);
app.use('/inspections', inspections_routes_1.default);
app.use('/faults', faults_routes_1.default);
app.use('/media', media_routes_1.default);
// Error Handling Middleware (must be last)
app.use(errorHandler_1.errorHandler);
app.listen(env_1.env.PORT, () => {
    console.log(`Server running on port ${env_1.env.PORT}`);
});
exports.default = app;
