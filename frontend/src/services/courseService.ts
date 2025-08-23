// frontend/src/services/courseService.ts
import type { Course, CourseFilter } from "../Pages/courses/types";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function fetchCourses(filter: CourseFilter = {}): Promise<Course[] | { items: Course[]; total: number }> {
  const params = new URLSearchParams();
  if (filter.search) params.set("search", filter.search);
  if (filter.category) params.set("category", filter.category);
  if (filter.minRating) params.set("minRating", String(filter.minRating));
  if (filter.tag) params.set("tag", filter.tag);

  const res = await fetch(`${API_BASE}/api/courses?${params.toString()}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch courses");
  return res.json();
}

export async function fetchCourseById(id: string): Promise<Course> {
  const res = await fetch(`${API_BASE}/api/courses/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch course");
  return res.json();
}
