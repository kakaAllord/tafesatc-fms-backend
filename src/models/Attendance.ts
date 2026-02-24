import { Schema, model} from "mongoose"

export interface IAttendance{
    date: Date,
    user_id: Schema.Types.ObjectId,
    family_id: Schema.Types.ObjectId
    isPresent: boolean,
}

const attendanceSchema = new Schema<IAttendance>(
    {
        date: { type: Date, required: true, default: Date.now },
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        family_id: { type: Schema.Types.ObjectId, ref: 'Family', required: true},
        isPresent: { type: Boolean, required: true, default: false }
    }, 
    {
        timestamps: true
    }
)

attendanceSchema.index({ user_id: 1, date: 1 }, { unique: true });

const Attendance = model<IAttendance>('Attendance', attendanceSchema);
export default Attendance;