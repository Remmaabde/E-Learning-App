import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../../Axios/axios";

interface Course {
  _id: string;
  title: string;
}

interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  questionText: string;
  options?: string[];
  correctAnswer: string;
  points: number;
}

interface QuizFormData {
  title: string;
  description: string;
  courseId: string;
  timeLimit: number;
  passingScore: number;
  questions: Question[];
}

const CreateQuiz: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Get courseId from URL parameters if provided
  const searchParams = new URLSearchParams(location.search);
  const preselectedCourseId = searchParams.get('courseId');
  
  const [formData, setFormData] = useState<QuizFormData>({
    title: '',
    description: '',
    courseId: preselectedCourseId || '',
    timeLimit: 30,
    passingScore: 70,
    questions: []
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/instructor/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Fetch courses error:", error);
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'multiple-choice',
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1
    };
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { ...q, options: q.options?.map((opt, oi) => oi === optionIndex ? value : opt) }
          : q
      )
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.courseId || formData.questions.length === 0) {
      alert("Please fill in all required fields and add at least one question");
      return;
    }

    // Validate questions
    for (let i = 0; i < formData.questions.length; i++) {
      const q = formData.questions[i];
      if (!q.questionText || !q.correctAnswer) {
        alert(`Question ${i + 1} is incomplete`);
        return;
      }
      if (q.type === 'multiple-choice' && (!q.options || q.options.some(opt => !opt.trim()))) {
        alert(`Question ${i + 1} needs all options filled`);
        return;
      }
    }

    try {
      setLoading(true);
      await api.post("/instructor/quizzes", formData);
      navigate("/instructor/quizzes");
    } catch (error: any) {
      console.error("Create quiz error:", error);
      alert(error.response?.data?.error || "Failed to create quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#310055] mb-2">Create New Quiz</h1>
          <p className="text-lg text-gray-600">Design an assessment for your students</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quiz Basic Info */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
            <h2 className="text-xl font-semibold text-[#310055] mb-4">Quiz Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#310055] mb-2">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                  placeholder="Enter quiz title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#310055] mb-2">
                  Course *
                </label>
                <select
                  value={formData.courseId}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
                  className="w-full p-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#310055] mb-2">
                  Time Limit (minutes)
                </label>
                <input
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                  min="0"
                  placeholder="0 for no limit"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#310055] mb-2">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, passingScore: parseInt(e.target.value) || 0 }))}
                  className="w-full p-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                  min="0"
                  max="100"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-[#310055] mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                rows={3}
                placeholder="Enter quiz description"
              />
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#310055]">Questions ({formData.questions.length})</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-[#AB51E3] text-white px-4 py-2 rounded-lg hover:bg-[#310055] transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Question
              </button>
            </div>

            {formData.questions.map((question, index) => (
              <div key={question.id} className="border border-[#d2b4e9] rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-[#310055]">Question {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#310055] mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={question.questionText}
                      onChange={(e) => updateQuestion(index, 'questionText', e.target.value)}
                      className="w-full p-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                      rows={2}
                      placeholder="Enter your question"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#310055] mb-2">
                      Question Type
                    </label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                      className="w-full p-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                    >
                      <option value="multiple-choice">Multiple Choice</option>
                      <option value="true-false">True/False</option>
                      <option value="short-answer">Short Answer</option>
                    </select>
                  </div>
                </div>

                {/* Question Options */}
                {question.type === 'multiple-choice' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#310055] mb-2">
                      Answer Options *
                    </label>
                    <div className="space-y-2">
                      {question.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600 w-8">{String.fromCharCode(65 + optionIndex)}.</span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                            className="flex-1 p-2 border border-[#d2b4e9] rounded focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            required
                          />
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === option}
                            onChange={() => updateQuestion(index, 'correctAnswer', option)}
                            className="text-[#AB51E3]"
                            title="Mark as correct answer"
                          />
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Select the radio button next to the correct answer</p>
                  </div>
                )}

                {question.type === 'true-false' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#310055] mb-2">
                      Correct Answer *
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          value="true"
                          checked={question.correctAnswer === 'true'}
                          onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                          className="text-[#AB51E3] mr-2"
                        />
                        True
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          value="false"
                          checked={question.correctAnswer === 'false'}
                          onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                          className="text-[#AB51E3] mr-2"
                        />
                        False
                      </label>
                    </div>
                  </div>
                )}

                {question.type === 'short-answer' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-[#310055] mb-2">
                      Expected Answer *
                    </label>
                    <input
                      type="text"
                      value={question.correctAnswer}
                      onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                      className="w-full p-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                      placeholder="Enter the expected answer"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Students' answers will be compared against this (case-insensitive)</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#310055] mb-2">
                    Points
                  </label>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value) || 1)}
                    className="w-24 p-2 border border-[#d2b4e9] rounded focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                    min="1"
                  />
                </div>
              </div>
            ))}

            {formData.questions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No questions added yet. Click "Add Question" to start creating your quiz.</p>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/instructor/quizzes")}
              className="px-6 py-3 border border-[#AB51E3] text-[#AB51E3] rounded-lg hover:bg-[#AB51E3] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || formData.questions.length === 0}
              className="px-6 py-3 bg-[#AB51E3] text-white rounded-lg hover:bg-[#310055] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                'Create Quiz'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
