import { Request, Response } from 'express';
import { CreateResponse } from '../util/response';

import Course from '../models/Course';


export const createCourse = async ( req: Request, res: Response ) : Promise<any> => {
    try {
        const { name, username, password } = req.body;

        //TODO: Encrypt the password

        const saved = await Course.create({ name });
        if (saved) {
            return res.json(CreateResponse(true, "Course Created Successfully"));
        }
    } catch(error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const getAllCourses = async ( req: Request, res: Response) : Promise<any> =>{
    try{
        const courses = await Course.find()
        if (!courses) {
            return res.json(CreateResponse(false, null, "Failed to get Courses"));
        }

        return res.json(CreateResponse(true, courses));
    } catch(error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const getCourse = async ( req: Request, res: Response) : Promise<any> =>{
    try{
        const { id } = req.params;
        const course = await Course.findById(id)
        if (!course) {
            return res.json(CreateResponse(false, null, "Failed to get Course"));
        }

        return res.json(CreateResponse(true, course));
    } catch(error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const deleteCourse = async ( req: Request, res: Response) : Promise<any> =>{
    try{
        const { id } = req.params;
        const deleted = await Course.findByIdAndDelete(id);
        if ( !deleted ){
            return res.json(CreateResponse(false, null, "Failed to delete course"));
        }
        return res.json(CreateResponse(true, "Course deleted successfully"));
    } catch(error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const updateCourse = async ( req: Request, res: Response) : Promise<any> =>{
    try{
        const { id } = req.params;
        const { name } = req.body;

        const updated = await Course.findByIdAndUpdate(id, { name });
        if (!updated){
            return res.json(CreateResponse(false, null, "Failed to update course"));
        }
        return res.json(CreateResponse(true, "Course updated successfully"));
    } catch(error){
        return res.json(CreateResponse(false, null, error));
    }
}

export const getCourseNamesAndIds = async ( req: Request, res: Response) : Promise<any> =>{
    try{
        const courseNamesAndIds = Course.find({}).select('name _id');
        if(!courseNamesAndIds){
            return res.json(CreateResponse(false, null, "Failed to fetch Course names and Ids"));
        }

        return res.json(CreateResponse(true, courseNamesAndIds));
    } catch(error){
        return res.json(CreateResponse(false, null, error));
    }
}

// export const g = async ( req: Request, res: Response) : Promise<any> =>{
//     try{

//     } catch(error){
//         return res.json(CreateResponse(false, null, error));
//     }
// }