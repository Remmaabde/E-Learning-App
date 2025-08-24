
// backend/src/models/course.ts
import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILesson {
  _id: Types.ObjectId;
  title: string;
<<<<<<< HEAD
  duration: string;       //"12m" or "1:24:20"
  videoUrl: string;
=======
  description?: string;   // optional lesson description
  duration: string;       //"12m" or "1:24:20"
  videoUrl: string;
  order?: number;         // lesson order
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
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
<<<<<<< HEAD
=======
  published?: boolean;            // course publication status
  level?: string;                 // beginner, intermediate, advanced
  tags?: string[];               // course tags
  price?: number;                // course price
  createdAt?: Date;
  updatedAt?: Date;
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
}

const LessonSchema = new Schema<ILesson>(
{
    title: { type: String, required: true },
<<<<<<< HEAD
    duration: { type: String, required: true },
    videoUrl: { type: String, required: true },
=======
    description: { type: String },
    duration: { type: String, required: true },
    videoUrl: { type: String, required: true },
    order: { type: Number },
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
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
    featured: { type: Boolean, default: true },
<<<<<<< HEAD
    owner: { type: Schema.Types.ObjectId, ref: "User" }, 
=======
    owner: { type: Schema.Types.ObjectId, ref: "User" },
    published: { type: Boolean, default: false },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    tags: { type: [String], default: [] },
    price: { type: Number, default: 0 },
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
},
{ timestamps: true }
);


export default mongoose.model<ICourse>("Course", CourseSchema);
