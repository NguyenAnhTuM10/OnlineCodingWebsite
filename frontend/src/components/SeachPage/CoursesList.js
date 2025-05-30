import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const CourseList = () => {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const search = searchParams.get("search") || "";
  const page = searchParams.get("page") || 1;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/courses", {
          params: { search, page, limit: 8 }
        });
        setCourses(res.data.courses);
        console.log("Courses Search:", res.data.courses);
      } catch (err) {
        console.error("Lỗi khi fetch courses:", err);
      }
    };

    fetchCourses();
  }, [search, page]);

  return (
    <div>
      {courses.map(course => (
        <div key={course.course_id}>{course.title}</div>
      ))}
    </div>
  );
};

export default CourseList;
