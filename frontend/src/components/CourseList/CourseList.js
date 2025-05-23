// import React from 'react';
// import CourseItem from './CourseItem';
// import './CourseList.css';

// function CourseList() {
//   // Mock data cho các khóa học
//   const courses = [
//     {
//       id: 1,
//       title: 'HTML CSS từ Zero đến Hero',
//       description: 'Trong khóa này chúng ta sẽ cùng nhau xây dựng giao diện 2 trang web là The Band & Shopee.',
//       image: 'https://files.fullstack.edu.vn/f8-prod/courses/2.png',
//       students: 132490,
//       level: 'Cơ bản'
//     },
//     {
//       id: 2,
//       title: 'Lập Trình JavaScript Cơ Bản',
//       description: 'Học Javascript cơ bản phù hợp cho người chưa từng học lập trình. Với hơn 100 bài học và có bài tập thực hành sau mỗi bài.',
//       image: 'https://files.fullstack.edu.vn/f8-prod/courses/1.png',
//       students: 89534,
//       level: 'Cơ bản'
//     },
//     {
//       id: 3,
//       title: 'Lập Trình JavaScript Nâng Cao',
//       description: 'Hiểu sâu hơn về cách Javascript hoạt động, tìm hiểu về IIFE, closure, hoisting, strict mode, reference types...',
//       image: 'https://files.fullstack.edu.vn/f8-prod/courses/12.png',
//       students: 25322,
//       level: 'Nâng cao'
//     },
//     {
//       id: 4,
//       title: 'ReactJS',
//       description: 'Khóa học ReactJS từ cơ bản tới nâng cao, kết quả của khóa học này là bạn có thể làm hầu hết các dự án thường gặp với ReactJS.',
//       image: 'https://files.fullstack.edu.vn/f8-prod/courses/13/13.png',
//       students: 45334,
//       level: 'Cơ bản'
//     },
//     {
//       id: 5,
//       title: 'Responsive Với Grid System',
//       description: 'Trong khóa này chúng ta sẽ học về cách xây dựng giao diện web responsive với Grid System, tương tự Bootstrap.',
//       image: 'https://files.fullstack.edu.vn/f8-prod/courses/3.png',
//       students: 22563,
//       level: 'Cơ bản'
//     },
//     {
//       id: 6,
//       title: 'Node & ExpressJS',
//       description: 'Học Back-end với Node & ExpressJS framework, hiểu các khái niệm khi làm Back-end và xây dựng RESTful API.',
//       image: 'https://files.fullstack.edu.vn/f8-prod/courses/6.png',
//       students: 19265,
//       level: 'Cơ bản'
//     }
//   ];

//   return (
//     <section className="course-list">
//       <div className="container">
//         <div className="section-header">
//           <h2 className="section-title">Khóa học phổ biến</h2>
//           <p className="section-description">
//             Các khóa học được nhiều học viên tham gia học tập và đánh giá cao
//           </p>
//         </div>
        
//         <div className="courses-grid">
//           {courses.map(course => (
//             <CourseItem key={course.id} course={course} />
//           ))}
//         </div>
        
//         <div className="view-all">
//           <button className="view-all-btn">
//             Xem tất cả khóa học
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default CourseList;










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
                level: course.level === 'beginner' ? 'Cơ bản' : course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'
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
