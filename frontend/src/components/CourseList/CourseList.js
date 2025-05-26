

import React, { useEffect, useState } from 'react';
import CourseItem from './CourseItem';
import './CourseList.css';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API thật từ backend
    fetch('http://localhost:3000/api/courses')
      .then(res => res.json())
      .then(data => {
         console.log('✅ Dữ liệu lấy được:', data); // 🧠 log ra đây
        setCourses(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Lỗi khi fetch courses:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Đang tải khóa học...</div>;

  return (
    <section className="course-list">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Khóa học phổ biến</h2>
          <p className="section-description">
            Các khóa học được nhiều học viên tham gia học tập và đánh giá cao
          </p>
        </div>
        
        <div className="courses-grid">
          {courses.map(course => (
            <CourseItem
              key={course.course_id}
              course={{
                id: course.course_id,
                title: course.title,
                description: course.description,
                image: course.thumbnail_url,
                students: 0, // Nếu chưa có field `students`, có thể hardcode tạm
                level: course.level === 'beginner' ? 'Cơ bản' : course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao',
                slug: course.slug // Thêm slug để dùng trong link
              }}
            />
          ))}
        </div>
        
        <div className="view-all">
          <button className="view-all-btn">
            Xem tất cả khóa học
          </button>
        </div>
      </div>
    </section>
  );
}

export default CourseList;
