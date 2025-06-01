// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function CourseVideoPage() {
//   const { id } = useParams(); // Lấy courseId từ URL
//   const [chapters, setChapters] = useState([]);
//   const [currentLesson, setCurrentLesson] = useState(null);
//   const [loadingLesson, setLoadingLesson] = useState(false);

//   // Fetch tất cả bài học khi component mount
//   useEffect(() => {
   
//     fetch(`http://localhost:3000/api/courses/${id}/all-lessons`)
//       .then((res) => res.json())
//       .then((data) => {
//         setChapters(data);
//         // Tự động load bài đầu tiên
//         const firstLessonId = data?.[0]?.lessons?.[0]?.lesson_id;
//         if (firstLessonId) {
//           loadLesson(firstLessonId);
//         }
//       });
//   }, []);

//   const convertYoutubeToEmbed = (url) => {
//   const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w\-]+)/;
//   const match = url.match(regex);
//   if (match && match[1]) {
//     return `https://www.youtube.com/embed/${match[1]}`;
//   }
//   return url; // fallback nếu không phải link hợp lệ
// };


//   const loadLesson = (lessonId) => {
//     setLoadingLesson(true);
//     fetch(`http://localhost:3000/api/lessons/${lessonId}`)
//       .then((res) => res.json())
//       .then((lesson) => {
//         setCurrentLesson(lesson);
//         setLoadingLesson(false);
//       });
//   };

//   return (
//     <div style={{ display: "flex", minHeight: "100vh" }}>
//       {/* Sidebar */}
//       <aside
//         style={{
//           width: "25%",
//           padding: "20px",
//           borderRight: "1px solid #ddd",
//           overflowY: "auto",
//         }}
//       >
//         <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>
//           Danh sách bài học
//         </h2>
//         {chapters.map((chapter) => (
//           <div key={chapter.chapter_id} style={{ marginBottom: "16px" }}>
//             <h3 style={{ fontWeight: "600" }}>{chapter.title}</h3>
//             <ul style={{ paddingLeft: "10px", marginTop: "8px" }}>
//               {chapter.lessons.map((lesson) => (
//                 <li key={lesson.lesson_id} style={{ marginBottom: "4px" }}>
//                   <button
//                     onClick={() => loadLesson(lesson.lesson_id)}
//                     style={{
//                       width: "100%",
//                       textAlign: "left",
//                       padding: "8px",
//                       border: "none",
//                       backgroundColor:
//                         currentLesson?.lesson_id === lesson.lesson_id ? "#d0ebff" : "#f9f9f9",
//                       fontWeight:
//                         currentLesson?.lesson_id === lesson.lesson_id ? "bold" : "normal",
//                       cursor: "pointer",
//                     }}
//                   >
//                     {lesson.title} {lesson.is_free ? "(Free)" : ""}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </aside>

//      <main style={{ flex: 1, padding: "20px" }}>
//   {loadingLesson || !currentLesson ? (
//     <div>Đang tải bài học...</div>
//   ) : (
//     <div>
//       <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
//         {currentLesson.title}
//       </h1>

//       {currentLesson.video_url.startsWith("http") && currentLesson.video_url.includes("youtu") ? (
//         <iframe
//           src={convertYoutubeToEmbed(currentLesson.video_url)}
//           title="Lesson Video"
//           frameBorder="0"
//           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//           allowFullScreen
//           style={{
//             width: "100%",
//             height: "500px",
//             marginBottom: "16px",
//             borderRadius: "4px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           }}
//         />
//       ) : (
//         <video
//           controls
//           style={{
//             width: "100%",
//             height: "500px",
//             marginBottom: "16px",
//             borderRadius: "4px",
//             boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//           }}
//         >
//           <source
//             src={
//               currentLesson.video_url.startsWith("http")
//                 ? currentLesson.video_url
//                 : `http://localhost:3000/public/${currentLesson.video_url}`
//             }
//             type="video/mp4"
//           />
//           Trình duyệt của bạn không hỗ trợ video.
//         </video>
//       )}

//       <p style={{ fontSize: "16px", color: "#444" }}>{currentLesson.content}</p>
//     </div>
//   )}
// </main>

//     </div>
//   );
// }





import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CourseVideoPage() {
  const { id } = useParams(); // Lấy courseId từ URL
  const [chapters, setChapters] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

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

  // Load comments cho bài học hiện tại
  useEffect(() => {
    if (currentLesson) {
      // Mock comments - thay thế bằng API thực
      setComments([
        {
          id: 1,
          user: "NguyenVanA",
          avatar: "/api/placeholder/40/40",
          content: "Bài học rất hay, giải thích rất dễ hiểu!",
          createdAt: "2 giờ trước",
          likes: 5
        },
        {
          id: 2,
          user: "TranThiB",
          avatar: "/api/placeholder/40/40",
          content: "Mình có thắc mắc về phần này, có thể giải thích thêm không ạ?",
          createdAt: "1 ngày trước",
          likes: 2
        }
      ]);
    }
  }, [currentLesson]);

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
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "25%",
          padding: "20px",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
          backgroundColor: "#f8f9fa"
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>
            Khóa học
          </h2>
          <div style={{ 
            backgroundColor: "#e3f2fd", 
            padding: "10px", 
            borderRadius: "8px",
            marginBottom: "16px"
          }}>
            <div style={{
              width: "100%",
              height: "8px",
              backgroundColor: "#ddd",
              borderRadius: "4px",
              overflow: "hidden"
            }}>
              <div
                style={{
                  width: `${calculateProgress()}%`,
                  height: "100%",
                  backgroundColor: "#4caf50",
                  transition: "width 0.3s ease"
                }}
              />
            </div>
            <span style={{ fontSize: "12px", color: "#666", marginTop: "4px", display: "block" }}>
              {calculateProgress()}% hoàn thành
            </span>
          </div>
        </div>

        <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>
          Danh sách bài học
        </h3>
        {chapters.map((chapter) => (
          <div key={chapter.chapter_id} style={{ marginBottom: "16px" }}>
            <h4 style={{ fontWeight: "600", fontSize: "14px", color: "#333", marginBottom: "8px" }}>
              {chapter.title}
            </h4>
            <ul style={{ paddingLeft: "10px", marginTop: "8px", listStyle: "none" }}>
              {chapter.lessons.map((lesson) => (
                <li key={lesson.lesson_id} style={{ marginBottom: "4px" }}>
                  <button
                    onClick={() => loadLesson(lesson.lesson_id)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      border: "none",
                      backgroundColor:
                        currentLesson?.lesson_id === lesson.lesson_id ? "#2196f3" : "#fff",
                      color: currentLesson?.lesson_id === lesson.lesson_id ? "#fff" : "#333",
                      fontWeight:
                        currentLesson?.lesson_id === lesson.lesson_id ? "bold" : "normal",
                      cursor: "pointer",
                      borderRadius: "4px",
                      fontSize: "13px",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      if (currentLesson?.lesson_id !== lesson.lesson_id) {
                        e.target.style.backgroundColor = "#f0f0f0";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentLesson?.lesson_id !== lesson.lesson_id) {
                        e.target.style.backgroundColor = "#fff";
                      }
                    }}
                  >
                    <span style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      backgroundColor: completedLessons.includes(lesson.lesson_id) ? "#4caf50" : "#ddd",
                      color: "#fff",
                      fontSize: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      {completedLessons.includes(lesson.lesson_id) ? "✓" : ""}
                    </span>
                    <span>{lesson.title}</span>
                    {lesson.is_free && (
                      <span style={{
                        fontSize: "10px",
                        backgroundColor: "#4caf50",
                        color: "#fff",
                        padding: "2px 6px",
                        borderRadius: "10px",
                        marginLeft: "auto"
                      }}>
                        Free
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#fff" }}>
        {loadingLesson || !currentLesson ? (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            height: "400px",
            fontSize: "16px",
            color: "#666"
          }}>
            Đang tải bài học...
          </div>
        ) : (
          <div>
            <h1 style={{ 
              fontSize: "24px", 
              fontWeight: "bold", 
              marginBottom: "16px",
              color: "#333"
            }}>
              {currentLesson.title}
            </h1>

            {/* Video Player */}
            {currentLesson.video_url.startsWith("http") && currentLesson.video_url.includes("youtu") ? (
              <iframe
                src={convertYoutubeToEmbed(currentLesson.video_url)}
                title="Lesson Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  width: "100%",
                  height: "500px",
                  marginBottom: "24px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <video
                controls
                style={{
                  width: "100%",
                  height: "500px",
                  marginBottom: "24px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
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
            <div style={{ marginBottom: "24px" }}>
              <p style={{ 
                fontSize: "16px", 
                color: "#444", 
                lineHeight: "1.6",
                backgroundColor: "#f8f9fa",
                padding: "16px",
                borderRadius: "8px",
                border: "1px solid #e9ecef"
              }}>
                {currentLesson.content}
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              marginBottom: "32px",
              padding: "16px",
              backgroundColor: "#f8f9fa",
              borderRadius: "8px"
            }}>
              <button
                onClick={handleCompleteLesson}
                disabled={completedLessons.includes(currentLesson.lesson_id)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: completedLessons.includes(currentLesson.lesson_id) 
                    ? "#4caf50" : "#2196f3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: completedLessons.includes(currentLesson.lesson_id) 
                    ? "default" : "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s"
                }}
              >
                {completedLessons.includes(currentLesson.lesson_id) 
                  ? "✓ Đã hoàn thành" : "Đánh dấu hoàn thành"}
              </button>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={goToPrevLesson}
                  disabled={currentLessonIndex === 0}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: currentLessonIndex === 0 ? "#ccc" : "#fff",
                    color: currentLessonIndex === 0 ? "#666" : "#333",
                    border: "2px solid #ddd",
                    borderRadius: "6px",
                    cursor: currentLessonIndex === 0 ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s"
                  }}
                >
                  ← Bài trước
                </button>
                <button
                  onClick={goToNextLesson}
                  disabled={currentLessonIndex === allLessons.length - 1}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: currentLessonIndex === allLessons.length - 1 ? "#ccc" : "#2196f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: currentLessonIndex === allLessons.length - 1 ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s"
                  }}
                >
                  Bài tiếp theo →
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div style={{ 
              backgroundColor: "#fff",
              border: "1px solid #e9ecef",
              borderRadius: "8px",
              padding: "20px"
            }}>
              <h3 style={{ 
                fontSize: "18px", 
                fontWeight: "600", 
                marginBottom: "16px",
                color: "#333"
              }}>
                Bình luận ({comments.length})
              </h3>

              {/* Add Comment Form */}
              <div style={{ 
                display: "flex", 
                gap: "12px", 
                marginBottom: "24px",
                padding: "16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px"
              }}>
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    outline: "none"
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddComment();
                    }
                  }}
                />
                <button
                  onClick={handleAddComment}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#2196f3",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Gửi
                </button>
              </div>

              {/* Comments List */}
              <div>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "16px",
                      padding: "16px",
                      backgroundColor: "#fff",
                      border: "1px solid #e9ecef",
                      borderRadius: "8px"
                    }}
                  >
                    <img
                      src={comment.avatar}
                      alt={`${comment.user} avatar`}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "8px", 
                        marginBottom: "8px" 
                      }}>
                        <span style={{ 
                          fontWeight: "600", 
                          fontSize: "14px",
                          color: "#333" 
                        }}>
                          {comment.user}
                        </span>
                        <span style={{ 
                          fontSize: "12px", 
                          color: "#666" 
                        }}>
                          {comment.createdAt}
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: "14px", 
                        color: "#444", 
                        lineHeight: "1.5",
                        marginBottom: "8px" 
                      }}>
                        {comment.content}
                      </p>
                      <div style={{ display: "flex", gap: "12px" }}>
                        <button style={{
                          background: "none",
                          border: "none",
                          color: "#666",
                          cursor: "pointer",
                          fontSize: "12px",
                          padding: "4px 8px"
                        }}>
                          👍 Thích ({comment.likes})
                        </button>
                        <button style={{
                          background: "none",
                          border: "none",
                          color: "#666",
                          cursor: "pointer",
                          fontSize: "12px",
                          padding: "4px 8px"
                        }}>
                          Trả lời
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}