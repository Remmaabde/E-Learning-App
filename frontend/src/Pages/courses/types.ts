// frontend/src/Pages/Courses/types.ts

export interface Instructor {
    id: string;
    name: string;
    bio: string;
    image: string;
  }
  
  export interface Lesson {
    id: string;
    title: string;
    duration: string; // e.g. "12m"
    videoUrl: string;
    completed?: boolean;
  }
  
  export interface Quiz {
    id: string;
    lessonId: string;
    questions: Question[];
  }
  
  export interface Question {
    id: string;
    type: "multiple-choice" | "true-false" | "short-answer";
    questionText: string;
    options?: string[];
    correctAnswer?: string;
  }
  
  export interface Course {
    id: string;
    title: string;
    category: string;
    description: string;
    instructor: Instructor;
    lessons: Lesson[];
    rating: number;
    reviewsCount: number;
    skills: string[];
    relatedCourses?: Course[];
}
export interface CourseFilter {
    category?: string;
    search?: string;
    minRating?: number;
    tag?:string;
}
export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}  