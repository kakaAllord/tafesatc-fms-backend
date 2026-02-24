import express, { Router, Express } from 'express';
import * as verseController from '../controllers/Verse';

const router: Router = express.Router();

const verseRoutes = (app: Express): Express => {
    router.get('/random', verseController.getRandomVerse);
    
    return app.use('/verse', router);
}

export default verseRoutes;