import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../Axios/axios";

interface CourseMetrics {
  enrollments: number;
  completions: number;
  completionRate: number;
  avgProgress: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  published: boolean;
  lessons: any[];
  price: number;
  createdAt: string;
  metrics: CourseMetrics;
}

const InstructorCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get("/instructor/courses");
        setCourses(response.data);
      } catch (error: any) {
        console.error("Courses fetch error:", error);
        setError(error.response?.data?.error || "Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const togglePublishStatus = async (courseId: string, currentStatus: boolean) => {
    try {
      await api.post(`/instructor/courses/${courseId}/publish`, {
        published: !currentStatus
      });
      
      // Update local state
      setCourses(courses.map(course => 
        course._id === courseId 
          ? { ...course, published: !currentStatus }
          : course
      ));
    } catch (error: any) {
      console.error("Toggle publish error:", error);
      alert("Failed to update course status");
    }
  };

  const deleteCourse = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/instructor/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error: any) {
      console.error("Delete course error:", error);
      alert("Failed to delete course");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB51E3]"></div>
            <span className="text-[#310055] font-semibold text-lg">Loading courses...</span>
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
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Courses</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-7xl mx-auto">
    
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#310055] mb-2">My Courses</h1>
            <p className="text-lg text-gray-600">Manage your courses and track performance</p>
          </div>
          <Link 
            to="/instructor/create-course"
            className="bg-[#AB51E3] text-white px-6 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create New Course
          </Link>
        </div>

    
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9] hover:shadow-xl transition-shadow">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-[#310055] mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-3">{course.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="bg-[#f2dfff] text-[#310055] px-2 py-1 rounded-full">{course.category}</span>
                      <span className="capitalize">{course.level}</span>
                      <span>{course.lessons?.length || 0} lessons</span>
                    </div>
                  </div>
                </div>

            
                <div className="mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {course.published ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#310055]">{course.metrics.enrollments}</p>
                    <p className="text-sm text-gray-600">Students</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#310055]">{course.metrics.completionRate}%</p>
                    <p className="text-sm text-gray-600">Completion</p>
                  </div>
                </div>

                
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Avg Progress</span>
                    <span>{course.metrics.avgProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#AB51E3] h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${course.metrics.avgProgress}%` }}
                    ></div>
                  </div>
                </div>

            
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Link
                      to={`/instructor/courses/${course._id}/edit`}
                      className="flex-1 bg-[#AB51E3] text-white px-4 py-2 rounded-lg hover:bg-[#310055] transition-colors text-sm font-medium text-center"
                    >
                      Edit Course
                    </Link>
                    <Link
                      to={`/instructor/students/${course._id}`}
                      className="flex-1 bg-white text-[#AB51E3] border border-[#AB51E3] px-4 py-2 rounded-lg hover:bg-[#AB51E3] hover:text-white transition-colors text-sm font-medium text-center"
                    >
                      View Students
                    </Link>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/instructor/courses/${course._id}/lessons`}
                      className="flex-1 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium text-center"
                    >
                      📹 Manage Lessons
                    </Link>
                    <Link
                      to={`/instructor/courses/${course._id}/quizzes`}
                      className="flex-1 bg-purple-100 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium text-center"
                    >
                      📝 Manage Quizzes
                    </Link>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => togglePublishStatus(course._id, course.published)}
                      className={`flex-1 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                        course.published
                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {course.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button
                      onClick={() => deleteCourse(course._id)}
                      className="flex-1 bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Course Details */}
                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                    <span>Price: ${course.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#f2dfff] rounded-xl p-12 text-center">
            <svg className="w-24 h-24 mx-auto text-[#AB51E3] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-2xl font-semibold text-[#310055] mb-4">No Courses Yet</h3>
            <p className="text-gray-600 mb-6 text-lg">Start building your course library and reach students worldwide!</p>
            <Link 
              to="/instructor/create-course"
              className="bg-[#AB51E3] text-white px-8 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCourses;
