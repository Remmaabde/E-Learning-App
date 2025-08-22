// GET /api/courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};
// POST /api/courses/featured
export const createFeaturedCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    courseData.featured = true; // Ensure the course is marked as featured
    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: "Failed to create featured course" });
  }
};
import { Request, Response } from "express";
import Course from "../models/course";

// GET /api/courses/featured
export const getFeaturedCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ featured: true });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured courses" });
  }
};
