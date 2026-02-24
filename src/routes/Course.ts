import express, { Router, Express } from 'express';
import * as courseController from '../controllers/Course';

const router: Router = express.Router();

const courseRoutes = ( app: Express ): Express => {

    router.post('', courseController.createCourse); // create Course
    router.get('/all', courseController.getAllCourses); //get courses
    router.get('/namesAndIds', courseController.getCourseNamesAndIds); // Return Course Names and Ids
    router.get('/:id', courseController.getCourse); // get one course
    router.patch('/:id', courseController.updateCourse); // Edit Course
    router.delete('/:id', courseController.deleteCourse); // Delete Course

    return app.use('/course', router);
}

export default courseRoutes;