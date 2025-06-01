import React, { useEffect, useState, useRef } from 'react';
import CourseItem from './CourseItem';
import './CourseList.css';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const sectionRef = useRef(null);

  const fetchCourses = async (enrolledIds) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/api/courses?page=${page}&limit=8`);
      if (!res.ok) throw new Error(`Lỗi khi tải khóa học: ${res.status}`);

      const data = await res.json();
      const courseList = Array.isArray(data.courses) ? data.courses : [];

      const enrichedCourses = courseList.map(course => ({
        id: course.course_id,
        title: course.title,
        description: course.description,
        image: course.thumbnail_url,
        students: 0,
        level:
          course.level === 'beginner'
            ? 'Cơ bản'
            : course.level === 'intermediate'
            ? 'Trung cấp'
            : 'Nâng cao',
        slug: course.slug,
        isEnrolled: enrolledIds.includes(course.course_id),
      }));

      setCourses(enrichedCourses);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || page);
    } catch (err) {
      console.error('❌ Lỗi khi fetch courses:', err);
      setError(err.message);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        await fetchCourses([]); // Chưa đăng nhập
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/api/enrollments/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const ids = data.map(e => e.course_id);
        setEnrolledCourseIds(ids);
        await fetchCourses(ids); // Gọi sau khi có danh sách enrolled
      } catch (err) {
        console.error('❌ Lỗi khi fetch enrollments:', err);
        await fetchCourses([]); // Vẫn fetch courses nếu lỗi
      }
    };

    load();
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, page + 2);

      if (page <= 3) endPage = 5;
      else if (page >= totalPages - 2) startPage = totalPages - 4;

      for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (loading) return <div className="loading">Đang tải khóa học...</div>;

  if (error) {
    return (
      <section className="course-list" ref={sectionRef}>
        <div className="container">
          <div className="error-state" style={{ textAlign: 'center', padding: '2rem' }}>
            <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>❌ Có lỗi xảy ra</h3>
            <p style={{ marginBottom: '1rem' }}>{error}</p>
            <button
              onClick={() => fetchCourses(enrolledCourseIds)}
              style={{
                backgroundColor: '#3498db',
                color: 'white',
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="course-list" ref={sectionRef}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Khóa học phổ biến</h2>
          <p className="section-description">
            Các khóa học được nhiều học viên tham gia học tập và đánh giá cao
          </p>
        </div>

        <div className="courses-grid">
          {courses && courses.length > 0 ? (
            courses.map(course => (
              <CourseItem key={course.id} course={course} />
            ))
          ) : (
            <div
              className="no-courses"
              style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '2rem',
                color: '#666'
              }}
            >
              Không có khóa học nào để hiển thị
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn prev-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
            >
              <span>←</span> Trước
            </button>

            <div className="page-numbers">
              {page > 3 && totalPages > 5 && (
                <>
                  <button className="page-number" onClick={() => handlePageChange(1)}>
                    1
                  </button>
                  <span className="ellipsis">...</span>
                </>
              )}

              {getPageNumbers().map(pageNum => (
                <button
                  key={pageNum}
                  className={`page-number ${page === pageNum ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              {page < totalPages - 2 && totalPages > 5 && (
                <>
                  <span className="ellipsis">...</span>
                  <button className="page-number" onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              className="pagination-btn next-btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Tiếp <span>→</span>
            </button>
          </div>
        )}

        <div
          style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontSize: '0.8rem',
            color: '#999'
          }}
        >
          Trang {page}/{totalPages} | Hiển thị {courses.length} khóa học
        </div>
      </div>
    </section>
  );
}

export default CourseList;
