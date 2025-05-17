import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header({openLoginModal,openRegisterModal}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <img 
              src="https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png" 
              alt="F8 Logo" 
              className="logo-image" 
            />
            <span className="logo-text">Học Lập Trình Để Đi Làm</span>
          </Link>
        </div>

        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Tìm kiếm khóa học, bài viết, video, ..." 
            className="search-input" 
          />
          <button className="search-button">
            <i className="search-icon">🔍</i>
          </button>
        </div>

        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>
                Trang chủ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/lo-trinh" className={({isActive}) => isActive ? 'active' : ''}>
                Lộ trình
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink to="/khoa-hoc" className={({isActive}) => isActive ? 'active' : ''}>
                Học
              </NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink to="/blog" className={({isActive}) => isActive ? 'active' : ''}>
                Blog
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="auth-buttons">
          <button onClick={openLoginModal} className="login-btn ">Đăng nhập</button>
          <button onClick={openRegisterModal} className="register-btn">Đăng ký</button>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </header>
  );
}

export default Header;