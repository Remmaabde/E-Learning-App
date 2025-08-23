import { Router } from "express";
import { getTestimonials, getPlatformStats, createTestimonial } from "../controllers/platformController";

const router = Router();


router.get("/testimonials", getTestimonials);
router.post("/testimonials", createTestimonial);


router.get("/platform/stats", getPlatformStats);

export default router;
