import React, { useEffect, useState } from "react";
import './AdministrationPage.css';
// Hàm fetch có xác thực
const authFetch = (url, options = {}) => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Bạn chưa đăng nhập với quyền admin");
    window.location.href = "/login"; // hoặc điều hướng đến trang đăng nhập
    throw new Error("Chưa có token");
  }

  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const AdministrationPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [newCourse, setNewCourse] = useState({ title: "", description: "" });
  const [newChapter, setNewChapter] = useState({ title: "" });
  const [newLesson, setNewLesson] = useState({ title: "", content: "" });

  // Kiểm tra đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập với quyền admin.");
      window.location.href = "/login";
    }
  }, []);

  // Lấy danh sách khóa học
  useEffect(() => {
    authFetch("http://localhost:3000/api/admin/courses")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []);
      })
      .catch((err) => console.error("Lỗi fetch courses:", err));
  }, []);

  // Xem chi tiết khóa học
  const viewCourseDetail = (id) => {
    authFetch(`http://localhost:3000/api/admin/courses/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedCourse(data.course);
        setChapters(data.chapters || []);
      })
      .catch((err) => console.error("Lỗi chi tiết course:", err));
  };

  // Tạo khóa học mới
  const handleCreateCourse = () => {
    authFetch("http://localhost:3000/api/admin/courses", {
      method: "POST",
      body: JSON.stringify(newCourse),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Tạo khóa học thành công");
        setCourses([...courses, data.course]);
        setNewCourse({ title: "", description: "" });
      })
      .catch((err) => console.error("Lỗi tạo khóa học:", err));
  };

  // Cập nhật khóa học
  const handleUpdateCourse = () => {
    authFetch(`http://localhost:3000/api/admin/courses/${selectedCourse.course_id}`, {
      method: "PUT",
      body: JSON.stringify(selectedCourse),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Cập nhật khóa học thành công");
      })
      .catch((err) => console.error("Lỗi cập nhật:", err));
  };

  // Xóa khóa học
  const handleDeleteCourse = (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa khóa học này?")) return;
    authFetch(`http://localhost:3000/api/admin/courses/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        alert("Đã xóa khóa học");
        setCourses(courses.filter((c) => c.course_id !== id));
        setSelectedCourse(null);
        setChapters([]);
      })
      .catch((err) => console.error("Lỗi xóa:", err));
  };

  // Thêm chương mới
  const handleAddChapter = () => {
    authFetch(`http://localhost:3000/api/admin/courses/${selectedCourse.course_id}/chapters`, {
      method: "POST",
      body: JSON.stringify(newChapter),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Đã thêm chương");
        setChapters([...chapters, data.chapter]);
        setNewChapter({ title: "" });
      })
      .catch((err) => console.error("Lỗi thêm chương:", err));
  };

  // Thêm bài học mới
  const handleAddLesson = (chapterId) => {
    authFetch(`http://localhost:3000/api/admin/chapters/${chapterId}/lessons`, {
      method: "POST",
      body: JSON.stringify(newLesson),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Đã thêm bài học");
        setNewLesson({ title: "", content: "" });
        viewCourseDetail(selectedCourse.course_id); // Reload chương
      })
      .catch((err) => console.error("Lỗi thêm bài học:", err));
  };

 return (
  <div className="admin-container">
    <h2 className="admin-title">Quản lý khóa học</h2>

    <div className="form-section">
      <h3 className="section-title">Tạo khóa học mới</h3>
      <div className="form-group">
        <input
          className="form-input"
          placeholder="Tên khóa học"
          value={newCourse.title}
          onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
        />
        <input
          className="form-input"
          placeholder="Mô tả"
          value={newCourse.description}
          onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
        />
        <button className="btn btn-primary" onClick={handleCreateCourse}>
          Tạo
        </button>
      </div>
    </div>

    <hr className="divider" />

    <div className="form-section">
      <h3 className="section-title">Danh sách khóa học</h3>
      {courses.length > 0 ? (
        <div className="course-list">
          {courses.map((course) => (
            <div key={course.course_id} className="course-item">
              <h4 className="course-title">{course.title}</h4>
              <div className="course-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => viewCourseDetail(course.course_id)}
                >
                  Xem
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDeleteCourse(course.course_id)}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-text">Chưa có khóa học nào</div>
          <div className="empty-state-subtext">Tạo khóa học đầu tiên để bắt đầu</div>
        </div>
      )}
    </div>

    {selectedCourse && (
      <div className="course-detail fade-in">
        <h3 className="course-detail-title">Chi tiết khóa học: {selectedCourse.title}</h3>
        
        <div className="course-form">
          <input
            className="form-input"
            placeholder="Tên khóa học"
            value={selectedCourse.title}
            onChange={(e) => setSelectedCourse({ ...selectedCourse, title: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="Mô tả khóa học"
            value={selectedCourse.description}
            onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleUpdateCourse}>
            Lưu
          </button>
        </div>

        <div className="chapter-section">
          <h4 className="section-title">Thêm chương</h4>
          <div className="chapter-form">
            <input
              className="form-input"
              placeholder="Tên chương"
              value={newChapter.title}
              onChange={(e) => setNewChapter({ title: e.target.value })}
            />
            <button className="btn btn-primary" onClick={handleAddChapter}>
              Thêm chương
            </button>
          </div>

          <h4 className="section-title">Danh sách chương</h4>
          {chapters.length > 0 ? (
            <div className="chapters-container">
              {chapters.map((chapter) => (
                <div key={chapter.chapter_id} className="chapter-card">
                  <div className="chapter-title">
                    Chương: {chapter.title}
                  </div>

                  <div className="lesson-form">
                    <h5 style={{ marginBottom: '15px', color: '#34495e' }}>Thêm bài học mới</h5>
                    <div className="lesson-form-grid">
                      <input
                        className="form-input"
                        placeholder="Tên bài học"
                        value={newLesson.title}
                        onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                      />
                      <textarea
                        className="form-textarea"
                        placeholder="Nội dung bài học"
                        value={newLesson.content}
                        onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })}
                      />
                      <button 
                        className="btn btn-success" 
                        onClick={() => handleAddLesson(chapter.chapter_id)}
                      >
                        Thêm bài học
                      </button>
                    </div>
                  </div>

                  {chapter.lessons && chapter.lessons.length > 0 ? (
                    <div className="lessons-list">
                      <h6 style={{ marginBottom: '10px', color: '#7f8c8d', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Danh sách bài học
                      </h6>
                      {chapter.lessons.map((lesson) => (
                        <div key={lesson.lesson_id} className="lesson-item">
                          <span className="lesson-title">{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state" style={{ padding: '30px 10px' }}>
                      <div className="empty-state-icon" style={{ fontSize: '2rem' }}>📖</div>
                      <div className="empty-state-text" style={{ fontSize: '1rem' }}>Chưa có bài học nào</div>
                      <div className="empty-state-subtext">Thêm bài học đầu tiên cho chương này</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📑</div>
              <div className="empty-state-text">Chưa có chương nào</div>
              <div className="empty-state-subtext">Thêm chương đầu tiên cho khóa học này</div>
            </div>
          )}
        </div>
      </div>
    )}
  </div>
);
};

export default AdministrationPage;
