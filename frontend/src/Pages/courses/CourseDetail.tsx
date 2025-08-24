
import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import type { Course, Lesson } from "./types";
import { fetchCourseById } from "../../services/courseService";
=======
import { useParams, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import type { Course, Lesson } from "./types";
import { fetchCourseById } from "../../services/courseService";
import { completeLesson } from "../../services/studentService";
import EnrollButton from "../../components/EnrollButton";
import { isYouTubeVideo, getYouTubeEmbedUrl, getVideoMimeType, isDirectVideoFile } from "../../utils/videoHelpers";

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  course: string;
  questions: Array<{
    _id: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    question: string;
    options?: string[];
    correctAnswer: string | number;
    points: number;
  }>;
  timeLimit?: number;
  totalPoints: number;
  isActive: boolean;
  createdAt: string;
}

>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223


const fallbackCourse: Course[] = [
  {
<<<<<<< HEAD
    id: "1",
=======
    id: "507f1f77bcf86cd799439011",
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    title: "Introduction To Figma : Create Beautiful and Responsive Designs using Figma",
    category: "UI/UX",
    description: " provides instruction on using this popular tool for UI/UX design, web, and app design by covering its interface, design principles, and collaborative features. Courses typically teach how to create wireframes, design interfaces, build interactive prototypes, and work with advanced features like auto layout, components, and design systems. ",
    instructor: {
      id: "i1",
      name: "Sarem",
      bio: "Sarem is a UI/UX designer with 6+ years of experience working with startups and design agencies. he specializes in product design and has taught over 5,000 students how to bring their ideas to life using Figma. With a passion for teaching and a hands-on approach, Sarah makes learning design tools simple, practical, and fun.",
      image:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=300&h=300&fit=crop", 
    },
    lessons: [
      {
        id: "l1",
        title: "How to use Figma?",
        duration: "1:24:20",
        videoUrl: "https://www.youtube.com/embed/watch?v=bI6q16ffdgQ&list=PLlHtucAD9KT19ckHqXpPSStZOyDSq9AW-&index=1&pp=iAQB",
      },
      {
        id: "l2",
        title: "How to use Figma Frames & Autolayout?",
        duration: "1:01:30",
        videoUrl: "https://www.youtube.com/embed/watch?v=d88nvmnj5mU&list=PLlHtucAD9KT19ckHqXpPSStZOyDSq9AW-&index=2&pp=iAQB",
      },
      {
        id: "l3",
        title: "How to use Figma Styles & Libraries?",
        duration: "1:10:37",
        videoUrl: "https://www.youtube.com/embed/watch?v=LcY0X10H2wo&list=PLlHtucAD9KT19ckHqXpPSStZOyDSq9AW-&index=3&pp=iAQB",
      },
      {
        id: "l4",
        title: "How to use Figma Components & Variants?",
        duration: "1:10:37",
        videoUrl: "https://www.youtube.com/embed/watch?v=Vjw47lNNbeA&list=PLlHtucAD9KT19ckHqXpPSStZOyDSq9AW-&index=4&pp=iAQB",
      },
    ],
    rating: 5,
    reviewsCount: 987,
    skills: ["UI Design", "Prototyping","UI/UX","graphic Designing"],
  },
  {
<<<<<<< HEAD
    id: "2",
=======
    id: "507f1f77bcf86cd799439012",
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    title: "Fullstack Development",
    category: "Fullstack",
    description: "Master Full-stack development with our comprehensive, guided and mentored track to build scalable fullstack applications.",
    instructor: {
      id: "i2",
      name: "Mario",
      bio: "Senior fullstack developer with cutting edge skills in the market.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop",
    },
    lessons: [
      {
        id: "l1",
        title: "Matser HTML&CSS",
        duration: "14:02:50",
        videoUrl: "https://www.youtube.com/embed/watch?v=bWACo_pvKxg&list=PLSDeUiTMfxW6VChKWb26Z_mPR4f6fAmMV&index=1&pp=iAQB",
      },
      {
        id: "l2",
        title: "Master Tailwind CSS By Building 3 Projects | Tailwind CSS Complete Course ",
        duration: "3:47:27",
        videoUrl: "https://www.youtube.com/embed/watch?v=WvBnTJK7Khk&list=PLSDeUiTMfxW6VChKWb26Z_mPR4f6fAmMV&index=2&pp=iAQB",
      },
      {
        id: "l3",
        title: "From Zero to Full Stack: Master JavaScript and Create Dynamic Web Apps",
        duration: "15:30:38",
        videoUrl: "https://www.youtube.com/embed/watch?v=H3XIJYEPdus&list=PLSDeUiTMfxW6VChKWb26Z_mPR4f6fAmMV&index=3&pp=iAQB0gcJCa0JAYcqIYzv",
      },
      {
        id: "l4",
        title: "MySQL: From Beginner to Monster Level",
        duration: "03:53:56",
        videoUrl: "https://www.youtube.com/embed/watch?v=h4R-nJbM_ac&list=PLSDeUiTMfxW6VChKWb26Z_mPR4f6fAmMV&index=7&pp=iAQB",
      },
      {
        id: "l5",
        title: "The Complete Node.js Bootcamp: From Beginner to Expert | Unlocking the Power of Server-Side JS",
        duration: "02:56:58",
        videoUrl: "https://www.youtube.com/embed/watch?v=EsUL2bfKKLc&list=PLSDeUiTMfxW6VChKWb26Z_mPR4f6fAmMV&index=8&pp=iAQB", 
      },
      {
        id: "l6",
        title: "Express.js Mastery: Unleash the Power of Node.js Frameworks for Lightning-Fast Web Development!",
        duration: "02:56:58",
        videoUrl: "https://www.youtube.com/embed/watch?v=jn5MRu5ybH4&list=PLSDeUiTMfxW6VChKWb26Z_mPR4f6fAmMV&index=9&pp=iAQB0gcJCa0JAYcqIYzv",
      },
    ],
    rating: 4.5,
    reviewsCount: 987,
    skills: ["HTML", "CSS","Javascript","React","Express","MongoDB","Node.js","Vercel","git","backend","Frontend"],
  },
  {
<<<<<<< HEAD
    id: "3",
=======
    id: "507f1f77bcf86cd799439013",
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    title: "Introduction To HTML",
    category: "Frontend",
    description: "A comprehensive course to teach HTML5, Tags & Forms.",
    instructor: {
      id: "i3",
      name: "Haden",
      bio: "Haden is a Front-end developer with 3+ years of experience working with startups and design agencies. she specializes in Html tags and has taught over 1,000 students how to bring their ideas to life using Html. With a passion for teaching and a hands-on approach, Haden makes learning design tools simple, practical, and fun.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=300&fit=crop", 
    },
    lessons: [
      {
        id: "l1",
        title: "Learn HTML – Full Tutorial for Beginners",
        duration: "4:07:29",
        videoUrl: "https://www.youtube.com/embed/watch?v=kUMe1FH4CHE&list=PLWKjhJtqVAbnSe1qUNMG7AbPmjIG54u88&index=1&pp=iAQB",
      },
      {
        id: "l2",
        title: "Learn HTML & CSS – Full Course for Beginners",
        duration: "5:21:43",
        videoUrl: "https://www.youtube.com/embed/watch?v=a_iQb1lnAEQ&list=PLWKjhJtqVAbnSe1qUNMG7AbPmjIG54u88&index=2&pp=iAQB0gcJCa0JAYcqIYzv",
      },
      {
        id: "l3",
        title: "HTML & Coding Introduction – Course for Beginners",
        duration: "2:04:05",
        videoUrl: "https://www.youtube.com/embed/watch?v=GDGejH3SDNQ&list=PLWKjhJtqVAbnSe1qUNMG7AbPmjIG54u88&index=7&pp=iAQB",
      },
    ],
    rating: 5,
    reviewsCount: 987,
    skills: ["HTML", "Tags","UI/UX","CSS"],
  },
  {
<<<<<<< HEAD
    id: "4",
=======
    id: "507f1f77bcf86cd799439014",
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    title: "Introduction to Generative AI and LLMs [Pt 1] | Generative AI for Beginners",
    category: "AI",
    description: "Introduction our startup idea and mission, Generative AI and how we landed on the current technology landscape, Inner working of a large language model,Main capabilities and practical use cases of Large Language Models.",
    instructor: {
      id: "i4",
      name: "Carlotta",
      bio: "",
      image:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=300&h=300&fit=crop", 
    },
    lessons: [
      {
        id: "l1",
        title: "Introduction to Generative AI and LLMs [Pt 1] | Generative AI for Beginners",
        duration: "10:41",
        videoUrl: "https://www.youtube.com/embed/watch?v=lFXQkBvEe0o&list=PLlrxD0HtieHj2nfK54c62lcs3-YSTx3Je&index=1&pp=iAQB",
      },
      {
        id: "l2",
        title: "Exploring and comparing different LLMs [Pt 2] | Generative AI for Beginners",
        duration: "21:08",
        videoUrl: "https://www.youtube.com/embed/watch?v=KIRUeDKscfI&list=PLlrxD0HtieHj2nfK54c62lcs3-YSTx3Je&index=2&pp=iAQB",
      },
      {
        id: "l3",
        title: "Using Generative AI Responsibly [Pt 3] | Generative AI for Beginners",
        duration: "9:30",
        videoUrl: "https://www.youtube.com/embed/watch?v=YOp-e1GjZdA&list=PLlrxD0HtieHj2nfK54c62lcs3-YSTx3Je&index=3&pp=iAQB",
      },
    ],
    rating: 5,
    reviewsCount: 987,
    skills: ["AI","Prompt Engineering"],
  },
  {
<<<<<<< HEAD
    id: "5",
=======
    id: "507f1f77bcf86cd799439015",
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    title: "Introduction to Prompt Engineering",
    category: "Prompt Engineering",
    description: "Dive in and learn how to use ChatGPT in order to create effective prompts that will guide language models",
    instructor: {
      id: "i4",
      name: "Carlotta",
      bio: "",
      image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop", 
    },
    lessons: [
      {
        id: "l1",
        title: "Introduction to Generative AI and LLMs [Pt 1] | Generative AI for Beginners",
        duration: "10:41",
        videoUrl: "https://www.youtube.com/embed/watch?v=lFXQkBvEe0o&list=PLlrxD0HtieHj2nfK54c62lcs3-YSTx3Je&index=1&pp=iAQB",
      },
      {
        id: "l2",
        title: "Exploring and comparing different LLMs [Pt 2] | Generative AI for Beginners",
        duration: "21:08",
        videoUrl: "https://www.youtube.com/embed/watch?v=KIRUeDKscfI&list=PLlrxD0HtieHj2nfK54c62lcs3-YSTx3Je&index=2&pp=iAQB",
      },
      {
        id: "l3",
        title: "Using Generative AI Responsibly [Pt 3] | Generative AI for Beginners",
        duration: "9:30",
        videoUrl: "https://www.youtube.com/embed/watch?v=YOp-e1GjZdA&list=PLlrxD0HtieHj2nfK54c62lcs3-YSTx3Je&index=3&pp=iAQB",
      },
    ],
    rating: 5,
    reviewsCount: 987,
    skills: ["AI","Prompt Engineering"],
  },
  {
<<<<<<< HEAD
    id: "6",
    title: "Built a SaaS App Landing Page in 3 Hours",
    category: "Front end",
=======
    id: "507f1f77bcf86cd799439016",
    title: "Built a SaaS App Landing Page in 3 Hours",
    category: "Frontend",
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    description: "Learn how to build and deploy a SaaS landing page with modern UI and mobile-first principles while strengthening your React.js and Tailwind CSS skills. ",
    instructor: {
      id: "i1",
      name: "Jabir",
      bio: "Jabir is a Front-end developer with 4+ years of experience working with startups and Silicon valley. he specializes in React and has taught over 2,000 students how to bring their ideas to life using Figma. With a passion for teaching and a hands-on approach, Sarah makes learning design tools simple, practical, and fun.",
      image:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=300&h=300&fit=crop", 
    },
    lessons: [
      {
        id: "l1",
        title: "Built a SaaS App Landing Page in 3 Hours",
        duration: "2:49:03",
        videoUrl: "https://www.youtube.com/embed/watch?v=ukiGFmZ32YA&list=PL6QREj8te1P4-o8tvI3RF5NOEe0Amzd30&index=1&pp=iAQB",
      },
      {
        id: "l2",
        title: "Build & Deploy an Amazing 3D Portfolio with React.js & Three.js | Beginner Three.js Tutorial",
        duration: "4:28:44",
        videoUrl: "https://www.youtube.com/embed/watch?v=kt0FrkQgw8w&list=PL6QREj8te1P4-o8tvI3RF5NOEe0Amzd30&index=2&pp=iAQB",
      },
      {
        id: "l3",
        title: "Build and Deploy 3 Modern UI/UX Websites and Get Hired as a Frontend Developer",
        duration: "9:56:03",
        videoUrl: "https://www.youtube.com/embed/watch?v=RbxHZwFtRT4&list=PL6QREj8te1P4-o8tvI3RF5NOEe0Amzd30&index=3&pp=iAQB",
      },
      {
        id: "l4",
        title: "Build and Deploy an Apple Website with React",
        duration: "3:51:36",
        videoUrl: "https://www.youtube.com/embed/watch?v=kRQbRAJ4-Fs&list=PL6QREj8te1P4-o8tvI3RF5NOEe0Amzd30&index=4&pp=iAQBQB",
      },
    ],
    rating: 5,
    reviewsCount: 987,
<<<<<<< HEAD
    skills: ["front end","React","Tailwind","CSS","Responsive"],
=======
    skills: ["frontend","React","Tailwind","CSS","Responsive"],
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
  },
  
];
const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
<<<<<<< HEAD
=======
  const navigate = useNavigate();
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
<<<<<<< HEAD
  const [error, setError] = useState<string | null>(null);
=======
  const [error, setError] = useState<string | null>(null); 
  const [quizzes, setQuizzes] = useState<Quiz[]>([]); 
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) return;
        const data = await fetchCourseById(id);
        setCourse(data);
        setCurrentLesson(data.lessons?.[0] ?? null);
      } catch (e) {
          console.error(e);
<<<<<<< HEAD
          setError("Could not load course from API. Showing fallback.");
=======
         
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
          const chosen = fallbackCourse.find((c) => c.id === id) ?? fallbackCourse[0];
          setCourse(chosen);
          setCurrentLesson(chosen.lessons[0]);
        } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

<<<<<<< HEAD
  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId) ? prev : [...prev, lessonId]
    );
  };

  if (loading) return <p className="p-6">Loading course…</p>;
  if (!course) return <p className="p-6">❌ Course not found</p>;
=======
  // Fetch quizzes for the course
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!id) return;
      
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`http://localhost:5000/api/quizzes/course/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const quizzesData = await response.json();
          setQuizzes(quizzesData);
        }
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
      }
    };

    fetchQuizzes();
  }, [id]);

  const handleLessonComplete = async (lessonId: string) => {
    if (!course) return;
    
    try {
      // Add to completed lessons immediately for UI responsiveness
      setCompletedLessons((prev) =>
        prev.includes(lessonId) ? prev : [...prev, lessonId]
      );

      // Call API to mark lesson as complete
      const token = localStorage.getItem("token");
      if (token) {
        await completeLesson(course.id, lessonId);
        console.log(`Lesson ${lessonId} marked as completed`);
      }
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
      // Remove from completed lessons if API call failed
      setCompletedLessons((prev) => prev.filter(id => id !== lessonId));
    }
  };

  if (loading) return <p className="p-6">Loading course…</p>;
  if (!course) return <p className="p-6">Course not found</p>;
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {error && (
        <div className="mb-4 rounded-md bg-yellow-50 p-3 text-yellow-800">
          {error}
        </div>
      )}

      
      <div className="bg-purple-800 text-white rounded-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            {course.title}
          </h2>

<<<<<<< HEAD
          {/* 5-star rating */}
=======
        
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-6 w-6 ${
                  i < Math.round(course.rating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2">
              {course.rating} ({course.reviewsCount} reviews)
            </span>
          </div>

          <p className="mb-6">{course.description}</p>

<<<<<<< HEAD
          {/* Skills */}
=======
        
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
          <div className="flex flex-wrap gap-2 mb-6">
            {course.skills?.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-purple-200 text-purple-900 rounded-full font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

<<<<<<< HEAD
          <button className="bg-purple-300 text-purple-900 px-6 py-2 rounded-lg font-bold">
            Enroll Now
          </button>
=======
          <EnrollButton 
            courseId={course.id} 
            courseName={course.title}
            onEnrollmentChange={(enrolled) => {
              if (enrolled) {
                console.log("Successfully enrolled in", course.title);
              }
            }}
          />
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
        </div>

      
        {course.instructor?.image && (
          <img
            src={course.instructor.image}
            alt={course.title}
            className="w-40 h-40 rounded-xl object-cover mt-6 md:mt-0 md:ml-6"
          />
        )}
      </div>

      
      <h3 className="text-2xl font-bold mt-10">Meet The Instructor</h3>
      <div className="flex items-center gap-6 mt-4">
        <img
          src={course.instructor.image}
          alt={course.instructor.name}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h4 className="font-semibold text-xl">{course.instructor.name}</h4>
          <p>{course.instructor.bio}</p>
        </div>
      </div>

      
      <h3 className="text-2xl font-bold mt-10">Lesson Player</h3>
      {currentLesson && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">{currentLesson.title}</h4>

          
<<<<<<< HEAD
          {currentLesson.videoUrl.includes("youtube.com/embed") ? (
            <iframe
              key={currentLesson.id}
              width="100%"
              height="360"
              src={currentLesson.videoUrl}
              title={currentLesson.title}
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl border"
              onLoad={() => handleLessonComplete(currentLesson.id)}
            />
          ) : (
            <video
              key={currentLesson.id}
              controls
              width="100%"
              className="rounded-xl border"
              onEnded={() => handleLessonComplete(currentLesson.id)}
            >
              <source src={currentLesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
=======
          {(() => {
            const videoUrl = currentLesson.videoUrl;
            
            
            if (isYouTubeVideo(videoUrl)) {
              const embedUrl = getYouTubeEmbedUrl(videoUrl);
              
              return (
                <iframe
                  key={currentLesson.id}
                  width="100%"
                  height="360"
                  src={embedUrl}
                  title={currentLesson.title}
                  frameBorder={0}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl border"
                  onLoad={() => handleLessonComplete(currentLesson.id)}
                />
              );
            }
            
            
            if (isDirectVideoFile(videoUrl)) {
              const mimeType = getVideoMimeType(videoUrl);
              
              return (
                <video
                  key={currentLesson.id}
                  controls
                  width="100%"
                  className="rounded-xl border"
                  onEnded={() => handleLessonComplete(currentLesson.id)}
                  onError={(e) => {
                    console.error("Video error:", e);
                  }}
                >
                  <source src={videoUrl} type={mimeType} />
                  <p className="p-4 text-center text-gray-600">
                    Your browser does not support this video format.
                    <br />
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Click here to download or open the video
                    </a>
                  </p>
                </video>
              );
            }
            
            // Fallback for unknown video types - try as HTML5 video with multiple sources
            return (
              <video
                key={currentLesson.id}
                controls
                width="100%"
                className="rounded-xl border"
                onEnded={() => handleLessonComplete(currentLesson.id)}
                onError={(e) => {
                  console.error("Video error:", e);
                }}
              >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                <source src={videoUrl} type="video/ogg" />
                <p className="p-4 text-center text-gray-600">
                  Your browser does not support this video format or the video file is not accessible.
                  <br />
                  Video URL: <code className="bg-gray-200 px-2 py-1 rounded text-sm">{videoUrl}</code>
                  <br />
                  <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Click here to try opening the video directly
                  </a>
                </p>
              </video>
            );
          })()}
          
>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
          <p className="text-sm text-gray-600 mt-2">
            Duration: {currentLesson.duration}
          </p>
        </div>
      )}

    
      <h3 className="text-2xl font-bold mt-10">Course Lessons</h3>
      <ul className="mt-4 space-y-2">
        {course.lessons.map((lesson) => (
          <li
            key={lesson.id}
            onClick={() => setCurrentLesson(lesson)}
            className={`border rounded-lg px-4 py-2 flex justify-between items-center cursor-pointer ${
              completedLessons.includes(lesson.id) ? "bg-green-100" : "bg-white"
            }`}
          >
            <span>
              {lesson.title}{" "}
              {completedLessons.includes(lesson.id) && (
                <span className="text-green-600 font-semibold">✓</span>
              )}
            </span>
            <span className="text-gray-500">{lesson.duration}</span>
          </li>
        ))}
      </ul>

<<<<<<< HEAD
=======
      {/* Quizzes Section */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4">Course Quizzes</h3>
        {quizzes.length > 0 ? (
          <div className="space-y-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800">{quiz.title}</h4>
                    {quiz.description && (
                      <p className="text-gray-600 mt-1">{quiz.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>📝 {quiz.questions.length} questions</span>
                      {quiz.timeLimit && (
                        <span>⏱️ {quiz.timeLimit} minutes</span>
                      )}
                      <span>🎯 {quiz.totalPoints} points</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {quiz.isActive ? (
                      <button
                        onClick={() => navigate(`/quiz/take/${quiz._id}`)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                      >
                        Take Quiz
                      </button>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg font-medium">
                        Not Available
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">📚 No quizzes available for this course yet.</p>
            <p className="text-sm mt-1">Check back later for course assessments.</p>
          </div>
        )}
      </div>

>>>>>>> 41da9a51bd70727d9f697788e63200d361fe5223
    
      <div className="mt-8">
        <h3 className="text-xl font-semibold">
          Progress: {completedLessons.length}/{course.lessons.length} lessons
          completed
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
          <div
            className="bg-purple-600 h-3 rounded-full"
            style={{
              width: `${
                (completedLessons.length / Math.max(1, course.lessons.length)) *
                100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
