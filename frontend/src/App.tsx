// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CourseCatalog from "./Pages/courses/CourseCatalog";
import CourseDetail from "./Pages/courses/CourseDetail";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation could go here if you want */}
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/courses" />} />

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
