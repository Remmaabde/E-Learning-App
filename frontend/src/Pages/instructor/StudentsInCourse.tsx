import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseStudents } from "../../services/instructorService";

interface Student {
  studentId: string;
  name?: string;
  email?: string; // made optional since backend allows it
  overallPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastUpdated: string; // added missing field from API response
}

interface Course {
  id: string;
  title: string;
}

interface StudentsInCourseData {
  course: Course;
  students: Student[];
}

const StudentsInCourse: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [data, setData] = useState<StudentsInCourseData | null>(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!courseId) return;
    getCourseStudents(courseId)
      .then((res: StudentsInCourseData) => setData(res))
      .catch(e => setErr(e?.response?.data?.error || "Failed to load students"));
  }, [courseId]);

  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Students — {data.course.title}</h1>
      <div className="bg-white rounded-xl shadow divide-y">
        {data.students.map((s) => (
          <div key={s.studentId} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.name || s.email}</div>
              <div className="text-xs text-gray-500">{s.email}</div>
            </div>
            <div className="w-56">
              <div className="text-sm text-right">{s.overallPercent}%</div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 bg-purple-600 rounded-full"
                  style={{ width: `${s.overallPercent}%` }}
                />
              </div>
              <div className="text-xs text-right text-gray-500 mt-1">
                {s.lessonsCompleted}/{s.totalLessons} lessons
              </div>
            </div>
          </div>
        ))}
        {!data.students.length && (
          <div className="p-4 text-sm text-gray-500">No students yet.</div>
        )}
      </div>
    </div>
  );
};

export default StudentsInCourse;
