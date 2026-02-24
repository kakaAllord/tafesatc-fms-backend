import express, { Router, Express } from 'express';
import * as familyController from '../controllers/Family';
import { verifyToken, isAdmin } from '../middleware/auth';


const router: Router = express.Router();

const familyRoutes = (app: Express): Express => {

    router.post('', verifyToken, isAdmin, familyController.createFamily); // create Family (Admin Only)
    router.get('/all', verifyToken, isAdmin, familyController.getAllFamilies); //get families (Admin Only)
    router.get('/:id', verifyToken, familyController.getFamily); // get one family (Admin or Family)
    router.patch('/:id', verifyToken, isAdmin, familyController.updateFamily); // Edit Family (Admin Only)
    router.delete('/:id', verifyToken, isAdmin, familyController.deleteFamily); // Delete Family (Admin Only)


    // router.post('', familyController.createFamily); // create Family (Admin Only)
    // router.get('/all', familyController.getAllFamilies); //get families (Admin Only)
    // router.get('/:id',  familyController.getFamily); // get one family (Admin or Family)
    // router.patch('/:id', familyController.updateFamily); // Edit Family (Admin Only)
    // router.delete('/:id', familyController.deleteFamily); // Delete Family (Admin Only)

    return app.use('/family', router);
}

export default familyRoutes;