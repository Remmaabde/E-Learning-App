import React, { useState, useEffect } from "react";
import { enrollInCourse, checkEnrollmentStatus } from "../services/studentService";

interface EnrollButtonProps {
  courseId: string;
  courseName: string;
  onEnrollmentChange?: (isEnrolled: boolean) => void;
}

const EnrollButton: React.FC<EnrollButtonProps> = ({ courseId, courseName, onEnrollmentChange }) => {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    checkEnrollment();
  }, [courseId]);

  const checkEnrollment = async () => {
    try {
      setIsCheckingStatus(true);
      const enrolled = await checkEnrollmentStatus(courseId);
      setIsEnrolled(enrolled);
      onEnrollmentChange?.(enrolled);
    } catch (error) {
      console.error("Failed to check enrollment status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Please log in to enroll in courses");
        window.location.href = "/login";
        return;
      }

      console.log("Attempting to enroll in course:", courseId);
      const result = await enrollInCourse(courseId);
      console.log("Enrollment result:", result);
      
      setIsEnrolled(true);
      onEnrollmentChange?.(true);
      alert(`Successfully enrolled in ${courseName}!`);
    } catch (error: any) {
      console.error("Enrollment failed - Full error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      console.error("Error status:", error.response?.status);
      
      if (error.response?.status === 401) {
        alert("Please log in to enroll in courses");
        window.location.href = "/login";
      } else if (error.response?.status === 400 && error.response?.data?.error === "Already enrolled") {
        setIsEnrolled(true);
        onEnrollmentChange?.(true);
        alert("You are already enrolled in this course!");
      } else if (error.response?.status === 404) {
        alert("Course not found. Please try again.");
      } else {
        const errorMessage = error.response?.data?.error || error.message || "Unknown error";
        alert(`Failed to enroll: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="flex items-center justify-center px-8 py-3 bg-gray-200 rounded-full">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#AB51E3]"></div>
        <span className="ml-2 text-gray-600">Checking status...</span>
      </div>
    );
  }

  if (isEnrolled) {
    return (
      <div className="flex items-center px-8 py-3 bg-green-100 text-green-800 rounded-full border border-green-300">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium">Enrolled</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={isLoading}
      className="flex items-center px-8 py-3 bg-[#AB51E3] text-white rounded-full hover:bg-[#310055] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Enrolling...
        </>
      ) : (
        <>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Enroll Now
        </>
      )}
    </button>
  );
};

export default EnrollButton;
