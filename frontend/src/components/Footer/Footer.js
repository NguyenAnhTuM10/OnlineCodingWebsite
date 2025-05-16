import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-column">
          <div className="footer-logo">
            <img 
              src="https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png" 
              alt="F8 Logo" 
            />
            <span>Học Lập Trình Để Đi Làm</span>
          </div>
          <p className="footer-description">
            Điện thoại: 0246.329.1102
            <br />
            Email: contact@fullstack.edu.vn
            <br />
            Địa chỉ: Số 26 Dương Đình Nghệ, Phường Yên Hòa, Quận Cầu Giấy, TP. Hà Nội
          </p>
        </div>
        
        <div className="footer-column">
          <h3 className="footer-heading">Về F8</h3>
          <ul className="footer-links">
            <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
            <li><Link to="/lien-he">Liên hệ</Link></li>
            <li><Link to="/dieu-khoan">Điều khoản</Link></li>
            <li><Link to="/bao-mat">Bảo mật</Link></li>
            <li><Link to="/faq">Cơ hội việc làm</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3 className="footer-heading">Sản phẩm</h3>
          <ul className="footer-links">
            <li><Link to="/game">Game Nester</Link></li>
            <li><Link to="/game-css">Game CSS Diner</Link></li>
            <li><Link to="/game-flex">Game Flexbox Froggy</Link></li>
            <li><Link to="/tiktok">Tiktok Clone</Link></li>
            <li><Link to="/music-player">Music Player</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3 className="footer-heading">Công cụ</h3>
          <ul className="footer-links">
            <li><Link to="/tools/css-generator">CSS Generator</Link></li>
            <li><Link to="/tools/rgb-to-hex">RGB to HEX</Link></li>
            <li><Link to="/tools/can-i-use">Kiểm tra tương thích</Link></li>
            <li><Link to="/tools/lorem-ipsum">Tạo văn bản giả</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <h3 className="footer-heading">Công ty cổ phần công nghệ giáo dục F8</h3>
          <p>Mã số thuế: 0109922901</p>
          <p>Ngày thành lập: 04/03/2022</p>
          <div className="footer-social">
            <a href="https://www.facebook.com/f8vnofficial" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="social-icon">📱</i>
            </a>
            <a href="https://www.youtube.com/c/F8VNOfficial" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="social-icon">🎬</i>
            </a>
            <a href="https://www.tiktok.com/@f8official" target="_blank" rel="noopener noreferrer" className="social-link">
              <i className="social-icon">🎵</i>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <p>© 2018 - 2025 F8. Nền tảng học lập trình hàng đầu Việt Nam</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;