import mongoose, { Document, Schema, Types } from "mongoose";

export type QuestionType = "multiple-choice" | "true-false" | "short-answer";

export interface IQuestion {
  _id: Types.ObjectId;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer?: string | number;
  points?: number;
}

export interface IQuiz extends Document {
  title: string;
  description?: string;
  lessonId?: Types.ObjectId;       
  courseId: Types.ObjectId;     
  questions: IQuestion[];
  timeLimit?: number;          
  timeLimitSec?: number;          
  passingScore?: number;
  totalPoints?: number;
  isActive: boolean;
  createdBy: Types.ObjectId;      
}

const QuestionSchema = new Schema<IQuestion>(
  {
    type: { type: String, enum: ["multiple-choice", "true-false", "short-answer"], required: true },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: Schema.Types.Mixed },
    points: { type: Number, default: 1 },
  },
  { _id: true }
);

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    description: { type: String },
    lessonId: { type: Schema.Types.ObjectId },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    questions: { type: [QuestionSchema], default: [] },
    timeLimit: { type: Number },
    timeLimitSec: { type: Number },
    passingScore: { type: Number, default: 70 },
    totalPoints: { type: Number },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
