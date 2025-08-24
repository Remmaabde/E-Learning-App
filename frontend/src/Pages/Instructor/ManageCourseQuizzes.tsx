import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../Axios/axios";

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  courseId: string;
  questions: Array<{
    _id: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    questionText: string;
    options?: string[];
    points?: number;
  }>;
  timeLimit?: number;
  passingScore: number;
  totalPoints?: number;
  isActive: boolean;
  createdAt: string;
}

interface Course {
  _id: string;
  title: string;
  description: string;
}

const ManageCourseQuizzes: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetchCourseAndQuizzes();
  }, [courseId]);

  const fetchCourseAndQuizzes = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      
      // Fetch course details and quizzes in parallel
      const [courseResponse, quizzesResponse] = await Promise.all([
        api.get(`/instructor/courses/${courseId}`),
        api.get(`/quizzes/course/${courseId}`)
      ]);
      
      setCourse(courseResponse.data);
      setQuizzes(quizzesResponse.data);
    } catch (error: any) {
      console.error("Fetch course/quizzes error:", error);
      setError(error.response?.data?.error || "Failed to load course data");
    } finally {
      setLoading(false);
    }
  };

  const toggleQuizStatus = async (quizId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/instructor/quizzes/${quizId}/toggle`, {
        isActive: !currentStatus
      });
      
      // Update local state
      setQuizzes(quizzes.map(quiz => 
        quiz._id === quizId 
          ? { ...quiz, isActive: !currentStatus }
          : quiz
      ));
    } catch (error: any) {
      console.error("Toggle quiz status error:", error);
      alert("Failed to update quiz status");
    }
  };

  const deleteQuiz = async (quizId: string) => {
    if (!window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/instructor/quizzes/${quizId}`);
      setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-red-50 border border-red-300 rounded-lg px-8 py-6 shadow-lg max-w-md text-center">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Data</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link to="/instructor/my-courses" className="hover:text-[#AB51E3]">My Courses</Link>
            <span>›</span>
            <span className="text-[#310055]">Manage Quizzes</span>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-[#310055] mb-2">Course Quizzes</h1>
              <h2 className="text-xl text-gray-600 mb-2">{course?.title}</h2>
              <p className="text-gray-600">{course?.description}</p>
            </div>
            <Link
              to={`/instructor/create-quiz?courseId=${courseId}`}
              className="bg-[#AB51E3] text-white px-6 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Quiz
            </Link>
          </div>
        </div>

        {/* Quizzes List */}
        <div className="space-y-6">
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div key={quiz._id} className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold text-[#310055] mr-3">{quiz.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        quiz.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {quiz.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    {quiz.description && (
                      <p className="text-gray-600 mb-3">{quiz.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        {quiz.questions.length} questions
                      </span>
                      
                      {quiz.timeLimit && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {quiz.timeLimit} minutes
                        </span>
                      )}
                      
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        {quiz.passingScore}% passing
                      </span>
                      
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 9v2m-6 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quiz Questions Preview */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Questions Preview:</h4>
                  <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                    {quiz.questions.slice(0, 3).map((question, index) => (
                      <div key={question._id} className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">{index + 1}.</span> {question.questionText}
                        <span className="text-xs text-gray-400 ml-2">({question.type})</span>
                      </div>
                    ))}
                    {quiz.questions.length > 3 && (
                      <div className="text-xs text-gray-400">
                        ... and {quiz.questions.length - 3} more questions
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/quiz/take/${quiz._id}`}
                    className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                  >
                    👁️ Preview Quiz
                  </Link>
                  
                  <Link
                    to={`/instructor/create-quiz?edit=${quiz._id}`}
                    className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                  >
                    ✏️ Edit Quiz
                  </Link>
                  
                  <button
                    onClick={() => toggleQuizStatus(quiz._id, quiz.isActive)}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      quiz.isActive
                        ? 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {quiz.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                  </button>
                  
                  <button
                    onClick={() => deleteQuiz(quiz._id)}
                    className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f2dfff] rounded-xl p-12 text-center">
              <svg className="w-24 h-24 mx-auto text-[#AB51E3] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-semibold text-[#310055] mb-4">No Quizzes Yet</h3>
              <p className="text-gray-600 mb-6 text-lg">Create assessments to test your students' knowledge!</p>
              <Link
                to={`/instructor/create-quiz?courseId=${courseId}`}
                className="bg-[#AB51E3] text-white px-8 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium inline-flex items-center"
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
    </div>
  );
};

export default ManageCourseQuizzes;
