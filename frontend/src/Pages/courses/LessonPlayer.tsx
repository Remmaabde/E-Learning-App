import React from "react";
import { useParams } from "react-router-dom";

interface LessonPlayerProps {
  lessonId: string;
  courseId: string;
  videoUrl: string;
  title: string;
  notes?: string;
}

const LessonPlayer: React.FC<Omit<LessonPlayerProps, "lessonId">> = ({ courseId, videoUrl, title, notes }) => {
  const { lessonId } = useParams<{ lessonId: string }>(); // get lessonId from route

  if (!lessonId) return <p>Lesson not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p>Course ID: {courseId}</p>
      <p>Lesson ID: {lessonId}</p>
      <iframe
        src={videoUrl}
        className="w-full h-64 my-4"
        title={title}
      ></iframe>
      {notes && <p>{notes}</p>}
    </div>
  );
};

export default LessonPlayer;
