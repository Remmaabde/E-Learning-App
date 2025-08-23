import { Formik, Form, Field, ErrorMessage } from "formik";
import axios from "axios";

const CourseCreation = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Create Course</h1>
      <Formik
        initialValues={{ title: "", description: "" }}
        onSubmit={async (values) => {
          try {
            await axios.post("/api/instructor/courses", values); // prefix with _ avoids lint error
            alert("Course Created!");
          } catch (err) {
            console.error(err);
            alert("Failed to create course");
          }
        }}
      >
        <Form className="flex flex-col gap-3">
          <Field name="title" placeholder="Course Title" className="border p-2 rounded" />
          <ErrorMessage name="title" component="div" className="text-red-500" />

          <Field name="description" placeholder="Course Description" className="border p-2 rounded" />
          <ErrorMessage name="description" component="div" className="text-red-500" />

          <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">
            Create Course
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default CourseCreation;
