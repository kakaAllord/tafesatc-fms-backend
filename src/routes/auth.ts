import express, { Router, Express } from 'express';
import * as authController from '../controllers/auth';

const router: Router = express.Router();

const authRoutes = (app: Express): Express => {
    router.post('/admin/login', authController.loginAdmin);
    router.post('/family/login', authController.loginFamily);

    return app.use('/auth', router);
}

export default authRoutes;
