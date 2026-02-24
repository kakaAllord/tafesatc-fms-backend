import { Schema, model } from "mongoose"

export interface ICourse{
    name: string
}

const courseSchema = new Schema<ICourse>(
    {
        name: { type: String, required: true }
    }, 
    {
        timestamps: true
    }
)

const Course = model<ICourse>('Course', courseSchema)
export default Course;