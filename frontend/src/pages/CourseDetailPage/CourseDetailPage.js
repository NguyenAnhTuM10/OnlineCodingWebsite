

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Comments from "../../components/Comments/Comments";
import "./CourseDetailPage.css";

export default function CourseVideoPage() {
  const { id } = useParams(); // Lấy courseId từ URL
  const [chapters, setChapters] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [newComment, setNewComment] = useState("");
const [comments, setComments] = useState([]);


  // Tạo danh sách phẳng tất cả bài học để dễ navigation
  const [allLessons, setAllLessons] = useState([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // Fetch tất cả bài học khi component mount
  useEffect(() => {
    fetch(`http://localhost:3000/api/courses/${id}/all-lessons`)
      .then((res) => res.json())
      .then((data) => {
        setChapters(data);
        
        // Tạo danh sách phẳng các bài học
        const flatLessons = [];
        data.forEach(chapter => {
          chapter.lessons.forEach(lesson => {
            flatLessons.push({
              ...lesson,
              chapterTitle: chapter.title
            });
          });
        });
        setAllLessons(flatLessons);
        
        // Tự động load bài đầu tiên
        if (flatLessons.length > 0) {
          loadLesson(flatLessons[0].lesson_id);
          setCurrentLessonIndex(0);
        }
      });
  }, [id]);

  const convertYoutubeToEmbed = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/;
    const match = url.match(regex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return url;
  };

  const loadLesson = (lessonId) => {
    setLoadingLesson(true);
    fetch(`http://localhost:3000/api/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((lesson) => {
        setCurrentLesson(lesson);
        setLoadingLesson(false);
        
        // Update current lesson index
        const index = allLessons.findIndex(l => l.lesson_id === lessonId);
        if (index !== -1) {
          setCurrentLessonIndex(index);
        }
        
        // Scroll to top
        window.scrollTo(0, 0);
      });
  };

  const handleCompleteLesson = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.lesson_id)) {
      setCompletedLessons([...completedLessons, currentLesson.lesson_id]);
      // TODO: Gửi API để lưu trạng thái hoàn thành
    }
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < allLessons.length - 1) {
      const nextLesson = allLessons[currentLessonIndex + 1];
      loadLesson(nextLesson.lesson_id);
    }
  };

  const goToPrevLesson = () => {
    if (currentLessonIndex > 0) {
      const prevLesson = allLessons[currentLessonIndex - 1];
      loadLesson(prevLesson.lesson_id);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        user: "Bạn", // Thay bằng user thực
        avatar: "/api/placeholder/40/40",
        content: newComment,
        createdAt: "Vừa xong",
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment("");
      // TODO: Gửi API để lưu comment
    }
  };

  const calculateProgress = () => {
    if (allLessons.length === 0) return 0;
    return Math.round((completedLessons.length / allLessons.length) * 100);
  };

  return (
    <div className="course-video-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="course-header">
          <h2 className="course-title">Khóa học</h2>
          <div className="progress-container">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
            <span className="progress-text">
              {calculateProgress()}% hoàn thành
            </span>
          </div>
        </div>

        <h3 className="lessons-title">Danh sách bài học</h3>
        {chapters.map((chapter) => (
          <div key={chapter.chapter_id} className="chapter">
            <h4 className="chapter-title">{chapter.title}</h4>
            <ul className="lessons-list">
              {chapter.lessons.map((lesson) => (
                <li key={lesson.lesson_id} className="lesson-item">
                  <button
                    onClick={() => loadLesson(lesson.lesson_id)}
                    className={`lesson-button ${
                      currentLesson?.lesson_id === lesson.lesson_id ? 'active' : ''
                    }`}
                  >
                    <span className={`lesson-status ${
                      completedLessons.includes(lesson.lesson_id) ? 'completed' : ''
                    }`}>
                      {completedLessons.includes(lesson.lesson_id) ? "✓" : ""}
                    </span>
                    <span>{lesson.title}</span>
                    {lesson.is_free && (
                      <span className="free-badge">Free</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {loadingLesson || !currentLesson ? (
          <div className="loading-container">
            Đang tải bài học...
          </div>
        ) : (
          <div>
            <h1 className="lesson-title">{currentLesson.title}</h1>

            {/* Video Player */}
            {currentLesson.video_url.startsWith("http") && currentLesson.video_url.includes("youtu") ? (
              <iframe
                src={convertYoutubeToEmbed(currentLesson.video_url)}
                title="Lesson Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-player"
              />
            ) : (
              <video controls className="video-player">
                <source
                  src={
                    currentLesson.video_url.startsWith("http")
                      ? currentLesson.video_url
                      : `http://localhost:3000/public/${currentLesson.video_url}`
                  }
                  type="video/mp4"
                />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            )}

            {/* Lesson Content */}
            <div className="lesson-content">
              <p className="content-text">{currentLesson.content}</p>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button
                onClick={handleCompleteLesson}
                disabled={completedLessons.includes(currentLesson.lesson_id)}
                className={`complete-btn ${
                  completedLessons.includes(currentLesson.lesson_id) ? 'completed' : ''
                }`}
              >
                {completedLessons.includes(currentLesson.lesson_id) 
                  ? "✓ Đã hoàn thành" : "Đánh dấu hoàn thành"}
              </button>

              <div className="navigation-buttons">
                <button
                  onClick={goToPrevLesson}
                  disabled={currentLessonIndex === 0}
                  className="nav-btn prev"
                >
                  ← Bài trước
                </button>
                <button
                  onClick={goToNextLesson}
                  disabled={currentLessonIndex === allLessons.length - 1}
                  className="nav-btn next"
                >
                  Bài tiếp theo →
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <Comments
              lessonId={currentLesson.lesson_id}
              currentUser={null} // Thay bằng user thật từ context/auth
            />
          </div>
        )}
      </main>
    </div>
  );
}