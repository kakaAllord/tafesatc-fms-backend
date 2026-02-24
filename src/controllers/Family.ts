import { Request, Response } from 'express';
import { CreateResponse } from '../util/response';

import Family from '../models/Family';


export const createFamily = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, username, password } = req.body;

        //TODO: Encrypt the password

        const saved = await Family.create({ name, username, password });
        if (saved) {
            return res.json(CreateResponse(true, "Family Created Successfully"));
        }
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

export const getAllFamilies = async (req: Request, res: Response): Promise<any> => {
    try {
        const families = await Family.find()
        if (!families) {
            return res.json(CreateResponse(false, null, "Failed to get Families"));
        }

        return res.json(CreateResponse(true, families));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

export const getFamily = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        console.log("Requested family with ID: ", id);
        const family = await Family.findById(id)
        if (!family) {
            return res.json(CreateResponse(false, null, "Failed to get Family"));
        }

        return res.json(CreateResponse(true, family));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

export const deleteFamily = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deleted = await Family.findByIdAndDelete(id);
        if (!deleted) {
            return res.json(CreateResponse(false, null, "Failed to delete family"));
        }
        return res.json(CreateResponse(true, "Family deleted successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

export const updateFamily = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { name, username, password } = req.body;

        const family = await Family.findById(id);
        if (!family) {
            return res.json(CreateResponse(false, null, "Family not found"));
        }

        family.name = name || family.name;
        family.username = username || family.username;
        if (password) {
            family.password = password;
        }

        const updated = await family.save(); // This triggers the pre-save hook for hashing

        if (!updated) {
            return res.json(CreateResponse(false, null, "Failed to update family"));
        }
        return res.json(CreateResponse(true, "Family updated successfully"));
    } catch (error) {
        return res.json(CreateResponse(false, null, error));
    }
}

// export const g = async ( req: Request, res: Response) : Promise<any> =>{
//     try{

//     } catch(error){
//         return res.json(CreateResponse(false, null, error));
//     }
// }