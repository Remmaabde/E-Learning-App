import { Router } from "express";
import { authenticate } from "../middleware/authmiddleware";
import {
  getInstructorDashboard,
  getInstructorCourses,
  getCourseStudents,
  toggleCoursePublishStatus,
  createCourse,
  updateCourse,
  deleteCourse,
  getQuizzes,
  createQuiz,
  toggleQuizStatus,
  deleteQuiz,
  addLesson,
  updateLesson,
  deleteLesson,
  reorderLessons
} from "../controllers/instructorController";

const router = Router();

// Dashboard routes
router.get("/dashboard", authenticate, getInstructorDashboard);

// Course management routes
router.get("/courses", authenticate, getInstructorCourses);
router.post("/courses", authenticate, createCourse);
router.put("/courses/:courseId", authenticate, updateCourse);
router.delete("/courses/:courseId", authenticate, deleteCourse);
router.post("/courses/:courseId/publish", authenticate, toggleCoursePublishStatus);

// Student analytics routes
router.get("/students/:courseId", authenticate, getCourseStudents);

// Quiz management routes
router.get("/quizzes", authenticate, getQuizzes);
router.post("/quizzes", authenticate, createQuiz);
router.patch("/quizzes/:quizId/toggle", authenticate, toggleQuizStatus);
router.delete("/quizzes/:quizId", authenticate, deleteQuiz);

// Lesson management routes
router.post("/courses/:courseId/lessons", authenticate, addLesson);
router.put("/courses/:courseId/lessons/:lessonId", authenticate, updateLesson);
router.delete("/courses/:courseId/lessons/:lessonId", authenticate, deleteLesson);
router.put("/courses/:courseId/lessons/reorder", authenticate, reorderLessons);

export default router;
