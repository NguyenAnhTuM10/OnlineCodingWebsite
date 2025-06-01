import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CourseVideoPage() {
  const { id } = useParams(); // Lấy courseId từ URL
  const [chapters, setChapters] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false);

  // Fetch tất cả bài học khi component mount
  useEffect(() => {
   
    fetch(`http://localhost:3000/api/courses/${id}/all-lessons`)
      .then((res) => res.json())
      .then((data) => {
        setChapters(data);
        // Tự động load bài đầu tiên
        const firstLessonId = data?.[0]?.lessons?.[0]?.lesson_id;
        if (firstLessonId) {
          loadLesson(firstLessonId);
        }
      });
  }, []);

  const convertYoutubeToEmbed = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }
  return url; // fallback nếu không phải link hợp lệ
};


  const loadLesson = (lessonId) => {
    setLoadingLesson(true);
    fetch(`http://localhost:3000/api/lessons/${lessonId}`)
      .then((res) => res.json())
      .then((lesson) => {
        setCurrentLesson(lesson);
        setLoadingLesson(false);
      });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "25%",
          padding: "20px",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
          Danh sách bài học
        </h2>
        {chapters.map((chapter) => (
          <div key={chapter.chapter_id} style={{ marginBottom: "16px" }}>
            <h3 style={{ fontWeight: "600" }}>{chapter.title}</h3>
            <ul style={{ paddingLeft: "10px", marginTop: "8px" }}>
              {chapter.lessons.map((lesson) => (
                <li key={lesson.lesson_id} style={{ marginBottom: "4px" }}>
                  <button
                    onClick={() => loadLesson(lesson.lesson_id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px",
                      border: "none",
                      backgroundColor:
                        currentLesson?.lesson_id === lesson.lesson_id ? "#d0ebff" : "#f9f9f9",
                      fontWeight:
                        currentLesson?.lesson_id === lesson.lesson_id ? "bold" : "normal",
                      cursor: "pointer",
                    }}
                  >
                    {lesson.title} {lesson.is_free ? "(Free)" : ""}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "20px" }}>
        {loadingLesson || !currentLesson ? (
          <div>Đang tải bài học...</div>
        ) : (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
              {currentLesson.title}
            </h1>
            <iframe
  src={
    currentLesson.video_url.startsWith("http")
      ? currentLesson.video_url.includes("youtu")
        ? convertYoutubeToEmbed(currentLesson.video_url)
        : currentLesson.video_url
      : `http://localhost:3000/public/${currentLesson.video_url}`
  }
          title="Lesson Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            width: "100%",
            height: "500px",
            marginBottom: "16px",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        />

            <p style={{ fontSize: "16px", color: "#444" }}>{currentLesson.content}</p>
          </div>
        )}
      </main>
    </div>
  );
}
