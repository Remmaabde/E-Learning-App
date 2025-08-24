import { Router } from "express";
import { authenticate } from "../middleware/authmiddleware";
import { authorizeRoles } from "../middleware/rolemiddleware";
import {
  getQuizByLesson,
<<<<<<< HEAD
=======
  getQuizzesByCourse,
  getQuizById,
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
  createQuiz,
  submitQuizAttempt,
} from "../controllers/quizController";

const router = Router();

<<<<<<< HEAD
=======
router.get("/course/:courseId", authenticate, getQuizzesByCourse);
router.get("/quiz/:quizId", authenticate, getQuizById);
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
router.get("/:lessonId", authenticate, getQuizByLesson);
router.post("/", authenticate, authorizeRoles("instructor"), createQuiz);
router.post("/attempts", authenticate, submitQuizAttempt);

export default router;

