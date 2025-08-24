import { api } from "../Axios/axios";

export interface NewLesson {
  title: string;
  videoUrl: string;
  duration: string; // we need it for z backend
}
export interface NewCourse {
title: string;
description: string;
  category: string; // we need it for z backend
lessons: NewLesson[];
}

export const getInstructorDashboard = async () => {
const { data } = await api.get("/instructor/dashboard");
return data;
};

export const getInstructorCourses = async () => {
const { data } = await api.get("/instructor/courses");
return data as Array<{
    id: string;
    title: string;
    category: string;
    featured: boolean;  // publish flag
    lessons: number;
    students: number;
    avgProgress: number;
    rating: number;
    reviewsCount: number;
}>;
};

export const togglePublish = async (courseId: string) => {
const { data } = await api.post(`/instructor/courses/${courseId}/publish`);
return data as { id: string; featured: boolean };
};

export const createCourse = async (payload: NewCourse) => {
await api.post("/instructor/courses", payload);
};

export const updateCourse = async (courseId: string, payload: Partial<NewCourse>) => {
const { data } = await api.put(`/instructor/courses/${courseId}`, payload);
return data;
};

export const deleteCourse = async (courseId: string) => {
await api.delete(`/instructor/courses/${courseId}`);
};

export const getCourseStudents = async (courseId: string) => {
const { data } = await api.get(`/instructor/students/${courseId}`);
return data as {
    course: { id: string; title: string };
    students: Array<{
    studentId: string;
    name?: string;
    email?: string;
    overallPercent: number;
    lessonsCompleted: number;
    totalLessons: number;
    lastUpdated: string;
    }>;
};
};
