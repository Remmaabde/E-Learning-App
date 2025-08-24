import { Response } from "express";
import { Types } from "mongoose";
import { AuthRequest } from "../middleware/authmiddleware";
import CourseProgress from "../models/progress";
import Course from "../models/course";

// GET /api/student/dashboard
export const getDashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string" || !("id" in req.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id as Types.ObjectId;

    // Fetch enrolled courses and populate courseId
    const progress = await CourseProgress.find({ userId }).populate<{ courseId: { _id: Types.ObjectId; title: string; image?: string } }>("courseId");

    const enrolledCourses = progress.map((p) => ({
      courseId: (p.courseId as any)._id.toString(),
      title: (p.courseId as any).title,
      image: (p.courseId as any).image || null,
      overallPercent: p.overallPercent,
      lessonsCompleted: p.lessons.filter((l) => l.completed).length,
      totalLessons: p.lessons.length,
      enrolledAt: new Date(),
    }));

    // Recent activity - last 10 activities with course and lesson details
    const recentActivityRaw = await CourseProgress.find({ userId })
      .populate("courseId", "title lessons")
      .sort({ updatedAt: -1 })
      .exec();

    const activityItems = recentActivityRaw
      .map((p) => {
        const course = p.courseId as any;
        const courseTitle = course?.title || "Unknown Course";
        const courseId = course?._id.toString();
        
        return p.lessons
          .filter((l) => l.completedAt)
          .map((l) => {
            // Find the lesson title from the course lessons
            const lesson = course?.lessons?.find((cl: any) => cl._id.toString() === l.lessonId.toString());
            const lessonTitle = lesson?.title || `Lesson ${l.lessonId}`;
            
            return { 
              lessonId: l.lessonId.toString(),
              lessonTitle: lessonTitle,
              completedAt: l.completedAt!,
              courseTitle: courseTitle,
              courseId: courseId
            };
          });
      })
      .flat()
      .sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime())
      .slice(0, 10);

    // Mock certificates for completed courses (100% progress)
    const certificates = enrolledCourses
      .filter(course => course.overallPercent === 100)
      .map(course => ({
        name: `${course.title} Completion Certificate`,
        url: `/certificates/${course.courseId}`,
        courseId: course.courseId,
        issuedAt: new Date().toISOString(),
      }));

    res.json({
      enrolledCourses,
      recentActivity: activityItems,
      certificates,
      stats: {
        totalCourses: enrolledCourses.length,
        completedCourses: certificates.length,
        totalLessonsCompleted: enrolledCourses.reduce((sum, course) => sum + course.lessonsCompleted, 0),
        averageProgress: enrolledCourses.length > 0 ? 
          Math.round(enrolledCourses.reduce((sum, course) => sum + course.overallPercent, 0) / enrolledCourses.length) : 0
      }
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
};

// GET /api/student/activity
export const getActivity = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string" || !("id" in req.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id as Types.ObjectId;

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
    console.log("=== ENROLLMENT REQUEST ===");
    console.log("User:", req.user);
    console.log("Request body:", req.body);
    
    if (!req.user || typeof req.user === "string" || !("id" in req.user)) {
      console.log("Authentication failed - no valid user");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id as Types.ObjectId;
    const { courseId } = req.body;

    console.log("User ID:", userId);
    console.log("Course ID:", courseId);

    if (!courseId) {
      console.log("No courseId provided");
      return res.status(400).json({ error: "courseId is required" });
    }

    // Validate ObjectId format
    if (!Types.ObjectId.isValid(courseId)) {
      console.log("Invalid ObjectId format:", courseId);
      return res.status(400).json({ error: "Invalid course ID format" });
    }

    // Check if course exists
    const course = await Course.findById(courseId);
    console.log("Course found:", course ? course.title : "Not found");
    
    if (!course) {
      console.log("Course not found in database");
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if already enrolled
    let progress = await CourseProgress.findOne({ userId, courseId });
    if (progress) {
      console.log("User already enrolled");
      return res.status(400).json({ error: "Already enrolled" });
    }

    // Create initial progress entry
    progress = await CourseProgress.create({
      userId,
      courseId,
      lessons: [],
      overallPercent: 0,
    });

    console.log("Enrollment successful, progress created:", progress._id);

    res.status(201).json({
      message: "Successfully enrolled in course",
      courseId,
      courseTitle: course.title,
      progress: progress
    });
  } catch (err: any) {
    console.error("=== ENROLLMENT ERROR ===");
    console.error(err);
    res.status(500).json({ error: "Failed to enroll in course", details: err.message });
  }
};

// GET /api/student/enrollments/:courseId - Check enrollment status
export const checkEnrollment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string" || !("id" in req.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id as Types.ObjectId;
    const { courseId } = req.params;

    const progress = await CourseProgress.findOne({ userId, courseId });
    
    res.json({
      isEnrolled: !!progress,
      progress: progress || null
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to check enrollment status" });
  }
};

// POST /api/student/lessons/complete - Mark a lesson as completed
export const completeLesson = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string" || !("id" in req.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id as Types.ObjectId;
    const { courseId, lessonId } = req.body;

    if (!courseId || !lessonId) {
      return res.status(400).json({ error: "courseId and lessonId are required" });
    }

    // Find or create progress record
    let progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress) {
      return res.status(404).json({ error: "Not enrolled in this course" });
    }

    // Get the course to know total lessons
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find or add lesson progress
    let lessonProgress = progress.lessons.find(l => l.lessonId.toString() === lessonId);
    
    if (lessonProgress) {
      // Update existing lesson
      if (!lessonProgress.completed) {
        lessonProgress.completed = true;
        lessonProgress.completedAt = new Date();
      }
    } else {
      // Add new lesson progress
      progress.lessons.push({
        lessonId: new Types.ObjectId(lessonId),
        completed: true,
        completedAt: new Date()
      });
    }

    // Calculate overall progress
    const completedLessons = progress.lessons.filter(l => l.completed).length;
    const totalLessons = course.lessons.length;
    progress.overallPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    await progress.save();

    res.json({
      message: "Lesson marked as completed",
      progress: {
        completedLessons,
        totalLessons,
        overallPercent: progress.overallPercent
      }
    });
  } catch (err: any) {
    console.error("Complete lesson error:", err);
    res.status(500).json({ error: "Failed to complete lesson" });
  }
};

// GET /api/student/certificate/:courseId - Download certificate
export const downloadCertificate = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || typeof req.user === "string" || !("id" in req.user)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id as Types.ObjectId;
    const { courseId } = req.params;

    // Check if user completed the course
    const progress = await CourseProgress.findOne({ userId, courseId }).populate("courseId", "title");
    if (!progress) {
      return res.status(404).json({ error: "Not enrolled in this course" });
    }

    if (progress.overallPercent < 100) {
      return res.status(400).json({ error: "Course not completed yet" });
    }

    // Get user info
    const user = await require("../models/user").default.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const course = progress.courseId as any;
    const completionDate = new Date().toLocaleDateString();

    // Create certificate HTML
    const certificateHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: landscape; margin: 0; }
        body { 
          font-family: 'Georgia', serif; 
          margin: 0; 
          padding: 40px;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .certificate {
          background: white;
          border: 20px solid #AB51E3;
          border-radius: 20px;
          padding: 60px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          max-width: 800px;
          width: 100%;
        }
        .header { color: #310055; font-size: 48px; font-weight: bold; margin-bottom: 20px; }
        .subheader { color: #AB51E3; font-size: 24px; margin-bottom: 40px; }
        .student-name { 
          color: #310055; 
          font-size: 36px; 
          font-weight: bold; 
          margin: 30px 0;
          text-decoration: underline;
          text-decoration-color: #AB51E3;
        }
        .course-title { 
          color: #333; 
          font-size: 28px; 
          font-style: italic; 
          margin: 30px 0;
        }
        .completion-text { 
          color: #666; 
          font-size: 18px; 
          line-height: 1.6;
          margin: 30px 0;
        }
        .date { 
          color: #AB51E3; 
          font-size: 16px; 
          font-weight: bold;
          margin-top: 40px;
        }
        .signature-line {
          border-top: 2px solid #310055;
          width: 200px;
          margin: 40px auto 10px;
        }
        .signature-text {
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="header">CERTIFICATE OF COMPLETION</div>
        <div class="subheader">This is to certify that</div>
        
        <div class="student-name">${user.name}</div>
        
        <div class="completion-text">
          has successfully completed the course
        </div>
        
        <div class="course-title">"${course.title}"</div>
        
        <div class="completion-text">
          with dedication and excellence, demonstrating mastery of all course materials and achieving 100% completion.
        </div>
        
        <div class="date">Date of Completion: ${completionDate}</div>
        
        <div class="signature-line"></div>
        <div class="signature-text">Learning Platform</div>
      </div>
    </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Disposition', `inline; filename="certificate-${course.title.replace(/[^a-zA-Z0-9]/g, '-')}.html"`);
    res.send(certificateHTML);

  } catch (err: any) {
    console.error("Certificate download error:", err);
    res.status(500).json({ error: "Failed to generate certificate" });
  }
};