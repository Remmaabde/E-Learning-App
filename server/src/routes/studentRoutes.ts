import { Router } from "express";
import { authenticate } from "../middleware/authmiddleware";
import { getDashboard, getActivity, enrollCourse, checkEnrollment, completeLesson, downloadCertificate } from "../controllers/studentController";

const router = Router();

router.get("/dashboard", authenticate, getDashboard);
router.get("/activity", authenticate, getActivity);
router.post("/enrollments", authenticate, enrollCourse);
router.get("/enrollments/:courseId", authenticate, checkEnrollment);
router.post("/lessons/complete", authenticate, completeLesson);
router.get("/certificate/:courseId", authenticate, downloadCertificate);

export default router;
