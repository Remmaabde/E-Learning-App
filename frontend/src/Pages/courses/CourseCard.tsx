
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
      className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center hover:shadow-lg transition cursor-pointer"
      onClick={() => onClick(course.id)}
    >
      
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-2">{course.description}</p>

        
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.round(course.rating)
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500">
            ({course.reviewsCount})
          </span>
        </div>

        
        <div className="flex flex-wrap gap-2">
          {course.skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      
      {course.instructor.image && (
        <img
          src={course.instructor.image}
          alt={course.title}
          className="w-24 h-24 rounded-xl object-cover ml-6"
        />
      )}
    </div>
  );
};

export default CourseCard;
