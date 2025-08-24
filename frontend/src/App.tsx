
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import CourseCatalog from "./Pages/courses/CourseCatalog";
import CourseDetail from "./Pages/courses/CourseDetail";
import QuizPage from "./Pages/Quizzes/QuizPage";
//import StudentDashboard from "./pages/StudentDashboard";
//import InstructorDashboard from "./pages/InstructorDashboard";




import { ThemeProvider } from "./context/ThemeContext";

import LandingPage from "./Pages/landingPage";
import Register from "./Pages/Register";
import LoginPage from "./Pages/loginPage";
import PasswordReset from "./Pages/passwordReset";
import ProfilePage from "./Pages/ProfilePage";
import LessonPlayer from "./Pages/courses/LessonPlayer";
import StudentDashboard from "./Pages/StudentDashboard";
import StudentSideBar from "./Pages/StudentSideBar";
import Notifications from "./Pages/Notifications";
import InstructorSidebar from "./Pages/Instructorsidebar";
import InstructorDashboard from "./Pages/InstructorDashboard";
import InstructorCourses from "./Pages/InstructorCourses";
import CreateCourse from "./Pages/CreateCourse";
import QuizManagement from "./Pages/Instructor/QuizManagement";
import CreateQuiz from "./Pages/Instructor/CreateQuiz";
import InstructorAnalytics from "./Pages/Instructor/InstructorAnalytics";
import ManageLessons from "./Pages/Instructor/ManageLessons";
import ManageCourseQuizzes from "./Pages/Instructor/ManageCourseQuizzes";
import AiAssistant from "./Pages/aiAssistant";
//import MyLearningDashboard from "./Pages/MyLearningDashboard";



function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<PasswordReset />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
  path="/lessons/:lessonId"
  element={<LessonPlayer courseId="dummyCourseId" videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Lesson Title" />}
/>
        <Route path="/quiz/:lessonId" element={<QuizPage />} />
        <Route path="/quiz/take/:quizId" element={<QuizPage />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student" element={<StudentSideBar />} />
              <Route path="/student/notifications" element={<Notifications />} />
              <Route path="/instructor/notifications" element={<Notifications />} />
              <Route path="/instructor" element={<InstructorSidebar />} />
              <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
              <Route path="/instructor/my-courses" element={<InstructorCourses />} />
              <Route path="/instructor/create-course" element={<CreateCourse />} />
              <Route path="/instructor/quizzes" element={<QuizManagement />} />
              <Route path="/instructor/create-quiz" element={<CreateQuiz />} />
              <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
              <Route path="/instructor/students/:courseId" element={<InstructorAnalytics />} />
              <Route path="/instructor/courses/:courseId/lessons" element={<ManageLessons />} />
              <Route path="/instructor/courses/:courseId/quizzes" element={<ManageCourseQuizzes />} />
              <Route path="/aiAssistant" element={<AiAssistant />} />
               <Route path="/all" element={<Navigate to="/courses" />} />
               <Route path="/quizes" element={<QuizPage />} />


             

              <Route path="/courses" element={<CourseCatalog />} />

              <Route path="/courses/:id" element={<CourseDetail />} />

            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
