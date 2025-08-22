import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description: string;
  image: string;
  instructor: string;
  duration: string;
  category: string;
  rating: number;
  featured: boolean;
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  instructor: { type: String, required: true },
  duration: { type: String, required: true },
  category: { type: String, required: true },
  rating: { type: Number, required: true },
  featured: { type: Boolean, default: false },
});

export default mongoose.model<ICourse>("Course", CourseSchema);
