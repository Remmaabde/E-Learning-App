
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import StudentSideBar from "./Pages/StudentSideBar";
import Notifications from "./Pages/Notifications";
import InstructorSidebar from "./Pages/Instructorsidebar";


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
              <Route path="/student" element={<StudentSideBar />} />
              <Route path="/student/notifications" element={<Notifications />} />
              <Route path="/instructor/notifications" element={<Notifications />} />
              <Route path="/instructor" element={<InstructorSidebar />} />
               <Route path="/" element={<Navigate to="/courses" />} />
              <Route path="/quiz/:courseId" element={<QuizPage />} />

              {/* Course catalog page */}
             <Route path="/courses" element={<CourseCatalog />} />

              {/* Course detail page */}
             <Route path="/courses/:id" element={<CourseDetail />} />

            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
