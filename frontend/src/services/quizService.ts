import axios from "axios";
import API_BASE_URL from "../config/api";
import type { Quiz } from "../Pages/courses/types";

// Get quiz by lessonId
export const fetchQuizByLesson = async (lessonId: string) => {
  const res = await axios.get<Quiz>(`${API_BASE_URL}/quizzes/${lessonId}`);
  return res.data;
};

// Submit quiz attempt
export const submitQuizAttempt = async (quizId: string, answers: { questionId: string, answer: string }[]) => {
  const res = await axios.post(`${API_BASE_URL}/quizzes/attempts`, { quizId, answers });
  return res.data;
};
