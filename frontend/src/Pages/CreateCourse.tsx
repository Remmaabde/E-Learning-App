import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../Axios/axios";

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  order: number;
}

interface CourseFormData {
  title: string;
  description: string;
  category: string;
  level: string;
  price: number;
  tags: string[];
  lessons: Lesson[];
}

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    price: 0,
    tags: [],
    lessons: []
  });
  
  const [newTag, setNewTag] = useState("");
  const [newLesson, setNewLesson] = useState<Omit<Lesson, "id" | "order">>({
    title: "",
    description: "",
    videoUrl: "",
    duration: ""
  });
  
  const [activeTab, setActiveTab] = useState<"details" | "lessons" | "settings">("details");

  const categories = [
    "Programming", "Web Development", "Mobile Development", "Data Science",
    "Machine Learning", "AI", "Cybersecurity", "Cloud Computing", "DevOps",
    "UI/UX Design", "Digital Marketing", "Business", "Languages", "Other"
  ];

  const levels = ["beginner", "intermediate", "advanced"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addLesson = () => {
    if (newLesson.title.trim() && newLesson.videoUrl.trim()) {
      const lesson: Lesson = {
        ...newLesson,
        id: Date.now().toString(),
        order: formData.lessons.length + 1
      };
      
      setFormData(prev => ({
        ...prev,
        lessons: [...prev.lessons, lesson]
      }));
      
      setNewLesson({
        title: "",
        description: "",
        videoUrl: "",
        duration: ""
      });
    }
  };

  const removeLesson = (lessonId: string) => {
    setFormData(prev => ({
      ...prev,
      lessons: prev.lessons.filter(lesson => lesson.id !== lessonId)
        .map((lesson, index) => ({ ...lesson, order: index + 1 }))
    }));
  };

  const moveLesson = (lessonId: string, direction: "up" | "down") => {
    const lessons = [...formData.lessons];
    const index = lessons.findIndex(lesson => lesson.id === lessonId);
    
    if (direction === "up" && index > 0) {
      [lessons[index], lessons[index - 1]] = [lessons[index - 1], lessons[index]];
    } else if (direction === "down" && index < lessons.length - 1) {
      [lessons[index], lessons[index + 1]] = [lessons[index + 1], lessons[index]];
    }
    
    // Update order numbers
    const reorderedLessons = lessons.map((lesson, idx) => ({ ...lesson, order: idx + 1 }));
    
    setFormData(prev => ({
      ...prev,
      lessons: reorderedLessons
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/instructor/courses", formData);
      
      alert("Course created successfully!");
      navigate("/instructor/my-courses");
    } catch (error: any) {
      console.error("Create course error:", error);
      alert(error.response?.data?.error || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F0FF] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#310055] mb-2">Create New Course</h1>
          <p className="text-lg text-gray-600">Build an engaging course for your students</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg border border-[#d2b4e9] mb-8">
          <div className="flex border-b border-[#d2b4e9]">
            {[
              { id: "details", label: "Course Details", icon: "📚" },
              { id: "lessons", label: "Lessons", icon: "🎥" },
              { id: "settings", label: "Settings", icon: "⚙️" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#AB51E3] text-white'
                    : 'text-[#310055] hover:bg-[#f2dfff]'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {/* Course Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#310055] mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                    placeholder="Enter course title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#310055] mb-2">
                    Course Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                    placeholder="Describe what students will learn in this course"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#310055] mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#310055] mb-2">
                      Difficulty Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                    >
                      {levels.map(level => (
                        <option key={level} value={level} className="capitalize">
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Tags Section */}
                <div>
                  <label className="block text-sm font-medium text-[#310055] mb-2">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="flex-1 px-4 py-2 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                      placeholder="Add a tag"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-[#AB51E3] text-white px-4 py-2 rounded-lg hover:bg-[#310055] transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="bg-[#f2dfff] text-[#310055] px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Lessons Tab */}
            {activeTab === "lessons" && (
              <div className="space-y-6">
                {/* Add New Lesson */}
                <div className="bg-[#f2dfff] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#310055] mb-4">Add New Lesson</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      type="text"
                      value={newLesson.title}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                      className="px-4 py-2 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                      placeholder="Lesson title"
                    />
                    <input
                      type="text"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson(prev => ({ ...prev, duration: e.target.value }))}
                      className="px-4 py-2 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                      placeholder="Duration (e.g., 10:30)"
                    />
                  </div>
                  <input
                    type="url"
                    value={newLesson.videoUrl}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                    className="w-full px-4 py-2 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent mb-4"
                    placeholder="Video URL (YouTube, Vimeo, etc.)"
                  />
                  <textarea
                    value={newLesson.description}
                    onChange={(e) => setNewLesson(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent mb-4"
                    rows={3}
                    placeholder="Lesson description"
                  />
                  <button
                    type="button"
                    onClick={addLesson}
                    className="bg-[#AB51E3] text-white px-6 py-2 rounded-lg hover:bg-[#310055] transition-colors"
                  >
                    Add Lesson
                  </button>
                </div>

                {/* Lessons List */}
                <div>
                  <h3 className="text-lg font-semibold text-[#310055] mb-4">
                    Course Lessons ({formData.lessons.length})
                  </h3>
                  {formData.lessons.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No lessons added yet. Add your first lesson above.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.lessons.map((lesson, index) => (
                        <div key={lesson.id} className="bg-white border border-[#d2b4e9] rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span className="bg-[#AB51E3] text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                                  {lesson.order}
                                </span>
                                <h4 className="font-semibold text-[#310055]">{lesson.title}</h4>
                                {lesson.duration && (
                                  <span className="ml-auto text-sm text-gray-500">{lesson.duration}</span>
                                )}
                              </div>
                              {lesson.description && (
                                <p className="text-gray-600 text-sm mb-2 ml-9">{lesson.description}</p>
                              )}
                              <p className="text-sm text-blue-600 ml-9 truncate">{lesson.videoUrl}</p>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                type="button"
                                onClick={() => moveLesson(lesson.id, "up")}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-[#AB51E3] disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button
                                type="button"
                                onClick={() => moveLesson(lesson.id, "down")}
                                disabled={index === formData.lessons.length - 1}
                                className="p-1 text-gray-400 hover:text-[#AB51E3] disabled:opacity-30"
                              >
                                ↓
                              </button>
                              <button
                                type="button"
                                onClick={() => removeLesson(lesson.id)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#310055] mb-2">
                    Course Price (USD)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border border-[#d2b4e9] rounded-lg focus:ring-2 focus:ring-[#AB51E3] focus:border-transparent"
                    placeholder="0.00"
                  />
                  <p className="text-sm text-gray-500 mt-1">Set to 0 for a free course</p>
                </div>

                <div className="bg-[#f2dfff] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-[#310055] mb-4">Course Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Title:</span>
                      <p className="font-medium text-[#310055]">{formData.title || "Not set"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <p className="font-medium text-[#310055]">{formData.category || "Not set"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Level:</span>
                      <p className="font-medium text-[#310055] capitalize">{formData.level}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Price:</span>
                      <p className="font-medium text-[#310055]">${formData.price}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Lessons:</span>
                      <p className="font-medium text-[#310055]">{formData.lessons.length}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tags:</span>
                      <p className="font-medium text-[#310055]">{formData.tags.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-8 border-t border-[#d2b4e9]">
              <button
                type="button"
                onClick={() => navigate("/instructor/my-courses")}
                className="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#AB51E3] text-white px-8 py-3 rounded-lg hover:bg-[#310055] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
