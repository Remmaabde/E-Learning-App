
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../middleware/authmiddleware";
import Quiz from "../models/quiz";
import Course from "../models/course";
import { Types } from "mongoose";

// GET /api/quizzes/:lessonId
export const getQuizByLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
    const quiz = await Quiz.findOne({ lessonId });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

// POST /api/quizzes (instructor only)
export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const role = (req.user as any)?.role;
    const userId = (req.user as JwtPayload & { _id: Types.ObjectId })?._id;
    if (role !== "instructor") {
      return res.status(403).json({ error: "Only instructors can create quizzes" });
    }

    // validate lesson belongs to course
    const { courseId, lessonId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const exists = course.lessons.some(l => l._id.toString() === lessonId);
    if (!exists) return res.status(400).json({ error: "Lesson not in course" });

    const quiz = await Quiz.create({ ...req.body, createdBy: userId });
    res.status(201).json(quiz);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to create quiz" });
  }
};

// POST /api/quiz-attempts  { quizId, answers: {questionId, answer}[] }
export const submitQuizAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    // score
    let score = 0;
    quiz.questions.forEach(q => {
      const given = answers?.find((a: any) => a.questionId === q._id.toString());
      if (!given) return;
      if (q.type === "short-answer") {
        if ((given.answer || "").trim().toLowerCase() === (q.correctAnswer || "").trim().toLowerCase()) score++;
      } else if (q.type === "true-false" || q.type === "multiple-choice") {
        if (given.answer === q.correctAnswer) score++;
      }
    });

    const result = {
      quizId,
      total: quiz.questions.length,
      score,
      percent: Math.round((score / Math.max(1, quiz.questions.length)) * 100),
    };

    res.json(result);
  } catch {
    res.status(400).json({ error: "Failed to submit quiz attempt" });
  }
};
