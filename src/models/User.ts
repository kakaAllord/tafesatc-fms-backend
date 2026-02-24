import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  courseId: Schema.Types.ObjectId;
  level: "4" | "5" | "6" | "7_1" | "7_2" | "8";
  familyId: Schema.Types.ObjectId;
  isParent: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    level: {
      type: String,
      enum: ["4", "5", "6", "7_1", "7_2", "8"],
      required: true,
    },
    familyId: { type: Schema.Types.ObjectId, ref: "Family", required: true },
    isParent: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>("User", userSchema);
export default User;