import React, { useEffect, useState } from "react";
import axios from "axios";
import type{ ICourse } from "../../types/course";


const MyCourses: React.FC = () => {
  const [rows, setRows] = useState<ICourse[]>([]);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get<ICourse[]>("/api/courses");
        setRows(res.data);
      } catch {
        setErr("Failed to fetch courses"); // removed unused variable 'error'
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <h2>My Courses</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}
      <ul>
        {rows.map((course) => (
          <li key={course._id}>
            {course.title} - {course.instructor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyCourses;
