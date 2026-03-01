import { Request } from 'express';

declare module 'cors';
declare module 'express';

export interface AuthRequest extends Request {
    user?: any;
    body: any;
}
