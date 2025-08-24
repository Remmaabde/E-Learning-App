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
  lessons: any[];
  published: boolean;
  price: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  metrics: CourseMetrics;
}

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publishingCourse, setPublishingCourse] = useState<string | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get("/instructor/courses");
      setCourses(response.data);
    } catch (error: any) {
      console.error("Fetch courses error:", error);
      setError(error.response?.data?.error || "Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (courseId: string, currentStatus: boolean) => {
    try {
      setPublishingCourse(courseId);
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
      alert(error.response?.data?.error || "Failed to update course status");
    } finally {
      setPublishingCourse(null);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      return;
    }

    try {
      setDeletingCourse(courseId);
      await api.delete(`/instructor/courses/${courseId}`);
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error: any) {
      console.error("Delete course error:", error);
      alert(error.response?.data?.error || "Failed to delete course");
    } finally {
      setDeletingCourse(null);
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

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#310055] mb-2">My Courses</h1>
            <p className="text-lg text-gray-600">Manage your course content and track performance</p>
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

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 rounded-lg px-6 py-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Course Statistics */}
        {courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Courses</p>
                  <p className="text-2xl font-bold text-[#310055]">{courses.length}</p>
                </div>
                <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Published</p>
                  <p className="text-2xl font-bold text-[#310055]">
                    {courses.filter(course => course.published).length}
                  </p>
                </div>
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Enrollments</p>
                  <p className="text-2xl font-bold text-[#310055]">
                    {courses.reduce((sum, course) => sum + course.metrics.enrollments, 0)}
                  </p>
                </div>
                <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-[#d2b4e9] shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Avg Completion</p>
                  <p className="text-2xl font-bold text-[#310055]">
                    {courses.length > 0 
                      ? Math.round(courses.reduce((sum, course) => sum + course.metrics.completionRate, 0) / courses.length)
                      : 0}%
                  </p>
                </div>
                <svg className="w-8 h-8 text-[#AB51E3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Courses List */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl shadow-lg border border-[#d2b4e9] overflow-hidden">
                <div className="p-6">
                  {/* Course Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 mr-4">
                      <h3 className="text-lg font-bold text-[#310055] mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="px-2 py-1 bg-[#f2dfff] text-[#310055] rounded-full text-xs font-medium">
                          {course.level}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  {/* Course Metrics */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-[#f2dfff] rounded-lg">
                      <p className="text-lg font-bold text-[#310055]">{course.metrics.enrollments}</p>
                      <p className="text-xs text-gray-600">Enrollments</p>
                    </div>
                    <div className="text-center p-3 bg-[#f2dfff] rounded-lg">
                      <p className="text-lg font-bold text-[#310055]">{course.metrics.completionRate}%</p>
                      <p className="text-xs text-gray-600">Completion</p>
                    </div>
                  </div>

                  {/* Course Info */}
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                    <span>{course.lessons.length} lessons</span>
                    <span>${course.price}</span>
                  </div>

                  {/* Tags */}
                  {course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {course.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {course.tags.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{course.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Link
                        to={`/instructor/edit-course/${course._id}`}
                        className="flex-1 bg-[#AB51E3] text-white text-center py-2 rounded-lg hover:bg-[#310055] transition-colors text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/instructor/students/${course._id}`}
                        className="flex-1 bg-white border-2 border-[#AB51E3] text-[#AB51E3] text-center py-2 rounded-lg hover:bg-[#AB51E3] hover:text-white transition-colors text-sm font-medium"
                      >
                        Students
                      </Link>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTogglePublish(course._id, course.published)}
                        disabled={publishingCourse === course._id}
                        className={`flex-1 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 ${
                          course.published
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                        }`}
                      >
                        {publishingCourse === course._id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            {course.published ? 'Unpublishing...' : 'Publishing...'}
                          </div>
                        ) : (
                          course.published ? 'Unpublish' : 'Publish'
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCourse(course._id)}
                        disabled={deletingCourse === course._id}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:opacity-50"
                      >
                        {deletingCourse === course._id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            Deleting...
                          </div>
                        ) : (
                          'Delete'
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Creation Date */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Created {new Date(course.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg className="w-24 h-24 mx-auto text-[#AB51E3] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-2xl font-bold text-[#310055] mb-4">No courses yet</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start your teaching journey by creating your first course. Share your expertise and help students learn new skills.
            </p>
            <Link
              to="/instructor/create-course"
              className="inline-flex items-center bg-[#AB51E3] text-white px-8 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium"
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

export default MyCourses;
