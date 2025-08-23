import mongoose, { Document, Schema, Types } from "mongoose";

export type QuestionType = "multiple-choice" | "true-false" | "short-answer";

export interface IQuestion {
  _id: Types.ObjectId;
  type: QuestionType;
  questionText: string;
  options?: string[];
  correctAnswer?: string;
}

export interface IQuiz extends Document {
  lessonId: Types.ObjectId;       // link to Course.lessons subdoc id
  courseId: Types.ObjectId;       // helpful for querying by course
  questions: IQuestion[];
  timeLimitSec?: number;          // optional timer
  createdBy: Types.ObjectId;      // instructor/admin
}

const QuestionSchema = new Schema<IQuestion>(
  {
    type: { type: String, enum: ["multiple-choice", "true-false", "short-answer"], required: true },
    questionText: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String },
  },
  { _id: true }
);

const QuizSchema = new Schema<IQuiz>(
  {
    lessonId: { type: Schema.Types.ObjectId, required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    questions: { type: [QuestionSchema], default: [] },
    timeLimitSec: { type: Number },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IQuiz>("Quiz", QuizSchema);
