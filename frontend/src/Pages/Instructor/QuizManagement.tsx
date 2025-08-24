import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../../Axios/axios";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  questions: any[];
  timeLimit: number;
  passingScore: number;
  isActive: boolean;
  createdAt: string;
  attempts: number;
  avgScore: number;
}

const QuizManagement: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/instructor/quizzes");
      setQuizzes(response.data);
    } catch (error: any) {
      console.error("Fetch quizzes error:", error);
      setError(error.response?.data?.error || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuizStatus = async (quizId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/instructor/quizzes/${quizId}/toggle`, {
        isActive: !currentStatus
      });
      fetchQuizzes(); // Refresh the list
    } catch (error: any) {
      console.error("Toggle quiz status error:", error);
      alert("Failed to update quiz status");
    }
  };

  const deleteQuiz = async (quizId: string) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    
    try {
      await api.delete(`/instructor/quizzes/${quizId}`);
      fetchQuizzes(); // Refresh the list
    } catch (error: any) {
      console.error("Delete quiz error:", error);
      alert("Failed to delete quiz");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB51E3]"></div>
            <span className="text-[#310055] font-semibold text-lg">Loading quizzes...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#310055] mb-2">Quiz Management</h1>
            <p className="text-lg text-gray-600">Create and manage quizzes for your courses</p>
          </div>
          <Link
            to="/instructor/create-quiz"
            className="bg-[#AB51E3] text-white px-6 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Quiz
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 rounded-lg px-6 py-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Quiz Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Quizzes</p>
                <p className="text-2xl font-bold text-[#310055]">{quizzes.length}</p>
              </div>
              <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Quizzes</p>
                <p className="text-2xl font-bold text-[#310055]">{quizzes.filter(q => q.isActive).length}</p>
              </div>
              <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Attempts</p>
                <p className="text-2xl font-bold text-[#310055]">{quizzes.reduce((sum, q) => sum + (q.attempts || 0), 0)}</p>
              </div>
              <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Score</p>
                <p className="text-2xl font-bold text-[#310055]">
                  {quizzes.length > 0 ? Math.round(quizzes.reduce((sum, q) => sum + (q.avgScore || 0), 0) / quizzes.length) : 0}%
                </p>
              </div>
              <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quizzes List */}
        {quizzes.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-[#d2b4e9]">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#310055]">All Quizzes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f2dfff]">
                  <tr>
                    <th className="text-left p-4 text-[#310055] font-semibold">Quiz Title</th>
                    <th className="text-left p-4 text-[#310055] font-semibold">Course</th>
                    <th className="text-left p-4 text-[#310055] font-semibold">Questions</th>
                    <th className="text-left p-4 text-[#310055] font-semibold">Time Limit</th>
                    <th className="text-left p-4 text-[#310055] font-semibold">Passing Score</th>
                    <th className="text-left p-4 text-[#310055] font-semibold">Status</th>
                    <th className="text-left p-4 text-[#310055] font-semibold">Attempts</th>
                    <th className="text-left p-4 text-[#310055] font-semibold">Avg Score</th>
                    <th className="text-left p-4 text-[#310055] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz._id} className="border-b border-gray-100 hover:bg-[#f9f0ff]">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-[#310055]">{quiz.title}</div>
                          <div className="text-sm text-gray-600">{quiz.description}</div>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{quiz.courseName}</td>
                      <td className="p-4 text-gray-600">{quiz.questions?.length || 0}</td>
                      <td className="p-4 text-gray-600">
                        {quiz.timeLimit ? `${quiz.timeLimit} min` : 'No limit'}
                      </td>
                      <td className="p-4 text-gray-600">{quiz.passingScore}%</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          quiz.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {quiz.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">{quiz.attempts || 0}</td>
                      <td className="p-4 text-gray-600">{quiz.avgScore || 0}%</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/instructor/quiz/${quiz._id}/edit`}
                            className="text-[#AB51E3] hover:text-[#310055] text-sm font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => toggleQuizStatus(quiz._id, quiz.isActive)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {quiz.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <Link
                            to={`/instructor/quiz/${quiz._id}/results`}
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                          >
                            Results
                          </Link>
                          <button
                            onClick={() => deleteQuiz(quiz._id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-[#f2dfff] rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-[#AB51E3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-[#310055] mb-2">No Quizzes Yet</h3>
            <p className="text-gray-600 mb-6">Create your first quiz to get started with student assessments!</p>
            <Link
              to="/instructor/create-quiz"
              className="bg-[#AB51E3] text-white px-6 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManagement;
