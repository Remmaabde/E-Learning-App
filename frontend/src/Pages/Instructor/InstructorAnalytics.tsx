import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../Axios/axios";

interface StudentProgress {
  _id: string;
  studentId: {
    _id: string;
    name: string;
    email: string;
  };
  overallPercent: number;
  lessons: {
    lessonId: string;
    lessonTitle: string;
    completed: boolean;
    completedAt?: string;
  }[];
  enrolledAt: string;
  lastActivity: string;
}

interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  totalStudents: number;
  activeStudents: number;
  averageProgress: number;
  completionRate: number;
  totalLessons: number;
  studentProgress: StudentProgress[];
  engagementMetrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    averageTimeSpent: string;
  };
}

const InstructorAnalytics: React.FC = () => {
  const { courseId } = useParams<{ courseId?: string }>();
  const [analytics, setAnalytics] = useState<CourseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [selectedCourse, setSelectedCourse] = useState<string>(courseId || "");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchAnalytics(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await api.get("/instructor/courses");
      setCourses(response.data);
      if (!selectedCourse && response.data.length > 0) {
        setSelectedCourse(response.data[0]._id);
      }
    } catch (error: any) {
      console.error("Fetch courses error:", error);
    }
  };

  const fetchAnalytics = async (courseId: string) => {
    try {
      setLoading(true);
      const response = await api.get(`/instructor/students/${courseId}`);
      setAnalytics(response.data);
    } catch (error: any) {
      console.error("Fetch analytics error:", error);
      setError(error.response?.data?.error || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB51E3]"></div>
            <span className="text-[#310055] font-semibold text-lg">Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#310055] mb-2">Course Analytics</h1>
          <p className="text-lg text-gray-600">Detailed insights into student progress and engagement</p>
        </div>

        {/* Course Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#310055] mb-2">Select Course</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-96 p-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
          >
            <option value="">Choose a course...</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.title}</option>
            ))}
          </select>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 rounded-lg px-6 py-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {analytics && (
          <>
            {/* Analytics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-r from-[#AB51E3] to-[#310055] rounded-xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Students</p>
                    <p className="text-2xl font-bold">{analytics.totalStudents}</p>
                  </div>
                  <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Students</p>
                    <p className="text-2xl font-bold text-[#310055]">{analytics.activeStudents}</p>
                  </div>
                  <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Avg Progress</p>
                    <p className="text-2xl font-bold text-[#310055]">{analytics.averageProgress}%</p>
                  </div>
                  <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Completion Rate</p>
                    <p className="text-2xl font-bold text-[#310055]">{analytics.completionRate}%</p>
                  </div>
                  <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9] mb-8">
              <h2 className="text-xl font-semibold text-[#310055] mb-4">Engagement Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[#f2dfff] rounded-lg">
                  <p className="text-2xl font-bold text-[#310055]">{analytics.engagementMetrics.dailyActiveUsers}</p>
                  <p className="text-sm text-gray-600">Daily Active Users</p>
                </div>
                <div className="text-center p-4 bg-[#f2dfff] rounded-lg">
                  <p className="text-2xl font-bold text-[#310055]">{analytics.engagementMetrics.weeklyActiveUsers}</p>
                  <p className="text-sm text-gray-600">Weekly Active Users</p>
                </div>
                <div className="text-center p-4 bg-[#f2dfff] rounded-lg">
                  <p className="text-2xl font-bold text-[#310055]">{analytics.engagementMetrics.averageTimeSpent}</p>
                  <p className="text-sm text-gray-600">Avg Time Spent</p>
                </div>
              </div>
            </div>

            {/* Student Progress Table */}
            <div className="bg-white rounded-xl shadow-lg border border-[#d2b4e9]">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-[#310055]">Student Progress Details</h2>
              </div>
              
              {analytics.studentProgress.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f2dfff]">
                      <tr>
                        <th className="text-left p-4 text-[#310055] font-semibold">Student</th>
                        <th className="text-left p-4 text-[#310055] font-semibold">Email</th>
                        <th className="text-left p-4 text-[#310055] font-semibold">Progress</th>
                        <th className="text-left p-4 text-[#310055] font-semibold">Lessons Completed</th>
                        <th className="text-left p-4 text-[#310055] font-semibold">Enrolled</th>
                        <th className="text-left p-4 text-[#310055] font-semibold">Last Activity</th>
                        <th className="text-left p-4 text-[#310055] font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.studentProgress.map((student) => (
                        <tr key={student._id} className="border-b border-gray-100 hover:bg-[#f9f0ff]">
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-[#AB51E3] rounded-full flex items-center justify-center text-white font-bold mr-3">
                                {student.studentId.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="font-medium text-[#310055]">{student.studentId.name}</div>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">{student.studentId.email}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-[#AB51E3] h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${student.overallPercent}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-[#310055]">{student.overallPercent}%</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600">
                            {student.lessons.filter(l => l.completed).length} / {analytics.totalLessons}
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(student.enrolledAt).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-gray-600">
                            {new Date(student.lastActivity).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              student.overallPercent === 100 
                                ? 'bg-green-100 text-green-800' 
                                : student.overallPercent > 50
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.overallPercent === 100 ? 'Completed' : 
                               student.overallPercent > 50 ? 'In Progress' : 'Just Started'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <svg className="w-16 h-16 mx-auto text-[#AB51E3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-[#310055] mb-2">No Students Enrolled</h3>
                  <p className="text-gray-600">This course doesn't have any enrolled students yet.</p>
                </div>
              )}
            </div>
          </>
        )}

        {!selectedCourse && (
          <div className="bg-[#f2dfff] rounded-xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-[#AB51E3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-[#310055] mb-2">Select a Course</h3>
            <p className="text-gray-600">Choose a course from the dropdown above to view detailed analytics and student progress.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorAnalytics;
