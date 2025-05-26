import React, { useEffect, useState } from 'react';

const CourseDetailPage = () => {
  const [courseData, setCourseData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/courses/2/all-lessons')
      .then((res) => res.json())
      .then((data) => {
        console.log('Dữ liệu khóa học:', data);
        setCourseData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi khi lấy dữ liệu khóa học:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Đang tải dữ liệu khóa học...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Chi tiết khóa học</h1>
      {courseData
        .sort((a, b) => a.position - b.position)
        .map((chapter) => (
          <div key={chapter.chapter_id} className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-3">
              Chương {chapter.position}: {chapter.title}
            </h2>
            <ul className="space-y-2">
              {chapter.lessons
                .sort((a, b) => a.position - b.position)
                .map((lesson) => (
                  <li
                    key={lesson.lesson_id}
                    className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-medium">
                          Bài {lesson.position}: {lesson.title}
                        </p>
                        <p className="text-sm text-gray-600">
                          Thời lượng: {Math.floor(lesson.duration / 60)} phút {lesson.duration % 60} giây
                        </p>
                        <p className={`text-sm ${lesson.is_free ? 'text-green-600' : 'text-red-600'}`}>
                          {lesson.is_free ? 'Miễn phí' : 'Yêu cầu trả phí'}
                        </p>
                      </div>
                      <a
                        href={lesson.video_url}
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Xem video
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
    </div>
  );
};

export default CourseDetailPage;
