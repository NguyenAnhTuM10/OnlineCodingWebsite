import React from 'react';
import './Features.css';

function Features() {
  const features = [
    {
      id: 1,
      icon: '📚',
      title: 'Học tập linh hoạt',
      description: 'Học mọi lúc, mọi nơi, trên mọi thiết bị. Bạn có thể học nhiều lần với mỗi bài học để nắm vững kiến thức.'
    },
    {
      id: 2,
      icon: '🎯',
      title: 'Lộ trình rõ ràng',
      description: 'Lộ trình được thiết kế từ cơ bản đến nâng cao, giúp bạn tiến bộ một cách có hệ thống và hiểu sâu từng khái niệm.'
    },
    {
      id: 3,
      icon: '💼',
      title: 'Học lập trình thực tế',
      description: 'Đi từ bài tập nhỏ đến dự án lớn, giúp bạn hiểu sâu và áp dụng được kiến thức vào công việc thực tế.'
    },
    {
      id: 4,
      icon: '👥',
      title: 'Cộng đồng hỗ trợ',
      description: 'Tham gia cộng đồng lớn trên Facebook, hỏi đáp, chia sẻ và học hỏi kinh nghiệm từ những người đi trước.'
    },
    {
      id: 5,
      icon: '🔄',
      title: 'Cập nhật thường xuyên',
      description: 'Nội dung khóa học liên tục được cập nhật theo xu hướng công nghệ mới nhất.'
    },
    {
      id: 6,
      icon: '🎓',
      title: 'Giảng viên nhiệt tình',
      description: 'Giảng viên có nhiều kinh nghiệm thực tế và tận tâm giảng dạy, hỗ trợ học viên.'
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Tại sao chọn F8?</h2>
          <p className="section-description">
            F8 sẽ giúp bạn học lập trình một cách hiệu quả và thực tế nhất
          </p>
        </div>
        
        <div className="features-grid">
          {features.map(feature => (
            <div key={feature.id} className="feature-item">
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;