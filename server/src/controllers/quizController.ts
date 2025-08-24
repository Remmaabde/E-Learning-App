
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { AuthRequest } from "../middleware/authmiddleware";
import Quiz from "../models/quiz";
import Course from "../models/course";
import { Types } from "mongoose";

<<<<<<< HEAD
=======
// GET /api/instructor/quizzes - Get all quizzes created by instructor
export const getInstructorQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    const role = (req.user as any)?.role;
    const userId = (req.user as JwtPayload & { _id: Types.ObjectId })?._id;
    
    if (role !== "instructor") {
      return res.status(403).json({ error: "Only instructors can access this endpoint" });
    }

    const quizzes = await Quiz.find({ createdBy: userId })
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    res.json(quizzes);
  } catch (error: any) {
    console.error("Get instructor quizzes error:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

// GET /api/instructor/quizzes/:quizId - Get specific quiz
export const getQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const role = (req.user as any)?.role;
    const userId = (req.user as JwtPayload & { _id: Types.ObjectId })?._id;
    const { quizId } = req.params;

    if (role !== "instructor") {
      return res.status(403).json({ error: "Only instructors can access this endpoint" });
    }

    const quiz = await Quiz.findOne({ _id: quizId, createdBy: userId })
      .populate('courseId', 'title');
    
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found or access denied" });
    }

    res.json(quiz);
  } catch (error: any) {
    console.error("Get quiz error:", error);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

// PUT /api/instructor/quizzes/:quizId - Update quiz
export const updateQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const role = (req.user as any)?.role;
    const userId = (req.user as JwtPayload & { _id: Types.ObjectId })?._id;
    const { quizId } = req.params;
    const updateData = req.body;

    if (role !== "instructor") {
      return res.status(403).json({ error: "Only instructors can update quizzes" });
    }

    // Verify quiz belongs to instructor
    const quiz = await Quiz.findOne({ _id: quizId, createdBy: userId });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found or access denied" });
    }

    // If updating questions, validate them
    if (updateData.questions) {
      for (const question of updateData.questions) {
        if (!question.type || !question.questionText) {
          return res.status(400).json({ error: "Each question must have type and questionText" });
        }
        
        if (question.type === "multiple-choice" && (!question.options || question.options.length < 2)) {
          return res.status(400).json({ error: "Multiple-choice questions must have at least 2 options" });
        }
        
        if (question.type === "true-false" && (!question.options || question.options.length !== 2)) {
          return res.status(400).json({ error: "True-false questions must have exactly 2 options" });
        }
      }
    }

    Object.assign(quiz, updateData);
    await quiz.save();

    const populatedQuiz = await Quiz.findById(quiz._id).populate('courseId', 'title');
    res.json(populatedQuiz);
  } catch (error: any) {
    console.error("Update quiz error:", error);
    res.status(500).json({ error: "Failed to update quiz" });
  }
};

// DELETE /api/instructor/quizzes/:quizId - Delete quiz
export const deleteQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const role = (req.user as any)?.role;
    const userId = (req.user as JwtPayload & { _id: Types.ObjectId })?._id;
    const { quizId } = req.params;

    if (role !== "instructor") {
      return res.status(403).json({ error: "Only instructors can delete quizzes" });
    }

    // Verify quiz belongs to instructor
    const quiz = await Quiz.findOne({ _id: quizId, createdBy: userId });
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found or access denied" });
    }

    await Quiz.findByIdAndDelete(quizId);
    res.json({ message: "Quiz deleted successfully" });
  } catch (error: any) {
    console.error("Delete quiz error:", error);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
};
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223

export const getQuizByLesson = async (req: Request, res: Response) => {
  try {
    const { lessonId } = req.params;
<<<<<<< HEAD
    const quiz = await Quiz.findOne({ lessonId });
=======
    const quiz = await Quiz.findOne({ lessonId })
      .populate('courseId', 'title')
      .select('-questions.correctAnswer'); // Don't send correct answers to students
    
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};

<<<<<<< HEAD
=======
export const getQuizzesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ courseId })
      .select('-questions.correctAnswer') // Don't send correct answers to students
      .sort({ createdAt: -1 });
    
    res.json(quizzes);
  } catch (error) {
    console.error("Get quizzes by course error:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
};

export const getQuizById = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId)
      .populate('courseId', 'title')
      .select('-questions.correctAnswer'); // Don't send correct answers to students
    
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    console.error("Get quiz by ID error:", error);
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
};
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223

export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const role = (req.user as any)?.role;
    const userId = (req.user as JwtPayload & { _id: Types.ObjectId })?._id;
    if (role !== "instructor") {
      return res.status(403).json({ error: "Only instructors can create quizzes" });
    }

<<<<<<< HEAD
    
    const { courseId, lessonId } = req.body;
=======
    const { courseId, lessonId, questions, timeLimitSec } = req.body;

    if (!courseId || !lessonId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: "CourseId, lessonId, and questions array are required" });
    }

>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    const exists = course.lessons.some(l => l._id.toString() === lessonId);
    if (!exists) return res.status(400).json({ error: "Lesson not in course" });

<<<<<<< HEAD
    const quiz = await Quiz.create({ ...req.body, createdBy: userId });
    res.status(201).json(quiz);
=======
    // Validate questions
    for (const question of questions) {
      if (!question.type || !question.questionText) {
        return res.status(400).json({ error: "Each question must have type and questionText" });
      }
      
      if (question.type === "multiple-choice" && (!question.options || question.options.length < 2)) {
        return res.status(400).json({ error: "Multiple-choice questions must have at least 2 options" });
      }
      
      if (question.type === "true-false" && (!question.options || question.options.length !== 2)) {
        return res.status(400).json({ error: "True-false questions must have exactly 2 options" });
      }
    }

    const quiz = await Quiz.create({ 
      courseId,
      lessonId, 
      questions: questions.map((q: any) => ({
        ...q,
        _id: new Types.ObjectId()
      })),
      timeLimitSec,
      createdBy: userId 
    });
    
    const populatedQuiz = await Quiz.findById(quiz._id).populate('courseId', 'title');
    res.status(201).json(populatedQuiz);
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to create quiz" });
  }
};

<<<<<<< HEAD

=======
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
export const submitQuizAttempt = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, answers } = req.body;
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

<<<<<<< HEAD
    
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

=======
    let score = 0;
    const results = quiz.questions.map(q => {
      const given = answers?.find((a: any) => a.questionId === q._id.toString());
      let isCorrect = false;
      
      if (given) {
        if (q.type === "short-answer") {
          const correctAnswerStr = String(q.correctAnswer || "");
          isCorrect = (given.answer || "").trim().toLowerCase() === correctAnswerStr.trim().toLowerCase();
        } else if (q.type === "true-false" || q.type === "multiple-choice") {
          isCorrect = given.answer === q.correctAnswer;
        }
      }
      
      if (isCorrect) score++;

      return {
        questionId: q._id,
        questionText: q.questionText,
        userAnswer: given?.answer || "",
        correctAnswer: q.correctAnswer,
        isCorrect
      };
    });

    const percent = Math.round((score / Math.max(1, quiz.questions.length)) * 100);
    const passingScore = quiz.passingScore || 70; // Use quiz's passing score or default to 70%
    const passed = percent >= passingScore;

>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    const result = {
      quizId,
      total: quiz.questions.length,
      score,
<<<<<<< HEAD
      percent: Math.round((score / Math.max(1, quiz.questions.length)) * 100),
=======
      percent,
      passed,
      results
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    };

    res.json(result);
  } catch {
    res.status(400).json({ error: "Failed to submit quiz attempt" });
  }
};
