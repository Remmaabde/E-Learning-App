import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/authmiddleware";
import CourseProgress from "../models/progress";
import Course from "../models/course";

// GET /api/student/dashboard
export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string" || !("_id" in req.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id as Types.ObjectId;

    // Fetch enrolled courses and populate courseId
    const progress = await CourseProgress.find({ userId }).populate<{ courseId: { _id: Types.ObjectId; title: string } }>("courseId");

    const enrolledCourses = progress.map((p) => ({
      courseId: (p.courseId as any)._id.toString(),
      title: (p.courseId as any).title,
      overallPercent: p.overallPercent,
      lessonsCompleted: p.lessons.filter((l) => l.completed).length,
      totalLessons: p.lessons.length,
    }));

    // Recent activity
    const recentActivity = progress
      .map((p) =>
        p.lessons
          .filter((l) => l.completedAt)
          .map((l) => ({ lessonId: l.lessonId.toString(), completedAt: l.completedAt! }))
      )
      .flat()
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

    res.json({
      enrolledCourses,
      recentActivity,
      certificates: [], // Optional for now
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
};

// GET /api/student/activity
export const getActivity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string" || !("_id" in req.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id as Types.ObjectId;

    const progress = await CourseProgress.find({ userId });

    const recentActivity = progress
      .map((p) =>
        p.lessons
          .filter((l) => l.completedAt)
          .map((l) => ({ lessonId: l.lessonId.toString(), completedAt: l.completedAt! }))
      )
      .flat()
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());

    res.json(recentActivity);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch activity" });
  }
};

// POST /api/student/enrollments  { courseId }
export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string" || !("_id" in req.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id as Types.ObjectId;
    const { courseId } = req.body;

    if (!courseId) return res.status(400).json({ error: "courseId is required" });

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Check if already enrolled
    let progress = await CourseProgress.findOne({ userId, courseId });
    if (progress) return res.status(400).json({ error: "Already enrolled" });

    // Create initial progress entry
    progress = await CourseProgress.create({
      userId,
      courseId,
      lessons: [],
      overallPercent: 0,
    });

    res.status(201).json(progress);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to enroll in course" });
  }
};