import { Request, Response } from "express";
import Course from "../models/course";

export const searchCourses = async (req: Request, res: Response) => {
  try {
    const { q, category, minRating } = req.query as any;
    const filter: any = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minRating) {
      filter.rating = { $gte: Number(minRating) };
    }

    const courses = await Course.find(filter).limit(50);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to search courses" });
  }
};
