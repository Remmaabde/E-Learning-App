import { Request, Response } from "express";
import CourseProgress from "../models/progress";
import Course from "../models/course";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/authmiddleware";

export const getStudentDashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string" || !("_id" in req.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id as Types.ObjectId;

    // Fetch enrolled courses and populate courseId
    const progress = await CourseProgress.find({ userId }).populate<{ courseId: { title: string } }>("courseId");

    const enrolledCourses = progress.map((p) => ({
      courseId: p.courseId._id.toString(),
      title: (p.courseId as any).title, // populated object, use any or define type
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

    // Send final dashboard
    res.json({
      enrolledCourses,
      recentActivity,
      certificates: [], // you can implement later
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
};
