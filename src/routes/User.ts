import express, { Router, Express } from 'express';
import * as userController from '../controllers/User';
import { verifyToken, isAdmin } from '../middleware/auth';

const router: Router = express.Router();

const userRoutes = (app: Express): Express => {
    // Only Admin or Family (Parent) can create users (Parents/Children)
    // verifyToken is needed. 
    // If we want detailed permissions:
    // - Admin creates Parents (isParent=true)
    // - Family creates Children (isParent=false)
    // For now, we'll just check for a valid token.
    router.post('/', verifyToken, userController.createUser);

    router.get('/all', verifyToken, userController.getAllUsers);
    router.get('/:id', verifyToken, userController.getUser);
    router.patch('/:id', verifyToken, userController.updateUser); // Potentially restrict who can update
    router.delete('/:id', verifyToken, isAdmin, userController.deleteUser); // Only Admin delete? Or Family too? Let's say Admin for now for safety.

    return app.use('/user', router);
}

export default userRoutes;
