import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CourseItem.css';

function CourseItem({ course }) {
  const handleEnroll = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('🔒 Vui lòng đăng nhập để đăng ký khóa học');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/api/enrollments',
        { course_id: course.id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('✅ Đăng ký khóa học thành công!');
      window.location.reload(); // Có thể thay bằng callback để refetch dữ liệu nếu muốn mượt hơn
    } catch (err) {
      console.error('❌ Lỗi khi đăng ký khóa học:', err);
      alert(err.response?.data?.error || 'Đăng ký thất bại');
    }
  };

  return (
    <div className="course-item">
      <Link to={`/courses/${course.id}/all-lessons`} className="course-link">
        <div className="course-thumbnail">
          <img src={`http://localhost:3000/public${course.image}`} alt={course.title} />
        </div>
        <div className="course-info">
          <h3 className="course-title">{course.title}</h3>
          <p className="course-description">{course.description}</p>
          <div className="course-meta">
            <span className="course-students">
              <i className="students-icon">👥</i>
              {course.students.toLocaleString()}
            </span>
            <span className="course-level">
              <i className="level-icon">🏆</i>
              {course.level}
            </span>
          </div>

          {/* Nút Đăng ký hoặc Đã đăng ký */}
          <div className="course-action">
            {course.isEnrolled ? (
              <button className="enrolled-btn" disabled>Đã đăng ký</button>
            ) : (
              <button className="enroll-btn" onClick={handleEnroll}>Đăng ký học</button>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CourseItem;
