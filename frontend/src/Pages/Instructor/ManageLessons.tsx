import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../../Axios/axios";

interface Lesson {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  duration: string;
  order: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

const ManageLessons: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    videoUrl: "",
    duration: ""
  });

  useEffect(() => {
    fetchCourseAndLessons();
  }, [courseId]);

  const fetchCourseAndLessons = async () => {
    if (!courseId) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/instructor/courses/${courseId}`);
      setCourse(response.data);
      setLessons(response.data.lessons || []);
    } catch (error: any) {
      console.error("Fetch course error:", error);
      setError(error.response?.data?.error || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    try {
      const lessonData = {
        ...newLesson,
        order: lessons.length + 1
      };

      await api.post(`/instructor/courses/${courseId}/lessons`, lessonData);
      
      // Reset form and refresh data
      setNewLesson({ title: "", description: "", videoUrl: "", duration: "" });
      setShowAddForm(false);
      await fetchCourseAndLessons();
    } catch (error: any) {
      console.error("Add lesson error:", error);
      alert(error.response?.data?.error || "Failed to add lesson");
    }
  };

  const handleEditLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson || !courseId) return;

    try {
      await api.put(`/instructor/courses/${courseId}/lessons/${editingLesson._id}`, editingLesson);
      
      // Reset editing state and refresh data
      setEditingLesson(null);
      await fetchCourseAndLessons();
    } catch (error: any) {
      console.error("Edit lesson error:", error);
      alert(error.response?.data?.error || "Failed to update lesson");
    }
  };

  const deleteLesson = async (lessonId: string) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) {
      return;
    }

    try {
      await api.delete(`/instructor/courses/${courseId}/lessons/${lessonId}`);
      await fetchCourseAndLessons();
    } catch (error: any) {
      console.error("Delete lesson error:", error);
      alert(error.response?.data?.error || "Failed to delete lesson");
    }
  };

  const reorderLessons = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    try {
      await api.put(`/instructor/courses/${courseId}/lessons/reorder`, {
        fromIndex,
        toIndex
      });
      await fetchCourseAndLessons();
    } catch (error: any) {
      console.error("Reorder lessons error:", error);
      alert("Failed to reorder lessons");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB51E3]"></div>
            <span className="text-[#310055] font-semibold text-lg">Loading lessons...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-red-50 border border-red-300 rounded-lg px-8 py-6 shadow-lg max-w-md text-center">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Error Loading Course</h3>
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
            <span className="text-[#310055]">Manage Lessons</span>
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-[#310055] mb-2">Manage Lessons</h1>
              <h2 className="text-xl text-gray-600 mb-2">{course?.title}</h2>
              <p className="text-gray-600">{course?.description}</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-[#AB51E3] text-white px-6 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Lesson
            </button>
          </div>
        </div>

        {/* Add Lesson Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9] mb-8">
            <h3 className="text-xl font-semibold text-[#310055] mb-4">Add New Lesson</h3>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB51E3]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (e.g., "10:30")
                  </label>
                  <input
                    type="text"
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson({...newLesson, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB51E3]"
                    placeholder="10:30"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL *
                </label>
                <input
                  type="url"
                  value={newLesson.videoUrl}
                  onChange={(e) => setNewLesson({...newLesson, videoUrl: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB51E3]"
                  placeholder="https://www.youtube.com/embed/... or direct video file URL"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported: YouTube URLs, direct video files (.mp4, .webm, .ogg, etc.)
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB51E3]"
                  placeholder="Brief description of the lesson content..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-[#AB51E3] text-white px-6 py-2 rounded-lg hover:bg-[#310055] transition-colors font-medium"
                >
                  Add Lesson
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lessons List */}
        <div className="space-y-4">
          {lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <div key={lesson._id} className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
                {editingLesson && editingLesson._id === lesson._id ? (
                  /* Edit Form */
                  <form onSubmit={handleEditLesson} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Lesson Title *
                        </label>
                        <input
                          type="text"
                          value={editingLesson.title}
                          onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB51E3]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          value={editingLesson.duration}
                          onChange={(e) => setEditingLesson({...editingLesson, duration: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB51E3]"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video URL *
                      </label>
                      <input
                        type="url"
                        value={editingLesson.videoUrl}
                        onChange={(e) => setEditingLesson({...editingLesson, videoUrl: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB51E3]"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Supported: YouTube URLs, direct video files (.mp4, .webm, .ogg, etc.)
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editingLesson.description || ""}
                        onChange={(e) => setEditingLesson({...editingLesson, description: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#AB51E3]"
                      />
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="bg-[#AB51E3] text-white px-6 py-2 rounded-lg hover:bg-[#310055] transition-colors font-medium"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingLesson(null)}
                        className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Display Mode */
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="bg-[#AB51E3] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 text-sm">
                          {index + 1}
                        </span>
                        <h3 className="text-xl font-semibold text-[#310055]">{lesson.title}</h3>
                      </div>
                      
                      {lesson.description && (
                        <p className="text-gray-600 mb-3 ml-12">{lesson.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 ml-12 text-sm text-gray-500">
                        <span>📹 {lesson.duration}</span>
                        <span>🔗 <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[#AB51E3] hover:underline">View Video</a></span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Reorder buttons */}
                      {index > 0 && (
                        <button
                          onClick={() => reorderLessons(index, index - 1)}
                          className="p-2 text-gray-400 hover:text-[#AB51E3] transition-colors"
                          title="Move up"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      )}
                      
                      {index < lessons.length - 1 && (
                        <button
                          onClick={() => reorderLessons(index, index + 1)}
                          className="p-2 text-gray-400 hover:text-[#AB51E3] transition-colors"
                          title="Move down"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                      
                      <button
                        onClick={() => setEditingLesson(lesson)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit lesson"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => deleteLesson(lesson._id)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete lesson"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-[#f2dfff] rounded-xl p-12 text-center">
              <svg className="w-24 h-24 mx-auto text-[#AB51E3] mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-2xl font-semibold text-[#310055] mb-4">No Lessons Yet</h3>
              <p className="text-gray-600 mb-6 text-lg">Start building your course content by adding video lessons!</p>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-[#AB51E3] text-white px-8 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Your First Lesson
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageLessons;
