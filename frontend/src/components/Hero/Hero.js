import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Học Lập Trình Miễn Phí
          </h1>
          <p className="hero-description">
            Khóa học lập trình miễn phí, hệ thống bài học được thiết kế theo lộ trình từ cơ bản đến nâng cao,
            phù hợp cho người mới bắt đầu.
          </p>
          <div className="hero-buttons">
            <Link to="/lo-trinh" className="hero-btn primary-btn">
              Xem lộ trình
            </Link>
            <Link to="/khoa-hoc" className="hero-btn secondary-btn">
              Tham gia học
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">168.945+</div>
              <div className="stat-label">Học viên</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">30+</div>
              <div className="stat-label">Khóa học</div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          {/* <img 
            src="./hero.png" 
            alt="F8 Education" 
          /> */}
        </div>
      </div>
    </section>
  );
}

export default Hero;