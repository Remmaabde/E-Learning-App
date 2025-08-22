// frontend/src/Pages/Courses/QuizPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Quiz, Question } from "../courses/types";
import { fetchQuizByLesson, submitQuizAttempt } from "../../services/quizService";

interface QuizResult {
  score: number;
  total: number;
  percent: number;
}

const QuizPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!lessonId) return;
      try {
        setLoading(true);
        setErr(null);
        const q = await fetchQuizByLesson(lessonId);
        setQuiz(q);
      } catch (e: unknown) {
        if (e instanceof Error) {
          console.error(e);
          setErr("Failed to load quiz: " + e.message);
        } else {
          console.error(e);
          setErr("Failed to load quiz");
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [lessonId]);

  const handleChange = (qId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    const res = await submitQuizAttempt(
      quiz.id,
      Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }))
    );
    setResult(res);
  };

  if (loading) return <p className="p-6">Loading quiz…</p>;
  if (err) return <p className="p-6 text-red-600">{err}</p>;
  if (!quiz) return <p className="p-6">No quiz available</p>;

  return (
    <div className="p-6 bg-purple-50 min-h-screen">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Quiz</h1>

      {quiz.questions.map((q: Question) => (
        <div key={q.id} className="mb-6 p-4 bg-white rounded-xl shadow">
          <p className="font-semibold text-lg">{q.questionText}</p>

          {q.type === "multiple-choice" && (
            <div className="flex flex-col mt-2">
              {q.options?.map((opt: string) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={q.id}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                  {opt}
                </label>
              ))}
            </div>
          )}

          {q.type === "true-false" && (
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={() => handleChange(q.id, "true")}
                className={`px-4 py-2 rounded-lg ${
                  answers[q.id] === "true" ? "bg-purple-600 text-white" : "bg-purple-200"
                }`}
              >
                True
              </button>
              <button
                type="button"
                onClick={() => handleChange(q.id, "false")}
                className={`px-4 py-2 rounded-lg ${
                  answers[q.id] === "false" ? "bg-purple-600 text-white" : "bg-purple-200"
                }`}
              >
                False
              </button>
            </div>
          )}

          {q.type === "short-answer" && (
            <input
              type="text"
              className="mt-2 border rounded p-2 w-full"
              placeholder="Type your answer"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              title="Short answer"
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-bold"
      >
        Submit Quiz
      </button>

      {result && (
        <div className="mt-6 p-4 bg-green-100 rounded-xl">
          <p className="text-lg font-bold">
            Score: {result.score}/{result.total}
          </p>
          <p>Percentage: {result.percent}%</p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
