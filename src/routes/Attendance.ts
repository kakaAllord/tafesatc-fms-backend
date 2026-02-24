import express, { Router, Express } from 'express';
import * as attendanceController from '../controllers/Attendance';
import { verifyToken, isAdmin } from '../middleware/auth';

const router: Router = express.Router();

const attendanceRoutes = (app: Express): Express => {

    // Submit attendance (Family -> Today only, Admin -> Any)
    router.post('/', verifyToken, attendanceController.createAttendance);

    // Get attendance (Admin sees all, Family sees theirs - logic in controller needs to handle restricted view if needed, or query params)
    router.get('/', verifyToken, attendanceController.getAttendance);

    // Metrics (Admin only)
    router.get('/metrics', attendanceController.getMetrics);
    router.get('/range', attendanceController.getAttendanceRange);

    return app.use('/attendance', router);
}

export default attendanceRoutes;
