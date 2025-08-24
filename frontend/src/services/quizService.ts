import axios from "axios";
<<<<<<< HEAD
import API_BASE_URL from "../config/api";
import type { Quiz } from "../Pages/courses/types";


export const fetchQuizByLesson = async (lessonId: string) => {
  const res = await axios.get<Quiz>(`${API_BASE_URL}/quizzes/${lessonId}`);
  return res.data;
};

export const submitQuizAttempt = async (quizId: string, answers: { questionId: string, answer: string }[]) => {
  const res = await axios.post(`${API_BASE_URL}/quizzes/attempts`, { quizId, answers });
  return res.data;
};
=======
import type { Quiz } from "../Pages/courses/types";

const API_URL = "http://localhost:5000/api/quizzes";

export async function fetchQuizByLesson(lessonId: string): Promise<Quiz> {
  const res = await axios.get(`${API_URL}/${lessonId}`, { withCredentials: true });
  return res.data;
}

export async function submitQuizAttempt(
  quizId: string,
  answers: { questionId: string; answer: string }[]
) {
  const res = await axios.post("http://localhost:5000/api/quiz-attempts", { quizId, answers }, { withCredentials: true });
  return res.data;
}
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
