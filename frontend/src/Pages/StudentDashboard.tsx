import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchStudentDashboard, fetchStudentActivity, downloadCertificate } from "../services/studentService";
import type {StudentDashboardData} from "../services/studentService";

interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalLessonsCompleted: number;
  averageProgress: number;
}

interface EnhancedDashboardData extends StudentDashboardData {
  stats: DashboardStats;
}

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingCert, setDownloadingCert] = useState<string | null>(null);

  const handleDownloadCertificate = async (courseId: string) => {
    try {
      setDownloadingCert(courseId);
      await downloadCertificate(courseId);
    } catch (error: any) {
      console.error("Certificate download error:", error);
      alert(error.message || "Failed to download certificate");
    } finally {
      setDownloadingCert(null);
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Please log in to access your dashboard");
          setLoading(false);
          return;
        }

        const data = await fetchStudentDashboard();
        setDashboard(data);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log in again.");
          localStorage.removeItem("token"); 
        } else {
          setError("Failed to load dashboard");
        }
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
      <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB51E3]"></div>
          <span className="text-[#310055] font-semibold text-lg">Loading dashboard...</span>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
      <div className="bg-red-50 border border-red-300 rounded-lg px-8 py-6 shadow-lg max-w-md text-center">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-red-800 font-semibold text-lg mb-2">Dashboard Error</h3>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        {error.includes("log in") && (
          <button 
            onClick={() => window.location.href = "/login"}
            className="bg-[#AB51E3] text-white px-6 py-2 rounded-full hover:bg-[#310055] transition-colors"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );

  if (!dashboard) return (
    <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
      <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg text-center">
        <p className="text-[#310055] text-lg">No dashboard data available</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#310055] mb-2">Student Dashboard</h1>
          <p className="text-lg text-gray-600">Track your learning progress and manage your courses</p>
        </div>

        {/* Stats Cards */}
        {dashboard.stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-[#AB51E3] to-[#310055] rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Courses</p>
                  <p className="text-2xl font-bold">{dashboard.stats.totalCourses}</p>
                </div>
                <svg className="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-[#310055]">{dashboard.stats.completedCourses}</p>
                </div>
                <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Lessons Completed</p>
                  <p className="text-2xl font-bold text-[#310055]">{dashboard.stats.totalLessonsCompleted}</p>
                </div>
                <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Average Progress</p>
                  <p className="text-2xl font-bold text-[#310055]">{dashboard.stats.averageProgress}%</p>
                </div>
                <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Enrolled Courses Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#310055] mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Enrolled Courses
          </h2>
          
          {dashboard.enrolledCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboard.enrolledCourses.map((course: {
                courseId: string;
                title: string;
                overallPercent: number;
                lessonsCompleted: number;
                totalLessons: number;
              }) => (
                <div key={course.courseId} className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
                  <h3 className="font-bold text-lg text-[#310055] mb-3">{course.title}</h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{course.overallPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#AB51E3] h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${course.overallPercent}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {course.lessonsCompleted}/{course.totalLessons} lessons completed
                    </span>
                    <button 
                      onClick={() => navigate(`/courses/${course.courseId}`)}
                      className="bg-[#f2dfff] text-[#310055] px-3 py-1 rounded-full text-xs font-medium hover:bg-[#d2b4e9] transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#f2dfff] rounded-xl p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-[#AB51E3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-semibold text-[#310055] mb-2">No Courses Yet</h3>
              <p className="text-gray-600 mb-4">Start learning by enrolling in your first course!</p>
              <button 
                onClick={() => window.location.href = "/courses"}
                className="bg-[#AB51E3] text-white px-6 py-2 rounded-full hover:bg-[#310055] transition-colors"
              >
                Browse Courses
              </button>
            </div>
          )}
        </section>

        {/* Recent Activity Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-[#310055] mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h2>
          
          {dashboard.recentActivity.length > 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
              <div className="space-y-4">
                {dashboard.recentActivity.slice(0, 5).map((activity: any, index: number) => (
                  <div key={`${activity.lessonId}-${index}`} className="flex items-center justify-between p-3 bg-[#f2dfff] rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-[#AB51E3] rounded-full mr-3"></div>
                      <div>
                        <span className="text-[#310055] font-medium">
                          {activity.lessonTitle || `Lesson ${activity.lessonId}`} completed
                        </span>
                        {activity.courseTitle && (
                          <p className="text-sm text-gray-600">in {activity.courseTitle}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Date(activity.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-[#f2dfff] rounded-xl p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-[#AB51E3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-[#310055] mb-2">No Activity Yet</h3>
              <p className="text-gray-600">Your learning activity will appear here once you start completing lessons.</p>
            </div>
          )}
        </section>

        {/* Certificates Section */}
        <section>
          <h2 className="text-2xl font-semibold text-[#310055] mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            My Certificates ({dashboard.enrolledCourses?.filter((course: any) => course.overallPercent === 100).length || 0})
          </h2>
          
          {dashboard.enrolledCourses?.filter((course: any) => course.overallPercent === 100).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboard.enrolledCourses
                .filter((course: any) => course.overallPercent === 100)
                .map((course: any) => (
                <div key={course.courseId} className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9] hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#AB51E3] to-[#310055] rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-[#310055] mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Course completed successfully!
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDownloadCertificate(course.courseId)}
                      disabled={downloadingCert === course.courseId}
                      className="flex-1 bg-[#AB51E3] text-white px-4 py-2 rounded-lg hover:bg-[#310055] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {downloadingCert === course.courseId ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generating...
                        </>
                      ) : (
                        "Download Certificate"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#f2dfff] rounded-xl p-8 text-center">
              <svg className="w-16 h-16 mx-auto text-[#AB51E3] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h3 className="text-lg font-semibold text-[#310055] mb-2">No Certificates Yet</h3>
              <p className="text-gray-600">Complete courses to earn certificates and showcase your achievements!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDashboard;
