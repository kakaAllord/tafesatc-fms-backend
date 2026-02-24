import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IFamily {
  name: string;
  username: string;
  password: string;
}

const familySchema = new Schema<IFamily>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

familySchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const Family = model<IFamily>("Family", familySchema);
export default Family;