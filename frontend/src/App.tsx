// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CourseCatalog from "./Pages/courses/CourseCatalog";
import CourseDetail from "./Pages/courses/CourseDetail";
import QuizPage from "./Pages/Quizzes/QuizPage";
//import StudentDashboard from "./pages/StudentDashboard";
//import InstructorDashboard from "./pages/InstructorDashboard";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation could go here if you want */}
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/courses" />} />
          <Route path="/quiz/:courseId" element={<QuizPage />} />

          {/* Course catalog page */}
          <Route path="/courses" element={<CourseCatalog />} />

          {/* Course detail page */}
          <Route path="/courses/:id" element={<CourseDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
