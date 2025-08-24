import { api } from "../Axios/axios";

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

export interface Certificate {
  name: string;
  url: string;
  courseId: string;
  issuedAt: string;
}

export interface StudentDashboardData {
  enrolledCourses: EnrolledCourse[];
  recentActivity: RecentActivity[];
  certificates: Certificate[];
}

export const fetchStudentDashboard = async (): Promise<StudentDashboardData> => {
  const res = await api.get("/student/dashboard");
  return res.data;
};

export const fetchStudentActivity = async (): Promise<RecentActivity[]> => {
  const res = await api.get("/student/activity");
  return res.data;
};

export const enrollInCourse = async (courseId: string): Promise<any> => {
  console.log("Making enrollment request for courseId:", courseId);
  try {
    const res = await api.post("/student/enrollments", { courseId });
    console.log("Enrollment response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error("Enrollment API error:", error);
    console.error("Request URL:", error.config?.url);
    console.error("Request data:", error.config?.data);
    throw error;
  }
};

export const checkEnrollmentStatus = async (courseId: string): Promise<boolean> => {
  try {
    const res = await api.get(`/student/enrollments/${courseId}`);
    return res.data.isEnrolled;
  } catch (error) {
    return false;
  }
};

export const completeLesson = async (courseId: string, lessonId: string): Promise<any> => {
  try {
    const res = await api.post("/student/lessons/complete", { courseId, lessonId });
    return res.data;
  } catch (error: any) {
    console.error("Complete lesson error:", error);
    throw error;
  }
};

export const downloadCertificate = async (courseId: string): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/student/certificate/${courseId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to download certificate');
    }

    // Get the certificate HTML
    const certificateHTML = await response.text();
    
    // Create a new window/tab to display the certificate
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(certificateHTML);
      newWindow.document.close();
      
      // Add print functionality after a short delay
      setTimeout(() => {
        newWindow.print();
      }, 1000);
    } else {
      // If popup blocked, download as file
      const blob = new Blob([certificateHTML], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${courseId}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  } catch (error: any) {
    console.error("Certificate download error:", error);
    throw error;
  }
};
