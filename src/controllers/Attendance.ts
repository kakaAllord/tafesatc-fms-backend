import { Request, Response } from 'express';
import { CreateResponse } from '../util/response';
import Attendance from '../models/Attendance';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

export const createAttendance = async (req: AuthRequest, res: Response): Promise<any> => {
    try {
        const { attendances, date } = req.body; // attendances: [{ user_id, isPresent }]
        const user = req.user;

        if (!attendances || !Array.isArray(attendances)) {
            return res.status(400).json(CreateResponse(false, null, "Invalid attendance data"));
        }

        const attendanceDate = date ? new Date(date) : new Date();
        attendanceDate.setHours(0, 0, 0, 0);

        // Validation for Family/Parent
        if (user.role === 'family') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (attendanceDate.getTime() !== today.getTime()) {
                return res.status(403).json(CreateResponse(false, null, "Families can only submit attendance for today"));
            }
        }

        const operations = attendances.map((att: any) => ({
            updateOne: {
                filter: {
                    user_id: att.user_id,
                    date: attendanceDate
                },
                update: {
                    $set: {
                        family_id: user.role === 'family' ? user.id : att.family_id, // If admin, family_id must be provided or derived
                        isPresent: att.isPresent,
                        date: attendanceDate // Ensure date is set
                    }
                },
                upsert: true
            }
        }));

        // If Admin is submitting, they might need to ensure family_id is correct for each user?
        // Or we assume the frontend sends correct data.
        // If Family is submitting, we force their family_id.
        if (user.role === 'family') {
            operations.forEach((op: any) => {
                op.updateOne.update.$set.family_id = user.id;
            });
        }

        await Attendance.bulkWrite(operations);

        return res.json(CreateResponse(true, "Attendance submitted successfully"));
    } catch (error) {
        return res.status(500).json(CreateResponse(false, null, error));
    }
};

export const getAttendance = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params; // If getting for specific user/family
        const { date, startDate, endDate, familyId } = req.query;

        let query: any = {};

        if (date) {
            const start = new Date(date as string);
            const end = new Date(date as string);
            end.setHours(23, 59, 59, 999);
            query.date = { $gte: start, $lte: end };
        } else if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate as string),
                $lte: new Date(endDate as string)
            };
        }

        if (familyId) {
            query.family_id = familyId;
        }

        // If accessed via /user/:id or /family/:id routes (if we have those)
        if (id) {
            // We need to know if 'id' is user or family. 
            // Currently the route structure suggests /attendance/user/:id ??
            // Let's keep it simple for now based on query params or route logic
        }

        const data = await Attendance.find(query).sort({ date: -1 }).populate('user_id');
        return res.json(CreateResponse(true, data));
    } catch (error: any) {
        return res.status(500).json(CreateResponse(false, null, error.message));
    }
};

export const getMetrics = async (req: Request, res: Response): Promise<any> => {
    try {
        const { familyId, startDate, endDate, date } = req.query;

        const matchStage: any = {};

        // Date filtering
        if (date) {
            const d = new Date(date as string);
            d.setHours(0, 0, 0, 0);
            const dEnd = new Date(date as string);
            dEnd.setHours(23, 59, 59, 999);
            matchStage.date = { $gte: d, $lte: dEnd };
        } else if (startDate && endDate) {
            const s = new Date(startDate as string);
            s.setHours(0, 0, 0, 0);
            const e = new Date(endDate as string);
            e.setHours(23, 59, 59, 999);
            matchStage.date = { $gte: s, $lte: e };
        }

        // Family filtering
        if (familyId) {
            const mongoose = require('mongoose');
            matchStage.family_id = new mongoose.Types.ObjectId(familyId as string);
        }

        const pipeline: any[] = [];
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        pipeline.push(
            {
                $group: {
                    _id: "$date",
                    totalPresent: {
                        $sum: { $cond: ["$isPresent", 1, 0] }
                    },
                    totalAbsent: {
                        $sum: { $cond: ["$isPresent", 0, 1] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        );

        const metrics = await Attendance.aggregate(pipeline);

        return res.json(CreateResponse(true, metrics));
    } catch (error) {
        return res.status(500).json(CreateResponse(false, null, error));
    }
}

export const getAttendanceRange = async (req: Request, res: Response): Promise<any> => {
    try {
        const { familyId } = req.query;
        if (!familyId) {
            return res.status(400).json(CreateResponse(false, null, "familyId is required"));
        }

        const firstRecord = await Attendance.findOne({ family_id: familyId }).sort({ date: 1 });
        const lastRecord = await Attendance.findOne({ family_id: familyId }).sort({ date: -1 });

        return res.json(CreateResponse(true, {
            minDate: firstRecord ? firstRecord.date : null,
            maxDate: lastRecord ? lastRecord.date : new Date()
        }));
    } catch (error: any) {
        return res.status(500).json(CreateResponse(false, null, error.message));
    }
}
