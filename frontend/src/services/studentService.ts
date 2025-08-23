import axios from "axios";

export interface EnrolledCourse {
  courseId: string;
  title: string;
  overallPercent: number;
  lessonsCompleted: number;
  totalLessons: number;
}

export interface RecentActivity {
lessonId: string;
completedAt: string;
}

export interface StudentDashboardData {
  enrolledCourses: EnrolledCourse[];
  recentActivity: RecentActivity[];
  certificates?: { name: string; url: string }[]; // optional
}

export const fetchStudentDashboard = async (): Promise<StudentDashboardData> => {
  const res = await axios.get("/api/student/dashboard");
  return res.data;
};
