import { Request, Response } from 'express';
import Admin from '../models/Admin';
import { CreateResponse } from '../util/response';

export const createAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;
        const exists = await Admin.findOne({ username });
        if (exists) {
            return res.json(CreateResponse(false, null, "Username already exists"));
        }
        const admin = await Admin.create({ username, password, role: 'admin' });
        return res.json(CreateResponse(true, "Admin created successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};

export const getAdmins = async (req: Request, res: Response): Promise<any> => {
    try {
        const admins = await Admin.find({ role: { $ne: 'superadmin' } }).select('-password');
        return res.json(CreateResponse(true, admins));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};

export const deleteAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deleted = await Admin.findByIdAndDelete(id);
        if (!deleted) {
            return res.json(CreateResponse(false, null, "Admin not found"));
        }
        return res.json(CreateResponse(true, "Admin deleted successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
};
