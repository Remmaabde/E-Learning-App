import { Request, Response } from "express";
import { Types } from "mongoose";
import Course from "../models/course";
import CourseProgress from "../models/progress";
import User from "../models/user";
import Quiz from "../models/quiz";

interface AuthRequest extends Request {
  user?: { id: string; email: string; role: string };
}

// GET /api/instructor/dashboard - Comprehensive instructor analytics
export const getInstructorDashboard = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const instructorId = new Types.ObjectId(req.user.id);

    // Get instructor's courses
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map(course => course._id);

    // Get total enrollments across all courses
    const totalEnrollments = await CourseProgress.countDocuments({ 
      courseId: { $in: courseIds } 
    });

    // Get completed courses count
    const completedCourses = await CourseProgress.countDocuments({ 
      courseId: { $in: courseIds },
      overallPercent: 100 
    });

    // Calculate average completion rate
    const avgCompletionRate = totalEnrollments > 0 ? Math.round((completedCourses / totalEnrollments) * 100) : 0;

    // Get recent enrollments (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEnrollments = await CourseProgress.countDocuments({
      courseId: { $in: courseIds },
      enrolledAt: { $gte: thirtyDaysAgo }
    });

    // Get course performance metrics
    const courseMetrics = await Promise.all(
      courses.map(async (course) => {
        const enrollments = await CourseProgress.countDocuments({ courseId: course._id });
        const completions = await CourseProgress.countDocuments({ 
          courseId: course._id, 
          overallPercent: 100 
        });
        const avgProgress = enrollments > 0 ? await CourseProgress.aggregate([
          { $match: { courseId: course._id } },
          { $group: { _id: null, avgProgress: { $avg: "$overallPercent" } } }
        ]) : [{ avgProgress: 0 }];

        return {
          _id: course._id,
          title: course.title,
          enrollments,
          completions,
          completionRate: enrollments > 0 ? Math.round((completions / enrollments) * 100) : 0,
          avgProgress: Math.round(avgProgress[0]?.avgProgress || 0)
        };
      })
    );

    // Get recent student activity
    const recentActivity = await CourseProgress.find({
      courseId: { $in: courseIds }
    })
    .populate('userId', 'name email')
    .populate('courseId', 'title')
    .sort({ updatedAt: -1 })
    .limit(10);

    const dashboardData = {
      overview: {
        totalCourses: courses.length,
        totalStudents: totalEnrollments,
        completedCourses,
        avgCompletionRate,
        recentEnrollments
      },
      courseMetrics,
      recentActivity: recentActivity.map(activity => ({
        studentName: (activity.userId as any)?.name || 'Unknown',
        studentEmail: (activity.userId as any)?.email || '',
        courseTitle: (activity.courseId as any)?.title || 'Unknown Course',
        progress: activity.overallPercent,
        lastActivity: activity.updatedAt
      })),
      topPerformingCourses: courseMetrics
        .sort((a, b) => b.enrollments - a.enrollments)
        .slice(0, 5)
    };

    res.json(dashboardData);
  } catch (error: any) {
    console.error("Instructor dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

// GET /api/instructor/courses - List instructor's courses with metrics
export const getInstructorCourses = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const instructorId = new Types.ObjectId(req.user.id);
    const courses = await Course.find({ instructor: instructorId });

    const coursesWithMetrics = await Promise.all(
      courses.map(async (course) => {
        const enrollments = await CourseProgress.countDocuments({ courseId: course._id });
        const completions = await CourseProgress.countDocuments({ 
          courseId: course._id, 
          overallPercent: 100 
        });
        
        const avgProgressResult = await CourseProgress.aggregate([
          { $match: { courseId: course._id } },
          { $group: { _id: null, avgProgress: { $avg: "$overallPercent" } } }
        ]);

        const avgProgress = avgProgressResult.length > 0 ? avgProgressResult[0].avgProgress : 0;

        return {
          ...course.toObject(),
          metrics: {
            enrollments,
            completions,
            completionRate: enrollments > 0 ? Math.round((completions / enrollments) * 100) : 0,
            avgProgress: Math.round(avgProgress || 0)
          }
        };
      })
    );

    res.json(coursesWithMetrics);
  } catch (error: any) {
    console.error("Get instructor courses error:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// GET /api/instructor/students/:courseId - Student progress in course
export const getCourseStudents = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { courseId } = req.params;
    const instructorId = new Types.ObjectId(req.user.id);

    // Verify course belongs to instructor
    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return res.status(404).json({ error: "Course not found or access denied" });
    }

    // Get all student progress for this course
    const studentProgress = await CourseProgress.find({ courseId })
      .populate('userId', 'name email')
      .sort({ overallPercent: -1 });

    const studentsData = studentProgress.map(progress => ({
      studentId: progress.userId._id,
      studentName: (progress.userId as any).name,
      studentEmail: (progress.userId as any).email,
      enrolledAt: progress.enrolledAt,
      overallPercent: progress.overallPercent,
      lessonsCompleted: progress.lessons.filter(l => l.completed).length,
      totalLessons: course.lessons.length,
      lastActivity: progress.updatedAt,
      completedLessons: progress.lessons.map(lesson => ({
        lessonId: lesson.lessonId,
        completed: lesson.completed,
        completedAt: lesson.completedAt
      }))
    }));

    res.json({
      course: {
        _id: course._id,
        title: course.title,
        totalLessons: course.lessons.length
      },
      students: studentsData,
      summary: {
        totalStudents: studentsData.length,
        averageProgress: studentsData.length > 0 
          ? Math.round(studentsData.reduce((sum, student) => sum + student.overallPercent, 0) / studentsData.length)
          : 0,
        completedStudents: studentsData.filter(s => s.overallPercent === 100).length
      }
    });
  } catch (error: any) {
    console.error("Get course students error:", error);
    res.status(500).json({ error: "Failed to fetch student data" });
  }
};

// POST /api/instructor/courses/:courseId/publish - Publish/unpublish courses
export const toggleCoursePublishStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { courseId } = req.params;
    const { published } = req.body;
    const instructorId = new Types.ObjectId(req.user.id);

    // Verify course belongs to instructor
    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return res.status(404).json({ error: "Course not found or access denied" });
    }

    course.published = published;
    await course.save();

    res.json({
      message: `Course ${published ? 'published' : 'unpublished'} successfully`,
      course: {
        _id: course._id,
        title: course.title,
        published: course.published
      }
    });
  } catch (error: any) {
    console.error("Toggle course publish status error:", error);
    res.status(500).json({ error: "Failed to update course status" });
  }
};

// POST /api/instructor/courses - Create new course
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const instructorId = new Types.ObjectId(req.user.id);
    const { title, description, category, level, lessons, tags, price } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ error: "Title, description, and category are required" });
    }

    const newCourse = new Course({
      title,
      description,
      category,
      level: level || 'beginner',
      instructor: instructorId,
      lessons: lessons || [],
      tags: tags || [],
      price: price || 0,
      published: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (error: any) {
    console.error("Create course error:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
};

// PUT /api/instructor/courses/:courseId - Update course
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { courseId } = req.params;
    const instructorId = new Types.ObjectId(req.user.id);
    const updateData = req.body;

    // Verify course belongs to instructor
    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return res.status(404).json({ error: "Course not found or access denied" });
    }

    Object.assign(course, updateData);
    course.updatedAt = new Date();
    await course.save();

    res.json(course);
  } catch (error: any) {
    console.error("Update course error:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
};

// DELETE /api/instructor/courses/:courseId - Delete course
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { courseId } = req.params;
    const instructorId = new Types.ObjectId(req.user.id);

    // Verify course belongs to instructor
    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
      return res.status(404).json({ error: "Course not found or access denied" });
    }

    // Delete all progress records for this course
    await CourseProgress.deleteMany({ courseId });
    
    // Delete the course
    await Course.findByIdAndDelete(courseId);

    res.json({ message: "Course deleted successfully" });
  } catch (error: any) {
    console.error("Delete course error:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
};

// Quiz management endpoints

// GET /api/instructor/quizzes - Get instructor's quizzes
export const getQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const instructorId = new Types.ObjectId(req.user.id);
    const quizzes = await Quiz.find({ createdBy: instructorId })
      .populate("courseId", "title")
      .sort({ createdAt: -1 });

    const quizzesWithMetrics = quizzes.map(quiz => ({
      ...quiz.toObject(),
      courseName: (quiz.courseId as any)?.title || "Unknown Course",
      attempts: 0, // Would need QuizAttempt model
      avgScore: 0   // Would need QuizAttempt model
    }));

    res.json(quizzesWithMetrics);
  } catch (error: any) {
    console.error("Get quizzes error:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

// POST /api/instructor/quizzes - Create a new quiz
export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const instructorId = new Types.ObjectId(req.user.id);
    const { title, description, courseId, timeLimit, passingScore, questions } = req.body;

    // Verify the course belongs to the instructor
    const course = await Course.findOne({ 
      _id: courseId, 
      instructor: instructorId 
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const quiz = new Quiz({
      title,
      description,
      courseId,
      createdBy: instructorId,
      timeLimit,
      passingScore,
      questions: questions.map((q: any) => ({
        ...q,
        _id: q._id || new Types.ObjectId()
      })),
      isActive: true
    });

    await quiz.save();

    res.status(201).json({ 
      message: "Quiz created successfully",
      quiz 
    });
  } catch (error: any) {
    console.error("Create quiz error:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
};

// PATCH /api/instructor/quizzes/:quizId/toggle - Toggle quiz active status
export const toggleQuizStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { quizId } = req.params;
    const { isActive } = req.body;
    const instructorId = new Types.ObjectId(req.user.id);

    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId, createdBy: instructorId },
      { isActive },
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json({ 
      message: `Quiz ${isActive ? 'activated' : 'deactivated'} successfully`,
      quiz 
    });
  } catch (error: any) {
    console.error("Toggle quiz status error:", error);
    res.status(500).json({ error: "Failed to update quiz" });
  }
};

// DELETE /api/instructor/quizzes/:quizId - Delete a quiz
export const deleteQuiz = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { quizId } = req.params;
    const instructorId = new Types.ObjectId(req.user.id);

    const quiz = await Quiz.findOneAndDelete({ 
      _id: quizId, 
      createdBy: instructorId 
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json({ message: "Quiz deleted successfully" });
  } catch (error: any) {
    console.error("Delete quiz error:", error);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
};

// Lesson management endpoints

// POST /api/instructor/courses/:courseId/lessons - Add lesson to course
export const addLesson = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const instructorId = new Types.ObjectId(req.user.id);
    const { courseId } = req.params;
    const { title, description, videoUrl, duration, order } = req.body;

    // Verify the course belongs to the instructor
    const course = await Course.findOne({ 
      _id: courseId, 
      instructor: instructorId 
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found or access denied" });
    }

    // Create new lesson
    const newLesson = {
      _id: new Types.ObjectId(),
      title,
      description: description || "",
      videoUrl,
      duration: duration || "",
      order: order || course.lessons.length + 1
    };

    // Add lesson to course
    course.lessons.push(newLesson);
    await course.save();

    res.status(201).json({ 
      message: "Lesson added successfully",
      lesson: newLesson 
    });
  } catch (error: any) {
    console.error("Add lesson error:", error);
    res.status(500).json({ error: "Failed to add lesson" });
  }
};

// PUT /api/instructor/courses/:courseId/lessons/:lessonId - Update lesson
export const updateLesson = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const instructorId = new Types.ObjectId(req.user.id);
    const { courseId, lessonId } = req.params;
    const updateData = req.body;

    // Verify the course belongs to the instructor
    const course = await Course.findOne({ 
      _id: courseId, 
      instructor: instructorId 
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found or access denied" });
    }

    // Find and update the lesson
    const lessonIndex = course.lessons.findIndex(lesson => lesson._id.toString() === lessonId);
    if (lessonIndex === -1) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    // Update lesson data
    const lesson = course.lessons[lessonIndex];
    if (lesson) {
      Object.assign(lesson, updateData);
      await course.save();
    }

    res.json({ 
      message: "Lesson updated successfully",
      lesson: course.lessons[lessonIndex] 
    });
  } catch (error: any) {
    console.error("Update lesson error:", error);
    res.status(500).json({ error: "Failed to update lesson" });
  }
};

// DELETE /api/instructor/courses/:courseId/lessons/:lessonId - Delete lesson
export const deleteLesson = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const instructorId = new Types.ObjectId(req.user.id);
    const { courseId, lessonId } = req.params;

    // Verify the course belongs to the instructor
    const course = await Course.findOne({ 
      _id: courseId, 
      instructor: instructorId 
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found or access denied" });
    }

    // Remove the lesson
    course.lessons = course.lessons.filter(lesson => lesson._id.toString() !== lessonId);
    await course.save();

    res.json({ message: "Lesson deleted successfully" });
  } catch (error: any) {
    console.error("Delete lesson error:", error);
    res.status(500).json({ error: "Failed to delete lesson" });
  }
};

// PUT /api/instructor/courses/:courseId/lessons/reorder - Reorder lessons
export const reorderLessons = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const instructorId = new Types.ObjectId(req.user.id);
    const { courseId } = req.params;
    const { fromIndex, toIndex } = req.body;

    // Verify the course belongs to the instructor
    const course = await Course.findOne({ 
      _id: courseId, 
      instructor: instructorId 
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found or access denied" });
    }

    // Reorder lessons
    const lessons = [...course.lessons];
    const [movedLesson] = lessons.splice(fromIndex, 1);
    
    if (movedLesson) {
      lessons.splice(toIndex, 0, movedLesson);

      // Update order property for all lessons
      lessons.forEach((lesson, index) => {
        if (lesson) {
          lesson.order = index + 1;
        }
      });

      course.lessons = lessons;
      await course.save();
    }

    res.json({ 
      message: "Lessons reordered successfully",
      lessons: course.lessons 
    });
  } catch (error: any) {
    console.error("Reorder lessons error:", error);
    res.status(500).json({ error: "Failed to reorder lessons" });
  }
};
