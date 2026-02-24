import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CreateResponse } from '../util/response';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

export interface AuthRequest extends Request {
    user?: any;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): any => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json(CreateResponse(false, null, "Access Denied"));
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        return res.status(400).json(CreateResponse(false, null, "Invalid Token"));
    }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): any => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
        next();
    } else {
        return res.status(403).json(CreateResponse(false, null, "Admin access required"));
    }
};

export const isSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction): any => {
    if (req.user && req.user.role === 'superadmin') {
        next();
    } else {
        return res.status(403).json(CreateResponse(false, null, "Super Admin access required"));
    }
};
