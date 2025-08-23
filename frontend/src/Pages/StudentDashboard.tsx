import React, { useEffect, useState } from "react";
import { fetchStudentDashboard } from "../services/studentService";
import type {StudentDashboardData} from "../services/studentService";
const StudentDashboard: React.FC = () => {
  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const data = await fetchStudentDashboard();
        setDashboard(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return <p className="p-6">Loading dashboard…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!dashboard) return <p className="p-6">No dashboard data</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
        {dashboard.enrolledCourses.map((c) => (
          <div key={c.courseId} className="mb-4 p-4 bg-white rounded-lg shadow">
            <p className="font-bold">{c.title}</p>
            <p>
              Progress: {c.lessonsCompleted}/{c.totalLessons} lessons completed (
              {c.overallPercent}%)
            </p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        {dashboard.recentActivity.map((a) => (
          <div key={a.lessonId} className="mb-2 p-2 bg-white rounded shadow">
            Lesson {a.lessonId} completed at {new Date(a.completedAt).toLocaleString()}
          </div>
        ))}
      </section>
    </div>
  );
};

export default StudentDashboard;
