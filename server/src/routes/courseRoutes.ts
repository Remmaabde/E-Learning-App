
// backend/src/routes/courseRoutes.ts
import { Router } from "express";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController";
import { authenticate  } from "../middleware/authmiddleware";
import { authorizeRoles } from "../middleware/rolemiddleware";

const router = Router();

router.get("/", getCourses);
router.get("/:id", getCourseById);

router.post("/", authenticate, authorizeRoles("instructor"), createCourse);
router.put("/:id", authenticate, authorizeRoles("instructor"), updateCourse);
router.delete("/:id", authenticate, authorizeRoles("instructor"), deleteCourse);
//router.delete("/id",authenticate,authorizeRoles("instructor"),deletecourse 1);


import { getFeaturedCourses, createFeaturedCourse, getAllCourses } from "../controllers/courseController";

router.get("/", getAllCourses);





// GET featured courses
router.get("/featured", getFeaturedCourses);

// POST create a featured course
router.post("/featured", createFeaturedCourse);
export default router;
