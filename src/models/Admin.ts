import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IAdmin {
    username: string;
    password: string;
    role: 'superadmin' | 'admin';
}

const adminSchema = new Schema<IAdmin>(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['superadmin', 'admin'], default: 'admin' }
    },
    {
        timestamps: true,
    }
);

adminSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const Admin = model<IAdmin>("Admin", adminSchema);
export default Admin;

