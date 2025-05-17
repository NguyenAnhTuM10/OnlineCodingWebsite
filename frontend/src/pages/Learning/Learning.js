import React, { useState } from 'react';
import './Learning.css'; // Import CSS styles for the learning page

function Learning() {
  // State for current lesson, progress, and content
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  
  // Mock data for the course lessons
  const lessons = [
    {
      id: 1,
      title: 'Giới thiệu HTML-CSS',
      duration: '14:35',
      isCompleted: true
    },
    {
      id: 2,
      title: 'Cài đặt môi trường',
      duration: '10:20',
      isCompleted: false
    },
    {
      id: 3,
      title: 'Cấu trúc HTML cơ bản',
      duration: '08:45',
      isCompleted: false
    },
    {
      id: 4,
      title: 'Thuộc tính trong HTML',
      duration: '12:30',
      isCompleted: false
    },
    {
      id: 5,
      title: 'CSS cơ bản',
      duration: '15:40',
      isCompleted: false
    },
    {
      id: 6,
      title: 'Box model trong CSS',
      duration: '11:55',
      isCompleted: false
    },
    {
      id: 7,
      title: 'Flexbox layout',
      duration: '13:25',
      isCompleted: false
    },
    {
      id: 8,
      title: 'CSS Grid layout',
      duration: '09:15',
      isCompleted: false
    }
  ];

  // Function to handle step completion
  const handleCompleteStep = (stepId) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  // Calculate progress percentage
  const progressPercentage = (completedSteps.length === 0) 
    ? 0 
    : Math.round((completedSteps.length / lessons.length) * 100);

  // Function to handle click on lesson
  const handleLessonClick = (lessonId) => {
    setCurrentStep(lessonId);
  };

  // Mock content for the current lesson
  const lessonContent = {
    title: lessons[currentStep - 1]?.title || 'Loading...',
    video: 'https://www.youtube.com/watch?v=MsBEu1iWsF4&list=RDMsBEu1iWsF4&start_radio=1',
    
    content: `
      <h2>Nội dung bài học: ${lessons[currentStep - 1]?.title || ''}</h2>
      <p>Đây là phần nội dung chi tiết của bài học. Trong phần này sẽ bao gồm các kiến thức cơ bản và ví dụ minh họa để giúp bạn hiểu rõ hơn về chủ đề.</p>
      <div class="example-code">
        <pre><code>
          // Ví dụ code
          &lt;div class="container"&gt;
            &lt;h1&gt;Tiêu đề&lt;/h1&gt;
            &lt;p&gt;Đoạn văn bản&lt;/p&gt;
          &lt;/div&gt;
        </code></pre>
      </div>
      <p>Sau khi học xong bài này, bạn có thể làm bài tập để củng cố kiến thức.</p>
    `,
    comments: [
      { 
        id: 1, 
        user: 'NguyenVanA', 
        avatar: '/img/avatar1.jpg', 
        content: 'Bài học rất dễ hiểu, cảm ơn thầy!', 
        createdAt: '2 giờ trước' 
      },
      { 
        id: 2, 
        user: 'TranThiB', 
        avatar: '/img/avatar2.jpg', 
        content: 'Mình có thắc mắc về phần flexbox, làm sao để căn giữa một phần tử con?', 
        createdAt: '1 ngày trước' 
      }
    ]
  };

  return (
    <div className="learning-page">
      {/* Sidebar for course progress and lessons */}
      <div className="learning-sidebar">
        <div className="course-info">
          <h2>HTML-CSS từ Zero đến Hero</h2>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="progress-text">{progressPercentage}% hoàn thành</span>
          </div>
        </div>

        <div className="lessons-list">
          <h3>Danh sách bài học</h3>
          <ul>
            {lessons.map(lesson => (
              <li 
                key={lesson.id}
                className={`lesson-item ${currentStep === lesson.id ? 'active' : ''} ${completedSteps.includes(lesson.id) ? 'completed' : ''}`}
                onClick={() => handleLessonClick(lesson.id)}
              >
                <div className="lesson-status">
                  {completedSteps.includes(lesson.id) ? (
                    <span className="status-icon completed">✓</span>
                  ) : (
                    <span className="status-icon">●</span>
                  )}
                </div>
                <div className="lesson-info">
                  <span className="lesson-title">{lesson.title}</span>
                  <span className="lesson-duration">{lesson.duration}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main content area */}
      <div className="learning-content">
        <div className="video-container">
          <div className="video-player">
            <iframe 
              width="100%" 
              height="360" 
              src="https://www.youtube.com/embed/MsBEu1iWsF4" 
              title="YouTube video player" 
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

  {/* <div className="video-controls">
    <button className="control-button">◀◀</button>
    <button className="control-button">◀</button>
    <button className="control-button play">▶</button>
    <button className="control-button">▶</button>
    <button className="control-button">▶▶</button>
    <div className="video-progress">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: '30%' }}></div>
      </div>
      <span className="time-display">04:22 / 14:35</span>
    </div>
    <button className="control-button">🔊</button>
    <button className="control-button">⚙️</button>
    <button className="control-button">⤢</button>
  </div> */}
</div>


        <div className="lesson-details">
          <h1>{lessonContent.title}</h1>
          <div className="lesson-content" dangerouslySetInnerHTML={{ __html: lessonContent.content }}></div>
          
          <div className="lesson-actions">
            <button 
              className="complete-button"
              onClick={() => handleCompleteStep(currentStep)}
              disabled={completedSteps.includes(currentStep)}
            >
              {completedSteps.includes(currentStep) ? 'Đã hoàn thành' : 'Đánh dấu đã hoàn thành'}
            </button>
            <div className="navigation-buttons">
              <button 
                className="prev-button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Bài trước
              </button>
              <button 
                className="next-button"
                disabled={currentStep === lessons.length}
                onClick={() => setCurrentStep(currentStep + 1)}
              >
                Bài tiếp theo
              </button>
            </div>
          </div>
          
          <div className="comments-section">
            <h3>Bình luận ({lessonContent.comments.length})</h3>
            <div className="comment-form">
              <input type="text" placeholder="Viết bình luận của bạn..." />
              <button>Gửi</button>
            </div>
            <div className="comments-list">
              {lessonContent.comments.map(comment => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    <img src="/api/placeholder/40/40" alt={`${comment.user} avatar`} />
                  </div>
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-user">{comment.user}</span>
                      <span className="comment-time">{comment.createdAt}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-actions">
                      <button>Thích</button>
                      <button>Trả lời</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right sidebar for additional resources */}
      {/* <div className="resources-sidebar">
        <div className="resources-container">
          <h3>Tài liệu bổ sung</h3>
          <ul className="resources-list">
            <li className="resource-item">
              <span className="resource-icon">📄</span>
              <span className="resource-title">Slide bài giảng</span>
            </li>
            <li className="resource-item">
              <span className="resource-icon">📝</span>
              <span className="resource-title">Bài tập thực hành</span>
            </li>
            <li className="resource-item">
              <span className="resource-icon">📚</span>
              <span className="resource-title">Tài liệu tham khảo</span>
            </li>
            <li className="resource-item">
              <span className="resource-icon">🔗</span>
              <span className="resource-title">Liên kết hữu ích</span>
            </li>
          </ul>
        </div>

        <div className="next-lessons">
          <h3>Bài học tiếp theo</h3>
          <div className="next-lesson-preview">
            {currentStep < lessons.length ? (
              <>
                <h4>{lessons[currentStep]?.title}</h4>
                <p>Thời lượng: {lessons[currentStep]?.duration}</p>
                <button 
                  className="preview-button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                >
                  Xem ngay
                </button>
              </>
            ) : (
              <p>Bạn đã hoàn thành tất cả các bài học!</p>
            )}
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Learning;