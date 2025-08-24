import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/authmiddleware";
import Course, { ICourse } from "../models/course";
import CourseProgress from "../models/progress";
import Quiz from "../models/quiz";

// Helper to safely get instructor/owner id
const getUserId = (req: AuthRequest): Types.ObjectId | null => {
  if (!req.user || typeof req.user === "string" || !("_id" in req.user)) return null;
  return req.user._id as Types.ObjectId;
};

// GET /api/instructor/dashboard
export const getInstructorDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // Ownership by either 'owner' or 'instructor'
    const courses: ICourse[] = await Course.find({
      $or: [{ owner: userId }, { instructor: userId }],
    });

    const courseIds: Types.ObjectId[] = courses.map(c => c._id as Types.ObjectId);

    const progressDocs = await CourseProgress.find({ courseId: { $in: courseIds } });

    const totalCourses = courses.length;
    const publishedCourses = courses.filter(c => !!c.featured).length; // featured == published
    const totalStudents = progressDocs.length; // one (userId, courseId) per doc in your schema

    const avgProgressByCourse = courseIds.map((cid) => {
      const cidStr = cid.toString();
      const ps = progressDocs.filter(p => p.courseId.toString() === cidStr);
      const avg = ps.length
        ? Math.round(ps.reduce((a, b) => a + (b.overallPercent || 0), 0) / ps.length)
        : 0;
      return { courseId: cidStr, avgPercent: avg };
    });

    const topCoursesByStudents = courseIds
      .map((cid) => {
        const cidStr = cid.toString();
        return {
          courseId: cidStr,
          students: progressDocs.filter(p => p.courseId.toString() === cidStr).length,
        };
      })
      .sort((a, b) => b.students - a.students)
      .slice(0, 5);

    res.json({
      summary: { totalCourses, publishedCourses, totalStudents },
      avgProgressByCourse,
      topCoursesByStudents,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load dashboard" });
  }
};

// GET /api/instructor/courses
export const getInstructorCourses = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const courses = await Course.find({
      $or: [{ owner: userId }, { instructor: userId }],
    }).lean<ICourse[]>();

    const courseIds = courses.map(c => c._id as Types.ObjectId);
    const progressDocs = await CourseProgress.find({ courseId: { $in: courseIds } });

    const withMetrics = courses.map(c => {
      const cidStr = (c._id as Types.ObjectId).toString();
      const students = progressDocs.filter(p => p.courseId.toString() === cidStr);
      const avg = students.length
        ? Math.round(students.reduce((a, b) => a + (b.overallPercent || 0), 0) / students.length)
        : 0;

      return {
        id: cidStr,
        title: c.title,
        category: c.category,
        featured: !!c.featured,          // publish flag
        lessons: c.lessons?.length || 0,
        students: students.length,
        avgProgress: avg,
        rating: c.rating || 0,
        reviewsCount: c.reviewsCount || 0,
      };
    });

    res.json(withMetrics);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load courses" });
  }
};

// GET /api/instructor/students/:courseId
export const getInstructorStudents = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { courseId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      $or: [{ owner: userId }, { instructor: userId }],
    });
    if (!course) return res.status(404).json({ error: "Course not found or not owned by you" });

    const progress = await CourseProgress
      .find({ courseId })
      .populate("userId", "name email")
      .lean();

    const rows = progress.map(p => ({
      studentId: (p.userId as any)?._id?.toString(),
      name: (p.userId as any)?.name,
      email: (p.userId as any)?.email,
      overallPercent: p.overallPercent,
      lessonsCompleted: p.lessons.filter(l => l.completed).length,
      totalLessons: course.lessons.length,
      lastUpdated: p.updatedAt,
    }));

    res.json({ course: { id: course._id, title: course.title }, students: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to load students" });
  }
};

// POST /api/instructor/courses/:courseId/publish  (toggle featured)
export const togglePublishCourse = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { courseId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      $or: [{ owner: userId }, { instructor: userId }],
    });
    if (!course) return res.status(404).json({ error: "Course not found or not owned by you" });

    course.featured = !course.featured;
    await course.save();

    res.json({ id: course._id, featured: !!course.featured });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to toggle publish" });
  }
};

// POST /api/instructor/courses
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { title, description, category, lessons } = req.body;

    const course = await Course.create({
      title,
      description,
      category,                        // required by your schema
      lessons: (lessons || []).map((l: any) => ({
        title: l.title,
        videoUrl: l.videoUrl,
        duration: l.duration,          // required by your schema
      })),
      instructor: userId,              // required
      owner: userId,                   // for easier ownership checks
      featured: false,                 // start as draft
      rating: 0,
      reviewsCount: 0,
      skills: [],
    });

    res.status(201).json({ id: course._id, title: course.title });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ error: e.message || "Failed to create course" });
  }
};

// PUT /api/instructor/courses/:courseId
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { courseId } = req.params;

    const course = await Course.findOneAndUpdate(
      { _id: courseId, $or: [{ owner: userId }, { instructor: userId }] },
      { $set: req.body },
      { new: true }
    );
    if (!course) return res.status(404).json({ error: "Course not found or not owned by you" });

    res.json(course);
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ error: e.message || "Failed to update course" });
  }
};

// DELETE /api/instructor/courses/:courseId
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { courseId } = req.params;

    const course = await Course.findOneAndDelete({
      _id: courseId,
      $or: [{ owner: userId }, { instructor: userId }],
    });
    if (!course) return res.status(404).json({ error: "Course not found or not owned by you" });

    await Quiz.deleteMany({ courseId: course._id }); // optional cleanup

    res.json({ deleted: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to delete course" });
  }
};
