
// backend/src/routes/courseRoutes.ts
import { Router } from "express";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
<<<<<<< HEAD
=======
  getFeaturedCourses, 
  createFeaturedCourse
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
} from "../controllers/courseController";
import { authenticate  } from "../middleware/authmiddleware";
import { authorizeRoles } from "../middleware/rolemiddleware";

const router = Router();

<<<<<<< HEAD
//router.get("/", getAllCourses);
router.get("/:id", getCourseById);
router.get("/all", getAllCourses);

router.post("/", authenticate, authorizeRoles("instructor"), createCourse);
router.put("/:id", authenticate, authorizeRoles("instructor"), updateCourse);
router.delete("/:id", authenticate, authorizeRoles("instructor"), deleteCourse);



import { getFeaturedCourses, createFeaturedCourse} from "../controllers/courseController";








router.get("/featured", getFeaturedCourses);

router.post("/featured", createFeaturedCourse);
=======
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

>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
export default router;
