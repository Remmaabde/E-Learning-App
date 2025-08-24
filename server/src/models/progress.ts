import mongoose, { Document, Schema, Types } from "mongoose";

export interface ILessonProgress {
  lessonId: Types.ObjectId;
  completed: boolean;
  completedAt?: Date;
  secondsWatched?: number;
}

export interface ICourseProgress extends Document {
  userId: Types.ObjectId;          // student
  courseId: Types.ObjectId;
  lessons: ILessonProgress[];      // 1 entry per lesson user has touched
  overallPercent: number;          // denormalized for quick display
<<<<<<< HEAD
=======
  enrolledAt: Date;                // when student enrolled
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
  updatedAt: Date;
}

const LessonProgressSchema = new Schema<ILessonProgress>({
  lessonId: { type: Schema.Types.ObjectId, required: true },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
  secondsWatched: { type: Number, default: 0 },
});

const CourseProgressSchema = new Schema<ICourseProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    lessons: { type: [LessonProgressSchema], default: [] },
    overallPercent: { type: Number, default: 0 },
<<<<<<< HEAD
=======
    enrolledAt: { type: Date, default: Date.now },
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
  },
  { timestamps: true }
);

CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<ICourseProgress>("CourseProgress", CourseProgressSchema);
