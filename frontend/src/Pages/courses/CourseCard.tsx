
import React from "react";
import { Star } from "lucide-react";
import type { Course } from "./types";

interface Props {
  course: Course;
  onClick: (id: string) => void;
}

const CourseCard: React.FC<Props> = ({ course, onClick }) => {
  return (
    <div
      className="bg-[#f2dfff] rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer flex flex-col h-full"
      onClick={() => onClick(course.id)}
    >
      
      {course.instructor.image && (
        <div className="flex justify-center mb-3">
          <img
            src={course.instructor.image}
            alt={course.instructor.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#AB51E3]"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </div>
      )}
      
    
      <div className="flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-2 text-black line-clamp-2">{course.title}</h3>
        <p className="text-gray-700 mb-3 text-sm line-clamp-3 flex-1">{course.description}</p>

      
        <div className="mb-2">
          <span className="text-sm text-black font-medium">By {course.instructor.name}</span>
        </div>
        
    
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.round(course.rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {course.rating} ({course.reviewsCount})
          </span>
        </div>

      
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs bg-[#AB51E3] text-white rounded-full">
            {course.category}
          </span>
        </div>

        
        <div className="flex flex-wrap gap-1">
          {course.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 text-xs bg-[#310055] text-white rounded-full"
            >
              {skill}
            </span>
          ))}
          {course.skills.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
              +{course.skills.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
