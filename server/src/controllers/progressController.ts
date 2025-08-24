
import { Response } from "express";
import type { AuthRequest } from "../middleware/authmiddleware";
import CourseProgress from "../models/progress";
import Course from "../models/course";
import { Types } from "mongoose";

<<<<<<< HEAD
// POST /api/progress/lesson  { courseId, lessonId, completed, secondsWatched }
=======

>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
export const updateLessonProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user && typeof req.user !== "string" && "_id" in req.user) 
      ? req.user._id as Types.ObjectId 
      : undefined;
    const { courseId, lessonId, completed = false, secondsWatched = 0 } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const totalLessons = course.lessons.length || 1;

    const prog = await CourseProgress.findOneAndUpdate(
      { userId, courseId },
      {},
      { new: true, upsert: true }
    );

    const idx = prog.lessons.findIndex(l => l.lessonId.toString() === lessonId);
    if (idx >= 0) {
      if (prog && prog.lessons && prog.lessons[idx]) {
        prog.lessons[idx].completed = completed || prog.lessons[idx].completed;
      }
      if (prog && prog.lessons && prog.lessons[idx]) {
        prog.lessons[idx].secondsWatched = Math.max(
          prog.lessons[idx].secondsWatched || 0,
          secondsWatched
        );
      }
      if (completed && prog.lessons[idx] && !prog.lessons[idx].completedAt) {
        prog.lessons[idx].completedAt = new Date();
      }
    } else {
      prog.lessons.push({
        lessonId,
        completed,
        secondsWatched,
        completedAt: completed ? new Date() : undefined,
      } as any);
    }

    const completedCount = prog.lessons.filter(l => l.completed).length;
    prog.overallPercent = Math.round((completedCount / totalLessons) * 100);
    await prog.save();

    res.json(prog);
  } catch {
    res.status(400).json({ error: "Failed to update lesson progress" });
  }
};

<<<<<<< HEAD
// GET /api/progress/course/:id
=======
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
export const getCourseProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user && typeof req.user !== "string" && "_id" in req.user) 
      ? req.user._id as Types.ObjectId 
      : undefined;
    const courseId = req.params.id;
    const prog = await CourseProgress.findOne({ userId, courseId });
    res.json(prog || { userId, courseId, lessons: [], overallPercent: 0 });
  } catch {
    res.status(500).json({ error: "Failed to get course progress" });
  }
};

<<<<<<< HEAD
// PUT /api/progress/course/:id  { overallPercent? }  (usually derived, but included)
=======

>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
export const putCourseProgress = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user && typeof req.user !== "string" && "_id" in req.user) 
      ? req.user._id as Types.ObjectId 
      : undefined;
    const courseId = req.params.id;

    const prog = await CourseProgress.findOneAndUpdate(
      { userId, courseId },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(prog);
  } catch {
    res.status(400).json({ error: "Failed to update course progress" });
  }
};
