import { Router } from "express";
import { authenticate } from "../middleware/authmiddleware";
import { getDashboard, getActivity, enrollCourse } from "../controllers/studentController";

const router = Router();

router.get("/dashboard", authenticate, getDashboard);
router.get("/activity", authenticate, getActivity);
router.post("/enrollments", authenticate, enrollCourse);

export default router;
