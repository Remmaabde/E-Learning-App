
// backend/src/controllers/courseController.ts
import { Request, Response } from "express";
import Course from "../models/course";
import { Types } from "mongoose";
import type { AuthRequest } from "../middleware/authmiddleware"; // assumes you have this

// GET /api/courses?search=&category=&minRating=&tag=&page=1&pageSize=12
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const {
    search = "",
    category = "",
    minRating = "",
      tag = "",
      page = "1",
      pageSize = "12",
    } = req.query as Record<string, string>;

    const q: any = {};
    if (search) q.title = { $regex: search, $options: "i" };
    if (category) q.category = category;
    if (minRating) q.rating = { $gte: Number(minRating) };
    if (tag) q.skills = { $in: [tag] };

    const p = Math.max(1, Number(page));
    const ps = Math.max(1, Number(pageSize));

    const [total, items] = await Promise.all([
      Course.countDocuments(q),
      Course.find(q)
        .populate("instructor", "name role")
        .sort({ createdAt: -1 })
        .skip((p - 1) * ps)
        .limit(ps),
    ]);

    
    const transformedItems = items.map(course => {
      const courseObj = course.toObject();
      const instructor = courseObj.instructor as any;
      
      return {
        id: (courseObj._id as any).toString(),
        title: courseObj.title,
        category: courseObj.category,
        description: courseObj.description,
        instructor: {
          id: instructor?._id?.toString() || "unknown",
          name: instructor?.name || "Unknown Instructor",
          bio: "",
          image: "/Images/default-instructor.png" // fallback image
        },
        lessons: courseObj.lessons.map((lesson: any) => ({
          id: lesson._id.toString(),
          title: lesson.title,
          duration: lesson.duration,
          videoUrl: lesson.videoUrl,
          completed: lesson.completed || false
        })),
        rating: courseObj.rating,
        reviewsCount: courseObj.reviewsCount,
        skills: courseObj.skills,
        relatedCourses: courseObj.relatedCourses || []
      };
    });

    res.json({ items: transformedItems, total, page: p, pageSize: ps });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// GET /api/courses/:id
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name role")
      .populate("relatedCourses", "title rating category");
    if (!course) return res.status(404).json({ error: "Course not found" });
    
    // Transform to match frontend expectations
    const courseObj = course.toObject();
    const instructor = courseObj.instructor as any;
    
    const transformed = {
      id: (courseObj._id as any).toString(),
      title: courseObj.title,
      category: courseObj.category,
      description: courseObj.description,
      instructor: {
        id: instructor?._id?.toString() || "unknown",
        name: instructor?.name || "Unknown Instructor",
        bio: "",
        image: "/Images/default-instructor.png"
      },
      lessons: courseObj.lessons.map((lesson: any) => ({
        id: lesson._id.toString(),
        title: lesson.title,
        duration: lesson.duration,
        videoUrl: lesson.videoUrl,
        completed: lesson.completed || false
      })),
      rating: courseObj.rating,
      reviewsCount: courseObj.reviewsCount,
      skills: courseObj.skills,
      relatedCourses: courseObj.relatedCourses || []
    };
    
    res.json(transformed);
  } catch {
    res.status(500).json({ error: "Failed to fetch course" });
  }
};

// POST /api/courses (instructor only)
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const userId = (req.user && typeof req.user !== "string" && "_id" in req.user) ? req.user._id as Types.ObjectId : null;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const role = (req.user as any)?.role;

    if (role !== "instructor") {
      return res.status(403).json({ error: "Only instructors can create courses" });
    }

    const payload = {
      ...req.body,
      owner: userId,
      instructor: userId,
    };

    const course = await Course.create(payload);
    res.status(201).json(course);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to create course" });
  }
};


export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const userId = (req.user && typeof req.user !== "string" && "_id" in req.user) ? req.user._id.toString() : null;
    if (course.owner?.toString() !== userId) {
      return res.status(403).json({ error: "Not the course owner" });
    }

    Object.assign(course, req.body);
    await course.save();
    res.json(course);
  } catch {
    res.status(400).json({ error: "Failed to update course" });
  }
};


export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const userId = (req.user && typeof req.user !== "string" && "_id" in req.user) ? req.user._id.toString() : null;
    if (course.owner?.toString() !== userId) {
      return res.status(403).json({ error: "Not the course owner" });
    }

    await course.deleteOne();
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "Failed to delete course" });

  }
};
// export const getCourses = async (req: Request, res: Response) => {
//   try {
//     const courses = await Course.find();
//     res.json(courses);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch courses" });
//   }
// };

export const createFeaturedCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    courseData.featured = true; 
    const course = await Course.create(courseData);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: "Failed to create featured course" });
  }
};

export const getFeaturedCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ featured: true });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured courses" });
  }
};