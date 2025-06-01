import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MyCoursesPage.css'; // Nếu cần style riêng

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return setLoading(false);

    fetch('http://localhost:3000/api/enrollments/my', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('📦 Dữ liệu khóa học:', data);
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi fetch courses:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Đang tải khóa học của bạn...</p>;

  if (courses.length === 0) return <p style={{ textAlign: 'center' }}>Bạn chưa tham gia khóa học nào.</p>;

  return (
    <div className="my-courses">
      <h1>Khóa học của tôi</h1>
      <div className="courses-grid">
        {courses.map(course => (
          <Link to={`/courses/${course.slug}`} className="course-item" key={course.course_id}>
            {/* <img src={course.thumbnail_url} alt={course.title} /> */}
            <img src={`http://localhost:3000/public${course.thumbnail_url}`} alt={course.title} />
            <div className="course-info">
              <h3>{course.title}</h3>
              <p>Tiến độ: {course.progress}%</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default MyCourses;
