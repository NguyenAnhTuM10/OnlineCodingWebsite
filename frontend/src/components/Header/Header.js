import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header({ openLoginModal, openRegisterModal, isLoggedIn, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    setIsProfileMenuOpen(false);
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
            <li className="nav-item">
              <NavLink to="/blog" className={({isActive}) => isActive ? 'active' : ''}>
                Blog
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Conditional rendering based on login status */}
        {isLoggedIn ? (
          <div className="profile-section">
            <div className="profile-dropdown">
              <button 
                className="profile-button" 
                onClick={toggleProfileMenu}
              >
                <div className="profile-avatar">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt="User Avatar" 
                      className="avatar-image"
                    />
                  ) : (
                    <div className="default-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <span className="profile-name">{user?.name || 'User'}</span>
                <i className={`dropdown-arrow ${isProfileMenuOpen ? 'open' : ''}`}>▼</i>
              </button>
              
              {isProfileMenuOpen && (
                <div className="profile-dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                    <i className="icon">👤</i>
                    Thông tin cá nhân
                  </Link>
                  <Link to="/my-courses" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                    <i className="icon">📚</i>
                    Khóa học của tôi
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                    <i className="icon">⚙️</i>
                    Cài đặt
                  </Link>
                  <hr className="dropdown-divider" />
                  <button 
                    className="dropdown-item logout-item" 
                    onClick={handleLogout}
                  >
                    <i className="icon">🚪</i>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <button onClick={openLoginModal} className="login-btn">Đăng nhập</button>
            <button onClick={openRegisterModal} className="register-btn">Đăng ký</button>
          </div>
        )}

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </header>
  );
}

export default Header;