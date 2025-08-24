import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../Axios/axios";

interface Lesson {
  _id?: string;
  title: string;
  duration: string;
  videoUrl: string;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  level: string;
  tags: string[];
  price: number;
  lessons: Lesson[];
}

const CourseCreateEdit: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEdit = Boolean(courseId);

  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    tags: [],
    price: 0,
    lessons: []
  });

  const [newTag, setNewTag] = useState("");
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    title: "",
    duration: "",
    videoUrl: ""
  });
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [previewVideoUrl, setPreviewVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "UI/UX Design",
    "Digital Marketing",
    "Business",
    "Photography",
    "Music",
    "Language",
    "Health & Fitness",
    "Cooking",
    "Art & Craft"
  ];

  const levels = ["beginner", "intermediate", "advanced"];

  useEffect(() => {
    if (isEdit && courseId) {
      fetchCourse();
    }
  }, [isEdit, courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/instructor/courses/${courseId}`);
      const course = response.data;
      setFormData({
        title: course.title || "",
        description: course.description || "",
        category: course.category || "",
        level: course.level || "beginner",
        tags: course.tags || [],
        price: course.price || 0,
        lessons: course.lessons || []
      });
    } catch (error: any) {
      console.error("Fetch course error:", error);
      setError(error.response?.data?.error || "Failed to load course");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleLessonInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentLesson(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddLesson = () => {
    if (currentLesson.title && currentLesson.duration && currentLesson.videoUrl) {
      if (editingLessonIndex !== null) {
        // Edit existing lesson
        const updatedLessons = [...formData.lessons];
        updatedLessons[editingLessonIndex] = currentLesson;
        setFormData(prev => ({ ...prev, lessons: updatedLessons }));
        setEditingLessonIndex(null);
      } else {
        // Add new lesson
        setFormData(prev => ({
          ...prev,
          lessons: [...prev.lessons, currentLesson]
        }));
      }
      setCurrentLesson({ title: "", duration: "", videoUrl: "" });
      setPreviewVideoUrl("");
    }
  };

  const handleEditLesson = (index: number) => {
    setCurrentLesson(formData.lessons[index]);
    setEditingLessonIndex(index);
    setPreviewVideoUrl(formData.lessons[index].videoUrl);
  };

  const handleDeleteLesson = (index: number) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.filter((_, i) => i !== index)
    }));
  };

  const handlePreviewVideo = () => {
    if (currentLesson.videoUrl) {
      setPreviewVideoUrl(currentLesson.videoUrl);
    }
  };

  const convertToEmbedUrl = (url: string): string => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url; // Return as-is if it's already an embed URL or different platform
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.lessons.length === 0) {
      setError("Please add at least one lesson");
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      const courseData = {
        ...formData,
        lessons: formData.lessons.map(lesson => ({
          ...lesson,
          videoUrl: convertToEmbedUrl(lesson.videoUrl)
        }))
      };

      if (isEdit) {
        await api.put(`/instructor/courses/${courseId}`, courseData);
        setSuccess("Course updated successfully!");
      } else {
        await api.post("/instructor/courses", courseData);
        setSuccess("Course created successfully!");
      }
      
      setTimeout(() => {
        navigate("/instructor/my-courses");
      }, 2000);
    } catch (error: any) {
      console.error("Submit course error:", error);
      setError(error.response?.data?.error || "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-[#F9F0FF] flex items-center justify-center">
        <div className="bg-[#f2dfff] rounded-lg px-8 py-6 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#AB51E3]"></div>
            <span className="text-[#310055] font-semibold text-lg">Loading course...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate("/instructor/my-courses")}
            className="text-[#AB51E3] hover:text-[#310055] font-medium mb-4 flex items-center"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </button>
          <h1 className="text-4xl font-bold text-[#310055] mb-2">
            {isEdit ? "Edit Course" : "Create New Course"}
          </h1>
          <p className="text-lg text-gray-600">
            {isEdit ? "Update your course content and settings" : "Build an engaging learning experience for your students"}
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-300 rounded-lg px-6 py-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800">{success}</span>
            </div>
          </div>
        )}

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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Course Information */}
          <section className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
            <h2 className="text-xl font-semibold text-[#310055] mb-4">Course Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none"
                  placeholder="Enter course title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none"
                placeholder="Describe what students will learn in this course"
                required
              />
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-[#AB51E3] text-white px-4 py-2 rounded-lg hover:bg-[#310055] transition-colors"
                >
                  Add Tag
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#f2dfff] text-[#310055] px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-[#AB51E3] hover:text-[#310055]"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Lesson Management */}
          <section className="bg-white rounded-xl shadow-lg p-6 border border-[#d2b4e9]">
            <h2 className="text-xl font-semibold text-[#310055] mb-4">Course Lessons</h2>
            
            {/* Add/Edit Lesson Form */}
            <div className="bg-[#f2dfff] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-medium text-[#310055] mb-4">
                {editingLessonIndex !== null ? "Edit Lesson" : "Add New Lesson"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentLesson.title}
                    onChange={handleLessonInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none"
                    placeholder="Enter lesson title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={currentLesson.duration}
                    onChange={handleLessonInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none"
                    placeholder="e.g., 15m or 1:30:00"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="videoUrl"
                    value={currentLesson.videoUrl}
                    onChange={handleLessonInputChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none"
                    placeholder="YouTube URL or embed link"
                  />
                  <button
                    type="button"
                    onClick={handlePreviewVideo}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Video Preview */}
              {previewVideoUrl && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video Preview
                  </label>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={convertToEmbedUrl(previewVideoUrl)}
                      className="w-full h-full"
                      frameBorder="0"
                      allowFullScreen
                      title="Video Preview"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddLesson}
                  disabled={!currentLesson.title || !currentLesson.duration || !currentLesson.videoUrl}
                  className="bg-[#AB51E3] text-white px-6 py-2 rounded-lg hover:bg-[#310055] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingLessonIndex !== null ? "Update Lesson" : "Add Lesson"}
                </button>
                
                {editingLessonIndex !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLessonIndex(null);
                      setCurrentLesson({ title: "", duration: "", videoUrl: "" });
                      setPreviewVideoUrl("");
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>

            {/* Lessons List */}
            <div>
              <h3 className="text-lg font-medium text-[#310055] mb-4">
                Course Lessons ({formData.lessons.length})
              </h3>
              
              {formData.lessons.length > 0 ? (
                <div className="space-y-3">
                  {formData.lessons.map((lesson, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                        <p className="text-sm text-gray-600">Duration: {lesson.duration}</p>
                        <p className="text-xs text-gray-500 truncate">{lesson.videoUrl}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          type="button"
                          onClick={() => handleEditLesson(index)}
                          className="text-[#AB51E3] hover:text-[#310055] p-2"
                          title="Edit lesson"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(index)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Delete lesson"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons added yet</h3>
                  <p className="text-gray-600">Add your first lesson using the form above</p>
                </div>
              )}
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/instructor/my-courses")}
              className="px-8 py-3 border-2 border-[#AB51E3] text-[#AB51E3] rounded-lg hover:bg-[#AB51E3] hover:text-white transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#AB51E3] text-white rounded-lg hover:bg-[#310055] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              )}
              {isEdit ? "Update Course" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCreateEdit;
