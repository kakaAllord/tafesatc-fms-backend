import { Request, Response } from 'express';
import { CreateResponse } from '../util/response';

import User from '../models/User';


// export interface IUser{
//   name: string;
//   course: Schema.Types.ObjectId;
//   level: "4" | "5" | "6" | "7_1" | "7_2" | "8";
//   familyId: Schema.Types.ObjectId;
//   isParent: boolean;
// }


export const createUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, courseId, level, familyId, isParent } = req.body;

        //TODO: Encrypt the password

        const saved = await User.create({ name, courseId, level, familyId, isParent });
        if (saved) {
            return res.json(CreateResponse(true, "User Created Successfully"));
        }
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const { familyId } = req.query;
        const query: any = {};
        if (familyId) query.familyId = familyId;

        const users = await User.find(query).populate('courseId');
        if (!users) {
            return res.json(CreateResponse(false, null, "Failed to get Users"));
        }

        return res.json(CreateResponse(true, users));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

export const getUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        console.log("Requested user with ID: ", id);
        const user = await User.findById(id)
        if (!user) {
            return res.json(CreateResponse(false, null, "Failed to get User"));
        }

        return res.json(CreateResponse(true, user));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) {
            return res.json(CreateResponse(false, null, "Failed to delete user"));
        }
        return res.json(CreateResponse(true, "User deleted successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

export const updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, courseId, level, familyId, isParent } = req.body;

        const updated = await User.findByIdAndUpdate(id, { name, courseId, level, familyId, isParent });
        if (!updated) {
            return res.json(CreateResponse(false, null, "Failed to update user"));
        }
        return res.json(CreateResponse(true, "User updated successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}