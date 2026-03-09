import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Import Routes
import authRoutes from './routes/auth.routes';
import equipmentRoutes from './routes/equipment.routes';
import checklistsRoutes from './routes/checklists.routes';
import inspectionsRoutes from './routes/inspections.routes';
import faultsRoutes from './routes/faults.routes';
import mediaRoutes from './routes/media.routes';
import usersRoutes from './routes/users.routes';
import invitationsRoutes from './routes/invitations.routes';

const app = express();

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

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/equipment', equipmentRoutes);
app.use('/checklists', checklistsRoutes);
app.use('/inspections', inspectionsRoutes);
app.use('/faults', faultsRoutes);
app.use('/media', mediaRoutes);
app.use('/users', usersRoutes);
app.use('/invitations', invitationsRoutes);

// Error Handling Middleware (must be last)
app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
});

export default app;
