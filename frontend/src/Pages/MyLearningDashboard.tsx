import  { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface EnrolledCourse {
  courseId: string;
  title: string;
  overallPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
}

interface StudentDashboardData {
  enrolledCourses: EnrolledCourse[];
  
}

interface Course {
  id: string;
  title: string;
  // 
}

export default function MyLearningDashboard() {
  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboard();
    loadAllCourses();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get<StudentDashboardData>("/api/student/dashboard");
      setDashboard(res.data);
    } catch {
      alert("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const loadAllCourses = async () => {
    try {
      const res = await axios.get<{ items: Course[] }>("/api/courses/all");
      setAllCourses(res.data.items || []);
    } catch {
      setAllCourses([]);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      setEnrolling(true);
      await axios.post("/api/student/enrollments", { courseId });
      await loadDashboard(); 
      alert("Enrolled successfully!");

      
      navigate("/my-learning");
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.error ?? "Could not enroll. Maybe already enrolled or not logged in."
        : err instanceof Error
        ? err.message
        : "Could not enroll. Maybe already enrolled or not logged in.";
      alert(message);
    } finally {
      setEnrolling(false);
    }
  };

  const enrolled = dashboard?.enrolledCourses.map(c => c.courseId) || [];
  const unenrolledCourses = allCourses.filter(c => !enrolled.includes(c.id));

  return (
    <div className="p-8" style={{ backgroundColor: "#f9ebfb", minHeight: "100vh" }}>
      <h2 className="text-2xl font-semibold mb-2">Good Afternoon, [Student Name]</h2>

      <div className="mb-6 flex items-center gap-2">
        <span className="font-semibold text-lg">Courses you started or finished will be displayed here</span>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div style={{ minWidth: 280 }}>
          <label htmlFor="filter-date" className="block font-semibold mb-2">Date</label>
          <input
            id="filter-date"
            type="date"
            title="Filter by date"
            placeholder="YYYY-MM-DD"
            className="border p-2 rounded mb-4 w-full"
          />
        </div>

        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-2 bg-purple-300 rounded font-bold">In Progress</button>
            <button className="px-4 py-2 bg-purple-200 rounded">Completed</button>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            dashboard?.enrolledCourses.length ? (
              dashboard.enrolledCourses.map(course => (
                <div key={course.courseId} className="mb-3 p-4 rounded-lg bg-purple-100 flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-lg">{course.title}</div>
                    <div className="text-sm">
                      Progress: {course.overallPercent}% ({course.lessonsCompleted} of {course.totalLessons} lessons)
                    </div>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-1 bg-purple-200 text-xs rounded">Course</span>
                  </div>
                </div>
              ))
            ) : (
              <div>No enrolled courses yet.</div>
            )
          )}
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-2">Other Courses</h3>
        {unenrolledCourses.length ? (
          unenrolledCourses.map(course => (
            <div key={course.id} className="mb-3 p-4 rounded-lg bg-gray-100 flex justify-between items-center">
              <div className="font-semibold">{course.title}</div>
              <button
                className="bg-purple-500 text-white rounded px-4 py-1 font-bold disabled:bg-gray-400"
                disabled={enrolling}
                onClick={() => handleEnroll(course.id)}
              >
                Enroll Now
              </button>
            </div>
          ))
        ) : (
          <div>All courses enrolled!</div>
        )}
      </div>
    </div>
  );
}
