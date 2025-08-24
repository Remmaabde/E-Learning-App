// frontend/src/Pages/Courses/QuizPage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { api } from "../../Axios/axios";

interface Question {
  _id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  questionText: string;
  options?: string[];
  points: number;
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: Question[];
}

interface QuizResult {
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  results?: Array<{
    questionId: string;
    questionText: string;
    userAnswer: string;
    correctAnswer: string | number;
    isCorrect: boolean;
  }>;
}

const QuizPage: React.FC = () => {
  const { courseId, lessonId, quizId: routeQuizId } = useParams<{ 
    courseId?: string; 
    lessonId?: string; 
    quizId?: string; 
  }>();
  const location = useLocation();
  
  // Get quiz ID from URL params or state
  const searchParams = new URLSearchParams(location.search);
  const queryQuizId = searchParams.get('quizId');
  
  // Use quiz ID from route params or query params
  const quizId = routeQuizId || queryQuizId;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [quizId, courseId]);

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && quizStarted && !result) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !result) {
      handleSubmit(); // Auto-submit when time runs out
    }
  }, [timeLeft, quizStarted, result]);

  const loadQuiz = async () => {
    if (!quizId) {
      setError("Quiz ID not provided");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/quizzes/quiz/${quizId}`);
      setQuiz(response.data);
      
      if (response.data.timeLimit) {
        setTimeLeft(response.data.timeLimit * 60); // Convert to seconds
      }
    } catch (e: any) {
      console.error("Load quiz error:", e);
      setError(e.response?.data?.error || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      setSubmitting(true);
      const submissionData = {
        quizId: quiz._id,
        answers: Object.entries(answers).map(([questionId, answer]) => ({
          questionId,
          answer
        }))
      };

      const response = await api.post("/quizzes/attempts", submissionData);
      setResult(response.data);
    } catch (error: any) {
      console.error("Submit quiz error:", error);
      setError(error.response?.data?.error || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB51E3]"></div>
            <span className="text-[#310055] font-semibold text-lg">Loading quiz...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-red-50 border border-red-300 rounded-lg px-8 py-6 shadow-lg max-w-md text-center">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Quiz</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg text-center">
          <p className="text-[#310055] text-lg">Quiz not found</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-[#d2b4e9] text-center">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              result.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {result.passed ? (
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-[#310055] mb-4">Quiz Complete!</h1>
            
            <div className="space-y-4 mb-6">
              <div className="text-4xl font-bold text-[#310055]">
                {result.score}/{result.total}
              </div>
              <div className="text-2xl font-semibold text-gray-600">
                {result.percent}%
              </div>
              <div className={`inline-block px-4 py-2 rounded-full text-lg font-medium ${
                result.passed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.passed ? 'Passed' : 'Failed'}
              </div>
              {!result.passed && (
                <p className="text-gray-600">
                  Passing score: {quiz.passingScore}%
                </p>
              )}
            </div>

            <button
              onClick={() => window.history.back()}
              className="bg-[#AB51E3] text-white px-8 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium"
            >
              Back to Course
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-[#d2b4e9]">
            <h1 className="text-3xl font-bold text-[#310055] mb-4">{quiz.title}</h1>
            
            {quiz.description && (
              <p className="text-gray-600 mb-6">{quiz.description}</p>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[#AB51E3] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-gray-700">{quiz.questions.length} questions</span>
              </div>
              
              {quiz.timeLimit && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-[#AB51E3] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">Time limit: {quiz.timeLimit} minutes</span>
                </div>
              )}
              
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[#AB51E3] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-gray-700">Passing score: {quiz.passingScore}%</span>
              </div>
            </div>

            <div className="bg-[#f2dfff] rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-[#310055] mb-2">Instructions:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Read each question carefully</li>
                <li>• Select the best answer for each question</li>
                {quiz.timeLimit && <li>• Complete the quiz within the time limit</li>}
                <li>• You can change your answers before submitting</li>
                <li>• Click "Submit Quiz" when you're done</li>
              </ul>
            </div>

            <button
              onClick={startQuiz}
              className="w-full bg-[#AB51E3] text-white py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium text-lg"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with timer */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9] mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-[#310055]">{quiz.title}</h1>
            {timeLeft !== null && (
              <div className={`flex items-center px-4 py-2 rounded-lg font-bold ${
                timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-[#f2dfff] text-[#310055]'
              }`}>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(timeLeft)}
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((question, index) => (
            <div key={question._id} className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
              <div className="flex items-start mb-4">
                <span className="bg-[#AB51E3] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 mt-1">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-[#310055] mb-4">{question.questionText}</h3>
                  
                  {question.type === "multiple-choice" && question.options && (
                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="flex items-center p-3 border border-[#d2b4e9] rounded-lg hover:bg-[#f9f0ff] cursor-pointer">
                          <input
                            type="radio"
                            name={question._id}
                            value={option}
                            checked={answers[question._id] === option}
                            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                            className="text-[#AB51E3] mr-3"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {question.type === "true-false" && (
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border border-[#d2b4e9] rounded-lg hover:bg-[#f9f0ff] cursor-pointer">
                        <input
                          type="radio"
                          name={question._id}
                          value="true"
                          checked={answers[question._id] === "true"}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          className="text-[#AB51E3] mr-3"
                        />
                        <span className="text-gray-700">True</span>
                      </label>
                      <label className="flex items-center p-3 border border-[#d2b4e9] rounded-lg hover:bg-[#f9f0ff] cursor-pointer">
                        <input
                          type="radio"
                          name={question._id}
                          value="false"
                          checked={answers[question._id] === "false"}
                          onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                          className="text-[#AB51E3] mr-3"
                        />
                        <span className="text-gray-700">False</span>
                      </label>
                    </div>
                  )}

                  {question.type === "short-answer" && (
                    <textarea
                      value={answers[question._id] || ""}
                      onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                      className="w-full p-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                      rows={3}
                      placeholder="Type your answer here..."
                    />
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-500 ml-12">
                {question.points} point{question.points !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting || Object.keys(answers).length === 0}
            className="bg-[#AB51E3] text-white px-8 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2 inline-block"></div>
                Submitting...
              </>
            ) : (
              'Submit Quiz'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;