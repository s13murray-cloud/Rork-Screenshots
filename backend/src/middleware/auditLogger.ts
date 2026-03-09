import { Response, NextFunction } from 'express';
import { db } from '../config/db';
import { AuthRequest } from './auth';

export const auditLogger = (actionType: string, entityType: string) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        // Hook into the response `send` or `json` methods to only log on successful modifications.
        // For simplicity in scaffolding, this logs immediately before controller action.

        try {
            const userId = req.user?.id || '00000000-0000-0000-0000-000000000000'; // Fallback for system hooks
            const entityId = req.params.id || req.body.id || req.body.inspection_id || '00000000-0000-0000-0000-000000000000';

            // This is a basic implementation. A production logger might diff DB states.
            await db.query(`
                INSERT INTO AuditLogs (user_id, action_type, entity_type, entity_id, after_state)
                VALUES ($1, $2, $3, $4, $5)
            `, [
                userId,
                actionType,
                entityType,
                entityId,
                req.body // The requested change payload used as after_state logic
            ]);

            next();
        } catch (error) {
            console.error('Audit Logger failed:', error);
            next(error);
        }
    };
};
