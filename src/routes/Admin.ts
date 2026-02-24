import { Application } from "express";
import { createAdmin, getAdmins, deleteAdmin } from '../controllers/Admin';
import { verifyToken, isSuperAdmin } from '../middleware/auth';

export default function adminRoutes(app: Application) {
    app.post('/admin', verifyToken, isSuperAdmin, createAdmin);
    app.get('/admin', verifyToken, isSuperAdmin, getAdmins);
    app.delete('/admin/:id', verifyToken, isSuperAdmin, deleteAdmin);
}
