// frontend/src/Pages/Courses/CourseCatalog.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import type { Course, CourseFilter } from "./types";
import { fetchCourses } from "../../services/courseService";

// your original chips
const categories = [
  "UI/UX",
  "Fullstack",
  "AI",
  "Backend",
  "LLM",
  "Graphic Designing",
  "Prompt Engineering",
  "Frontend",
];

const tags = ["HTML", "CSS", "Express", "React", "Python", "Tailwind", "AI"];

// fallback local data (used only if API fails)
const dummyCourses: Course[] = [
  {
    id: "1",
    title: "Introduction To Figma",
    category: "UI/UX",
    description: "Create Beautiful and Responsive Designs using Figma",
    instructor: {
      id: "i1",
      name: "Sarah",
      bio: "",
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop",
    },
    lessons: [],
    rating: 4.5,
    reviewsCount: 987,
    skills: ["UX Research", "UX Design", "Prototyping", "UI Design","Design Thinking","Responsive","UI/UX","Graphic Designing"],
  },
  {
    id: "2",
    title: "Fullstack Development",
    category: "Fullstack",
    description: "Master frontend + backend development step by step.",
    instructor: {
      id: "i2",
      name: "James",
      bio: "",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&h=300&fit=crop",
    },
    lessons: [],
    rating: 4.7,
    reviewsCount: 1500,
    skills: ["React", "Node.js", "MongoDB", "Express","Git","Sql","Css","Tailwind","Front-end","Backend","HTML","CSS"],
  },
  {
    id: "3",
    title: "Basic of HTML",
    category: "Frontend",
    description: "Master HTML step by step.",
    instructor: {
      id: "i3",
      name: "Hades",
      bio: "Well Known in the industry",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
    },
    lessons: [],
    rating: 4.7,
    reviewsCount: 1500,
    skills: ["HTML", "Forms", "Embedding images"],
  },
  {
    id: "4",
    title: "Intoduction to Gen AI",
    category: "AI",
    description: "Get ready to revolutionize your AI knowledge with Direct-Ed's introductory course  on Foundation Models & Generative AI! In this comprehensive program, you'll discover the latest breakthroughs in the AI world",
  instructor: {
      id: "i4",
      name: "vanessa",
      bio: "Well Known in the industry",
      image:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop",
    },
    lessons: [],
    rating: 4.7,
    reviewsCount: 1500,
    skills: ["Gen_AI","Llama3","Chatgpt","grook","Python","AI","Prompt engineering"],
  },
  {
    id: "5",
    title: "Introduction to Prompt Engineering: How to Effectively Use ChatGPT & Other AI Language Models",
    category: "AI",
    description: "Dive in and learn how to use ChatGPT in order to create effective prompts that will guide language models to create accurate, relevant, and coherent output",
  instructor: {
      id: "i5",
      name: "vanessa",
      bio: "Well Known in the industry",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop",
    },
    lessons: [],
    rating: 4.7,
    reviewsCount: 1500,
    skills: ["Gen_AI","Llama3","Chatgpt","grook","Python","AI","Prompt engineering"],
  },
  {
    id: "6",
    title: "Master Front-end",
    category: "Front end",
    description: "Learn how to build and deploy a SaaS landing page with modern UI and mobile-first principles while strengthening your React.js and Tailwind CSS skills.",
    instructor: {
      id: "i6",
      name: "Jabir",
      bio: "A Well known Senior Developer in the field.",
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&h=300&fit=crop",
    },
    lessons: [],
    rating: 4.5,
    reviewsCount: 987,
    skills: ["React","Tailwind","SAAS","Responsive","Css","Bootstrap","Axios"],
  },
];

const CourseCatalog: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<CourseFilter>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // debounced search to reduce API calls while typing
  const [searchRaw, setSearchRaw] = useState("");
  const search = useDebounce(searchRaw, 350);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchCourses({
          ...filter,
          search: search || undefined,
        });

        // some APIs return {items, total}; if yours returns array, handle both:
        const list = Array.isArray(data) ? data : data?.items ?? [];
        setCourses(list);
      } catch (e) {
        console.error(e);
        setError("Could not load courses from API. Showing local data.");
        setCourses(dummyCourses); // fallback so UI stays intact
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filter.category, filter.minRating, filter.tag, search]);

  const handleCourseClick = (id: string) => navigate(`/courses/${id}`);

  // local filter for tag/category in case API doesn’t support them yet
  const filteredCourses = useMemo(() => {
    let out = courses.slice();
    if (filter.tag) out = out.filter((c) => c.skills?.includes(filter.tag!));
    if (filter.category) out = out.filter((c) => c.category === filter.category);
    return out;
  }, [courses, filter.category, filter.tag]);

  return (
    <div className="p-6">
      {/* Category Grid (2 columns x 4 rows on sm+) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setFilter((f) => ({
                ...f,
                category: f.category === cat ? undefined : cat,
              }))
            }
            className={`p-4 rounded-2xl font-bold shadow-md hover:bg-blue-100 transition ${
              filter.category === cat ? "bg-blue-300" : "bg-gray-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filter.category && (
        <button
          onClick={() => setFilter((f) => ({ ...f, category: undefined }))}
          className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-full"
        >
          All Courses
        </button>
      )}

      <h1 className="text-3xl font-bold mb-4">Explore Our Courses</h1>

    
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search courses..."
          className="border rounded-lg px-4 py-2 w-full sm:w-1/2"
          value={searchRaw}
          onChange={(e) => setSearchRaw(e.target.value)}
        />
        <select
          title="Minimum rating"
          className="border rounded-lg px-4 py-2 w-full sm:w-48"
          value={filter.minRating ?? ""}
          onChange={(e) =>
            setFilter((f) => ({
              ...f,
              minRating: e.target.value ? Number(e.target.value) : undefined,
            }))
          }
        >
          <option value="">Any rating</option>
          <option value="3">3★+</option>
          <option value="4">4★+</option>
          <option value="4.5">4.5★+</option>
        </select>
      </div>

      {/* Tag Buttons (little circular chips) */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() =>
              setFilter((f) => ({ ...f, tag: f.tag === tag ? undefined : tag }))
            }
            className={`px-4 py-2 rounded-full border text-sm shadow-sm transition ${
              filter.tag === tag
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {tag}
          </button>
        ))}
        {filter.tag && (
          <button
            onClick={() => setFilter((f) => ({ ...f, tag: undefined }))}
            className="px-4 py-2 rounded-full bg-gray-800 text-white text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Grid of Courses */}
      {loading ? (
        <p>Loading courses…</p>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded-md bg-yellow-50 p-3 text-yellow-800">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={handleCourseClick}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CourseCatalog;

/** small debounce hook */
function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}
