import { Router } from "express";
import { authenticate } from "../middleware/authmiddleware";
import { authorizeRoles } from "../middleware/rolemiddleware";
import {
  getInstructorDashboard,
  getInstructorCourses,
  getInstructorStudents,
  togglePublishCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/instructorController";

const router = Router();

// instructor-only area
router.use(authenticate, authorizeRoles("instructor"));

router.get("/dashboard", getInstructorDashboard);
router.get("/courses", getInstructorCourses);
router.get("/students/:courseId", getInstructorStudents);
router.post("/courses/:courseId/publish", togglePublishCourse);

router.post("/courses", createCourse);
router.put("/courses/:courseId", updateCourse);
router.delete("/courses/:courseId", deleteCourse);

export default router;
