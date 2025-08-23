import { Router } from "express";
import { authenticate} from "../middleware/authmiddleware";
import {
  updateLessonProgress,
  getCourseProgress,
  putCourseProgress,
} from "../controllers/progressController";

const router = Router();
router.post("/lesson", authenticate, updateLessonProgress);
router.get("/course/:id", authenticate, getCourseProgress);
router.put("/course/:id", authenticate, putCourseProgress);

export default router;

