// backend/src/models/course.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILesson {
  _id: Types.ObjectId;
  title: string;
  duration: string;       //"12m" or "1:24:20"
  videoUrl: string;
  completed?: boolean;    // client-level, optional
}

export interface ICourse extends Document {
  title: string;
  category: string;
  description: string;
  instructor: Types.ObjectId;     // ref User
  lessons: ILesson[];
  rating: number;
  reviewsCount: number;
  skills: string[];
  relatedCourses?: Types.ObjectId[];
  image?: string;                 // optional hero/card image
  featured?: boolean;
  owner?: Types.ObjectId;         // instructor user id (for auth/ownership)
}

const LessonSchema = new Schema<ILesson>(
{
    title: { type: String, required: true },
    duration: { type: String, required: true },
    videoUrl: { type: String, required: true },
    completed: { type: Boolean, default: false },
},
{ _id: true }
);

const CourseSchema = new Schema<ICourse>(
{
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lessons: { type: [LessonSchema], default: [] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount: { type: Number, default: 0 },
    skills: { type: [String], default: [], index: true },
    relatedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    image: { type: String },
    featured: { type: Boolean, default: false },
    owner: { type: Schema.Types.ObjectId, ref: "User" }, // who created/owns
},
{ timestamps: true }
);

export default mongoose.model<ICourse>("Course", CourseSchema);
