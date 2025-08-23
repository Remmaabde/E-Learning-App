
export const createTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ error: "Failed to create testimonial" });
  }
};
import { Request, Response } from "express";
import Testimonial from "../models/testimonial";
import Course from "../models/course";
import User from "../models/user";


export const getTestimonials = async (req: Request, res: Response) => {
  try {
    const testimonials = await Testimonial.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
};


export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });
    res.json({ totalCourses, totalStudents, totalInstructors });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch platform stats" });
  }
};
