import React, { useState } from "react";
import type{ ICourse } from "../../types/course";

const CourseCreation: React.FC = () => {
  const [formData, setFormData] = useState<ICourse>({
    title: "",
    description: "",
    image: "",
    instructor: "",
    duration: "",
    category: "",
    rating: 0,
    featured: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev: ICourse) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Course submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Course Title:
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter course title"
        />
      </label>

      <label>
        Course Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter course description"
        />
      </label>

      <label>
        Featured:
        <input
          type="checkbox"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Create Course</button>
    </form>
  );
};

export default CourseCreation;
