
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
import StudentsInCourse from "./pages/instructor/StudentsInCourse";
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
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student" element={<StudentSideBar />} />
              <Route path="/student/notifications" element={<Notifications />} />
              {/* Instructor Dashboard */}
        <Route path="/instructor/dashboard" element={<InstructorDashboard />} />

{/* Students in a specific course */}
<Route path="/instructor/courses/:courseId/students" element={<StudentsInCourse />} />
              <Route path="/instructor/notifications" element={<Notifications />} />
              <Route path="/instructor" element={<InstructorSidebar />} />
              <Route path="/aiAssistant" element={<AiAssistant />} />
               <Route path="/all" element={<Navigate to="/courses" />} />
               <Route path="/quizes" element={<QuizPage />} />


              {/* <Route path="/quiz/:courseId" element={<QuizPage />} /> */}

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
