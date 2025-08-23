import mongoose, { Document, Schema } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  text: string;
  stars: number
}

const TestimonialSchema: Schema = new Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  stars: { type: Number, required: true },
  
});

export default mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
