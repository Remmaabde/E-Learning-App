import axios from "axios";
import type { Quiz } from "../Pages/courses/types";

const API_URL = "http://localhost:5000/api";

export async function fetchQuizByLesson(lessonId: string): Promise<Quiz> {
 
  const res = await axios.get(`${API_URL}/quizzes/${lessonId}`, { withCredentials: true });
  return res.data;
}

export async function submitQuizAttempt(
  quizId: string,
  answers: { questionId: string; answer: string }[]
) {

  const res = await axios.post(`${API_URL}/quiz-attempts`, { quizId, answers }, { withCredentials: true });
  return res.data;
}
