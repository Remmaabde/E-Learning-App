import React, { useEffect, useState } from "react";
import { getInstructorDashboard } from "../../services/instructorService";

interface Summary {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
}

interface AvgProgress {
  courseId: string;
  avgPercent: number;
}

interface TopCourse {
  courseId: string;
}

interface InstructorDashboardData {
  summary: Summary;
  avgProgressByCourse: AvgProgress[];
  topCoursesByStudents: TopCourse[];
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="p-4 rounded-2xl shadow bg-white">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const InstructorDashboard: React.FC = () => {
  const [data, setData] = useState<InstructorDashboardData | null>(null);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    getInstructorDashboard()
      .then((res: InstructorDashboardData) => setData(res))
      .catch(e => setErr(e?.response?.data?.error || "Failed to load dashboard"));
  }, []);

  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!data) return <div className="p-6">Loading…</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Instructor Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Courses" value={data.summary.totalCourses} />
        <StatCard label="Published" value={data.summary.publishedCourses} />
        <StatCard label="Total Students" value={data.summary.totalStudents} />
        <StatCard
          label="Avg Progress (Top Course)"
          value={
            (data.topCoursesByStudents?.[0]?.courseId &&
              data.avgProgressByCourse.find(
                (x) => x.courseId === data.topCoursesByStudents[0].courseId
              )?.avgPercent) ?? 0
          }
        />
      </div>

      <div className="rounded-2xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold mb-3">Average Progress by Course</h2>
        <div className="space-y-3">
          {data.avgProgressByCourse.map((row) => (
            <div key={row.courseId}>
              <div className="flex justify-between text-sm">
                <span>Course {row.courseId.slice(-5)}</span>
                <span>{row.avgPercent}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full">
                <div
                  className="h-3 bg-purple-600 rounded-full"
                  style={{ width: `${row.avgPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
