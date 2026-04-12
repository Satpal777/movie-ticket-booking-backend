import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../utils/errors.js';
import { verifyAccessToken } from '../../utils/jwt.js';

declare global {
    namespace Express {
        interface Request {
            userId?: number;
        }
    }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return next();
    }

    if (!authHeader.startsWith('Bearer ')) {
        throw AppError.unauthorized('Authorization header must start with Bearer');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        throw AppError.unauthorized('Authorization header must start with Bearer and followed by token');
    }

    const payload = verifyAccessToken(token);
    console.log('Auth Middleware: Checking authentication for request to', payload);

    if (!payload || !payload?.id) {
        throw AppError.unauthorized('Invalid or expired token');
    }

    req.userId = payload.id;

    next();
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.userId) {
        throw AppError.unauthorized();
    }
    next();
}