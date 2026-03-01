import { Request } from 'express';

declare module 'cors';

export interface AuthRequest extends Request {
    user?: any;
    body: any;
}
