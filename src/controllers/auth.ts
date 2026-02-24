import { Request, Response } from 'express';
import { CreateResponse } from '../util/response';
import Admin from '../models/Admin';
import Family from '../models/Family';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';

export const loginAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;
        console.log("Login attempt for user: ", username);
        console.log("Password: ", password);
        const admin = await Admin.findOne({ username });
        console.log("Admin found: ", admin);
        if (!admin) {
            return res.status(401).json(CreateResponse(false, null, "Invalid credentials"));
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json(CreateResponse(false, null, "Invalid credentials"));
        }

        const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json(CreateResponse(true, { token, role: 'admin' }));
    } catch (error) {
        return res.status(500).json(CreateResponse(false, null, error));
    }
};

export const loginFamily = async (req: Request, res: Response): Promise<any> => {
    try {
        const { username, password } = req.body;
        const family = await Family.findOne({ username });
        if (!family) {
            return res.status(401).json(CreateResponse(false, null, "Invalid credentials"));
        }

        const isMatch = await bcrypt.compare(password, family.password);
        if (!isMatch) {
            return res.status(401).json(CreateResponse(false, null, "Invalid credentials"));
        }

        const token = jwt.sign({ id: family._id, role: 'family' }, JWT_SECRET, { expiresIn: '7d' });
        return res.json(CreateResponse(true, { token, role: 'family', family }));
    } catch (error) {
        return res.status(500).json(CreateResponse(false, null, error));
    }
};
