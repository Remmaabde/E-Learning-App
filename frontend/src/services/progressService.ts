import axios from "axios";

export const updateLessonProgress = async ({
  courseId,
  lessonId,
  completed,
  secondsWatched
}: {
  courseId: string;
  lessonId: string;
  completed?: boolean;
  secondsWatched?: number;
}) => {
  const res = await axios.post("/api/progress/lesson", { courseId, lessonId, completed, secondsWatched });
  return res.data;
};

export const getCourseProgress = async (courseId: string) => {
  const res = await axios.get(`/api/progress/course/${courseId}`);
  return res.data;
};
