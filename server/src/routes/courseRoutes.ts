
// backend/src/routes/courseRoutes.ts
import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";
import { authenticate  } from "../middleware/authmiddleware";
import { authorizeRoles } from "../middleware/rolemiddleware";

const router = Router();

//router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/all", getAllCourses);

router.post("/", authenticate, authorizeRoles("instructor"), createCourse);
router.put("/:id", authenticate, authorizeRoles("instructor"), updateCourse);
router.delete("/:id", authenticate, authorizeRoles("instructor"), deleteCourse);



import { getFeaturedCourses, createFeaturedCourse} from "../controllers/courseController";








router.get("/featured", getFeaturedCourses);

router.post("/featured", createFeaturedCourse);
export default router;
