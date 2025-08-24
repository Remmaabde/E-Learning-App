import mongoose, { Document, Schema, Types } from "mongoose";

export type QuestionType = "multiple-choice" | "true-false" | "short-answer";

export interface IQuestion {
  _id: Types.ObjectId;
  type: QuestionType;
  questionText: string;
  options?: string[];
<<<<<<< HEAD
  correctAnswer?: string;
}

export interface IQuiz extends Document {
  lessonId: Types.ObjectId;       
  courseId: Types.ObjectId;     
  questions: IQuestion[];
  timeLimitSec?: number;          
=======
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
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
  createdBy: Types.ObjectId;      
}

const QuestionSchema = new Schema<IQuestion>(
  {
    type: { type: String, enum: ["multiple-choice", "true-false", "short-answer"], required: true },
    questionText: { type: String, required: true },
    options: [{ type: String }],
<<<<<<< HEAD
    correctAnswer: { type: String },
=======
    correctAnswer: { type: Schema.Types.Mixed },
    points: { type: Number, default: 1 },
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
  },
  { _id: true }
);

const QuizSchema = new Schema<IQuiz>(
  {
<<<<<<< HEAD
    lessonId: { type: Schema.Types.ObjectId, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    questions: { type: [QuestionSchema], default: [] },
    timeLimitSec: { type: Number },
=======
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
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
