import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../Axios/axios";

interface CourseMetric {
  _id: string;
  title: string;
  enrollments: number;
  completions: number;
  completionRate: number;
  avgProgress: number;
}

interface RecentActivity {
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  progress: number;
  lastActivity: string;
}

interface DashboardData {
  overview: {
    totalCourses: number;
    totalStudents: number;
    completedCourses: number;
    avgCompletionRate: number;
    recentEnrollments: number;
  };
  courseMetrics: CourseMetric[];
  recentActivity: RecentActivity[];
  topPerformingCourses: CourseMetric[];
}

const InstructorDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get("/instructor/dashboard");
        setDashboardData(response.data);
      } catch (error: any) {
        console.error("Dashboard fetch error:", error);
        setError(error.response?.data?.error || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB51E3]"></div>
            <span className="text-[#310055] font-semibold text-lg">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-red-50 border border-red-300 rounded-lg px-8 py-6 shadow-lg max-w-md text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-red-800 font-semibold text-lg mb-2">Dashboard Error</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg text-center">
          <p className="text-[#310055] text-lg">No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-7xl mx-auto">
      
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#310055] mb-2">Instructor Dashboard</h1>
          <p className="text-lg text-gray-600">Monitor your courses and student progress</p>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gradient-to-r from-[#AB51E3] to-[#310055] rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Courses</p>
                <p className="text-2xl font-bold">{dashboardData.overview.totalCourses}</p>
              </div>
              <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-2xl font-bold text-[#310055]">{dashboardData.overview.totalStudents}</p>
              </div>
              <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completions</p>
                <p className="text-2xl font-bold text-[#310055]">{dashboardData.overview.completedCourses}</p>
              </div>
              <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Completion</p>
                <p className="text-2xl font-bold text-[#310055]">{dashboardData.overview.avgCompletionRate}%</p>
              </div>
              <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">New Enrollments</p>
                <p className="text-2xl font-bold text-[#310055]">{dashboardData.overview.recentEnrollments}</p>
                <p className="text-xs text-gray-500">Last 30 days</p>
              </div>
              <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
        </div>

      
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#310055] mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/instructor/create-course"
              className="bg-[#AB51E3] text-white px-6 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create New Course
            </Link>
            <Link 
              to="/instructor/my-courses"
              className="bg-white text-[#AB51E3] border-2 border-[#AB51E3] px-6 py-3 rounded-lg hover:bg-[#AB51E3] hover:text-white transition-colors font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Manage Courses
            </Link>
            <Link 
              to="/instructor/quizzes"
              className="bg-white text-[#AB51E3] border-2 border-[#AB51E3] px-6 py-3 rounded-lg hover:bg-[#AB51E3] hover:text-white transition-colors font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Create Quiz
            </Link>
           
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
          <section className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
            <h2 className="text-xl font-semibold text-[#310055] mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Top Performing Courses
            </h2>
            
            {dashboardData.topPerformingCourses.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.topPerformingCourses.map((course, index) => (
                  <div key={course._id} className="flex items-center justify-between p-4 bg-[#f2dfff] rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-3 ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-[#AB51E3]'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-[#310055]">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.enrollments} students enrolled</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#310055]">{course.completionRate}%</p>
                      <p className="text-sm text-gray-600">completion</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-[#AB51E3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-semibold text-[#310055] mb-2">No Courses Yet</h3>
                <p className="text-gray-600">Create your first course to see performance metrics!</p>
              </div>
            )}
          </section>

       
          <section className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
            <h2 className="text-xl font-semibold text-[#310055] mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Student Activity
            </h2>
            
            {dashboardData.recentActivity.length > 0 ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {dashboardData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#f2dfff] rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-[#AB51E3] rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {activity.studentName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#310055]">{activity.studentName}</h4>
                        <p className="text-sm text-gray-600">{activity.courseTitle}</p>
                        <p className="text-xs text-gray-500">{new Date(activity.lastActivity).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="bg-[#AB51E3] h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${activity.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-[#310055]">{activity.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-[#AB51E3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-[#310055] mb-2">No Activity Yet</h3>
                <p className="text-gray-600">Student activity will appear here once you have enrolled students.</p>
              </div>
            )}
          </section>
        </div>

       
        {dashboardData.courseMetrics.length > 0 && (
          <section className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
            <h2 className="text-xl font-semibold text-[#310055] mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              All Courses Performance
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#f2dfff]">
                    <th className="text-left p-3 text-[#310055] font-semibold">Course</th>
                    <th className="text-left p-3 text-[#310055] font-semibold">Enrollments</th>
                    <th className="text-left p-3 text-[#310055] font-semibold">Completions</th>
                    <th className="text-left p-3 text-[#310055] font-semibold">Completion Rate</th>
                    <th className="text-left p-3 text-[#310055] font-semibold">Avg Progress</th>
                    <th className="text-left p-3 text-[#310055] font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.courseMetrics.map((course) => (
                    <tr key={course._id} className="border-b border-gray-100 hover:bg-[#f9f0ff]">
                      <td className="p-3">
                        <div className="font-medium text-[#310055]">{course.title}</div>
                      </td>
                      <td className="p-3 text-gray-600">{course.enrollments}</td>
                      <td className="p-3 text-gray-600">{course.completions}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.completionRate >= 80 ? 'bg-green-100 text-green-800' :
                          course.completionRate >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {course.completionRate}%
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-[#AB51E3] h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${course.avgProgress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{course.avgProgress}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Link 
                          to={`/instructor/students/${course._id}`}
                          className="text-[#AB51E3] hover:text-[#310055] text-sm font-medium"
                        >
                          View Students
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
