// frontend/src/Pages/Courses/CourseCatalog.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";
import type { Course, CourseFilter } from "./types";
import { fetchCourses } from "../../services/courseService";


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
    title: "Introduction to Gen AI",
    category: "AI",
    description: "Get ready to revolutionize your AI knowledge with Direct-Ed's introductory course on Foundation Models & Generative AI! In this comprehensive program, you'll discover the latest breakthroughs in the AI world",
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
    category: "Frontend",
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
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  
  const [searchQuery, setSearchQuery] = useState("");

  
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchCourses({});
        const coursesList = Array.isArray(data) ? data : data?.items ?? [];
        
        if (coursesList.length === 0) {
        
          setAllCourses(dummyCourses);
          setError("Using sample data - API returned no courses");
        } else {
          setAllCourses(coursesList);
        }
      } catch (e) {
        console.error("Failed to fetch courses:", e);
<<<<<<< HEAD
        setError("Could not load courses from API. Showing sample data.");
=======
       
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
        setAllCourses(dummyCourses); 
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  
  const filteredCourses = useMemo(() => {
    let result = allCourses.slice();

    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((course) => {
        const titleMatch = course.title.toLowerCase().includes(query);
        const descriptionMatch = course.description.toLowerCase().includes(query);
        const instructorMatch = course.instructor.name.toLowerCase().includes(query);
        const categoryMatch = course.category.toLowerCase().includes(query);
        const skillsMatch = course.skills?.some(skill => 
          skill.toLowerCase().includes(query)
        ) ?? false;

        return titleMatch || descriptionMatch || instructorMatch || categoryMatch || skillsMatch;
      });
    }

    
    if (filter.category) {
      result = result.filter((course) => course.category === filter.category);
    }

    
    if (filter.tag) {
      result = result.filter((course) => 
        course.skills?.some(skill => 
          skill.toLowerCase().includes(filter.tag!.toLowerCase())
        ) ?? false
      );
    }

    
    if (filter.minRating) {
      result = result.filter((course) => course.rating >= filter.minRating!);
    }

    return result;
  }, [allCourses, searchQuery, filter.category, filter.tag, filter.minRating]);

  const handleCourseClick = (id: string) => navigate(`/courses/${id}`);

  const clearAllFilters = () => {
    setFilter({});
    setSearchQuery("");
  };

  const hasActiveFilters = filter.category || filter.tag || filter.minRating || searchQuery.trim();

  return (
    <div className="p-6 max-w-7xl mx-auto bg-[#F9F0FF] min-h-screen">
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
            className={`p-4 rounded-2xl font-bold shadow-md hover:bg-[#d2b4e9] transition-colors duration-200 ${
              filter.category === cat ? "bg-[#AB51E3] text-white" : "bg-[#d2b4e9] text-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <h1 className="text-3xl font-bold mb-6 text-black">Explore Our Courses</h1>

      
      <div className="bg-[#f2dfff] p-4 rounded-lg shadow-sm border mb-6">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search courses, skills, instructors..."
              className="border rounded-lg px-4 py-2 w-full pr-10 focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
          
          <select
            title="Minimum rating"
            className="border rounded-lg px-4 py-2 w-full sm:w-48 focus:ring-2 focus:ring-[#AB51E3] focus:border-[#AB51E3] outline-none bg-white"
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

      
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="text-sm text-black font-medium mr-2 flex items-center">Skills:</span>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setFilter((f) => ({ ...f, tag: f.tag === tag ? undefined : tag }))
              }
              className={`px-3 py-1 rounded-full border text-sm shadow-sm transition-colors duration-200 ${
                filter.tag === tag
                  ? "bg-[#AB51E3] text-white border-[#AB51E3]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

      
        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-black font-medium">Active filters:</span>
            
            {searchQuery && (
              <span className="px-2 py-1 bg-[#310055] text-white rounded-full text-sm flex items-center gap-1">
                Search: "{searchQuery}"
                <button 
                  onClick={() => setSearchQuery("")}
                  className="ml-1 hover:text-gray-200"
                >
                  ✕
                </button>
              </span>
            )}
            
            {filter.category && (
              <span className="px-2 py-1 bg-[#310055] text-white rounded-full text-sm flex items-center gap-1">
                {filter.category}
                <button 
                  onClick={() => setFilter(f => ({...f, category: undefined}))}
                  className="ml-1 hover:text-gray-200"
                >
                  ✕
                </button>
              </span>
            )}
            
            {filter.tag && (
              <span className="px-2 py-1 bg-[#310055] text-white rounded-full text-sm flex items-center gap-1">
                {filter.tag}
                <button 
                  onClick={() => setFilter(f => ({...f, tag: undefined}))}
                  className="ml-1 hover:text-gray-200"
                >
                  ✕
                </button>
              </span>
            )}
            
            {filter.minRating && (
              <span className="px-2 py-1 bg-[#310055] text-white rounded-full text-sm flex items-center gap-1">
                {filter.minRating}★+
                <button 
                  onClick={() => setFilter(f => ({...f, minRating: undefined}))}
                  className="ml-1 hover:text-gray-200"
                >
                  ✕
                </button>
              </span>
            )}
            
            <button
              onClick={clearAllFilters}
              className="px-3 py-1 bg-[#310055] text-white rounded-full text-sm hover:bg-[#AB51E3] transition-colors duration-200"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

    
      <div className="flex justify-between items-center mb-4">
        <p className="text-black">
          {loading ? "Loading..." : `${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''} found`}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-black">Loading courses...</div>
        </div>
      ) : (
        <>
          {error && (
            <div className="mb-4 rounded-md bg-yellow-50 p-3 text-yellow-800 border border-yellow-200">
              <strong>Note:</strong> {error}
            </div>
          )}
          
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-black text-lg mb-2">No courses found</div>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-[#AB51E3] text-white rounded-lg hover:bg-[#310055] transition-colors duration-200"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={handleCourseClick}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseCatalog;