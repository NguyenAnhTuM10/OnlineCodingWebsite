import React from 'react';
import './RoadMap.css';

function RoadMap() {
  const roadmaps = [
    {
      id: 1,
      title: "Lộ trình học Front-end",
      description: "Lập trình viên Front-end là người xây dựng ra giao diện websites. Trong phần này F8 sẽ chia sẻ cho bạn lộ trình để trở thành lập trình viên Front-end nhé.",
      image: "https://files.fullstack.edu.vn/f8-prod/learning-paths/2/63b4642136f3e.png"
    },
    {
      id: 2,
      title: "Lộ trình học Back-end",
      description: "Lập trình viên Back-end là người làm việc với dữ liệu, công việc thường nặng tính logic hơn. Chúng ta sẽ cùng tìm hiểu lộ trình học Back-end nhé.",
      image: "https://files.fullstack.edu.vn/f8-prod/learning-paths/3/63b4641535b16.png"
    },
    {
      id: 3,
      title: "Lộ trình học Mobile",
      description: "Lập trình mobile là quá trình phát triển ứng dụng cho thiết bị di động như điện thoại thông minh và máy tính bảng.",
      image: "https://files.fullstack.edu.vn/f8-prod/learning-paths/12/64879a1e4f7bc.png"
    }
  ];

  return (
    <div className="roadmap-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Lộ trình học</h1>
          <p className="page-description">
            Để bắt đầu một cách thuận lợi, bạn nên tập trung vào một lộ trình học.
            Ví dụ: Để đi làm với vị trí "Lập trình viên Front-end" bạn nên tập trung vào lộ trình "Front-end".
          </p>
        </div>

        <div className="roadmap-list">
          {roadmaps.map(roadmap => (
            <div key={roadmap.id} className="roadmap-item">
              <div className="roadmap-content">
                <h2 className="roadmap-title">{roadmap.title}</h2>
                <p className="roadmap-description">{roadmap.description}</p>
                <button className="roadmap-btn">Xem chi tiết</button>
              </div>
              <div className="roadmap-image">
                <img src={roadmap.image} alt={roadmap.title} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RoadMap;