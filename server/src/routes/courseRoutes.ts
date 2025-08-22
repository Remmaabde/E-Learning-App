import { Router } from "express";

import { getFeaturedCourses, createFeaturedCourse, getAllCourses } from "../controllers/courseController";

// GET all courses
const router = Router();
router.get("/", getAllCourses);





// GET featured courses
router.get("/featured", getFeaturedCourses);

// POST create a featured course
router.post("/featured", createFeaturedCourse);

export default router;
