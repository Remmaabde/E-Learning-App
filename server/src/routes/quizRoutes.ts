import { Router } from "express";
import { authenticate } from "../middleware/authmiddleware";
import { authorizeRoles } from "../middleware/rolemiddleware";
import {
  getQuizByLesson,
  getQuizzesByCourse,
  getQuizById,
  createQuiz,
  submitQuizAttempt,
} from "../controllers/quizController";

const router = Router();

router.get("/course/:courseId", authenticate, getQuizzesByCourse);
router.get("/quiz/:quizId", authenticate, getQuizById);
router.get("/:lessonId", authenticate, getQuizByLesson);
router.post("/", authenticate, authorizeRoles("instructor"), createQuiz);
router.post("/attempts", authenticate, submitQuizAttempt);

export default router;

