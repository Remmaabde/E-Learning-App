
// backend/src/routes/courseRoutes.ts
import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getFeaturedCourses, 
  createFeaturedCourse
} from "../controllers/courseController";
import { authenticate  } from "../middleware/authmiddleware";
import { authorizeRoles } from "../middleware/rolemiddleware";

const router = Router();

console.log("=== COURSE ROUTES FILE LOADED ===");
console.log("Time:", new Date().toISOString());

// Specific routes must come before dynamic routes
router.get("/health", (req, res) => {
  console.log("Health endpoint hit!");
  res.status(200).json({ 
    status: "OK", 
    message: "Course routes are working",
    timestamp: new Date().toISOString()
  });
});

router.get("/featured", getFeaturedCourses);
router.get("/", getAllCourses);
router.get("/:id", getCourseById);

router.post("/", authenticate, authorizeRoles("instructor"), createCourse);
router.post("/featured", createFeaturedCourse);
router.put("/:id", authenticate, authorizeRoles("instructor"), updateCourse);
router.delete("/:id", authenticate, authorizeRoles("instructor"), deleteCourse);

export default router;
