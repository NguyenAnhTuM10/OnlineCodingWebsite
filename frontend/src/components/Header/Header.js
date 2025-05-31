import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Header.css';

function Header({ openLoginModal, openRegisterModal, isLoggedIn, user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  
  // ✅ Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    localStorage.removeItem('token');
    setIsProfileMenuOpen(false);
  };

  // ✅ Search API function
  const searchCourses = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`http://localhost:3000/api/courses/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const results = await response.json();
      console.log('🔍 Search results:', results);
      
      setSearchResults(Array.isArray(results) ? results : []);
      setShowSearchDropdown(true);
      
    } catch (error) {
      console.error('❌ Search error:', error);
      setSearchResults([]);
      setShowSearchDropdown(false);
    } finally {
      setIsSearching(false);
    }
  };

  // ✅ Debounced search - tự động search sau 300ms khi user ngừng gõ
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        searchCourses(searchQuery);
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // ✅ Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // ✅ Handle search submit (Enter key or button click)
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to courses page with search query
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setShowSearchDropdown(false);
    }
  };

  // ✅ Handle course click from dropdown
  const handleCourseClick = (course) => {
    navigate(`/courses/${course.course_id}/all-lessons`);
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <Link to="/">
            <img 
              src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png" 
              alt="F8 Logo" 
              className="logo-image" 
            />
            <span className="logo-text">Học Lập Trình Miễn Phí

            </span>
          </Link>
        </div>

        {/* ✅ Enhanced Search Bar */}
        <div className="search-container" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm khóa học, bài viết, video, ..." 
              className="search-input" 
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
            />
            <button type="submit" className="search-button">
              {isSearching ? (
                <i className="search-icon">⏳</i>
              ) : (
                <i className="search-icon">🔍</i>
              )}
            </button>
          </form>

          {/* ✅ Search Dropdown Results */}
          {showSearchDropdown && (
            <div className="search-dropdown">
              {searchResults.length > 0 ? (
                <>
                  <div className="search-header">
                    <span>Khóa học ({searchResults.length})</span>
                  </div>
                  {searchResults.slice(0, 5).map((course) => (
                    <div 
                      key={course.course_id} 
                      className="search-item"
                      onClick={() => handleCourseClick(course)}
                    >
                      <div className="search-item-content">
                        {course.thumbnail_url && (
                          <img 
                            src={`http://localhost:3000/public${course.thumbnail_url}`} 
                            alt={course.title}
                            className="search-item-image"
                          />
                        )}
                        <div className="search-item-info">
                          <h4 className="search-item-title">{course.title}</h4>
                          <p className="search-item-desc">
                            {course.description?.length > 60 
                              ? course.description.substring(0, 60) + '...' 
                              : course.description
                            }
                          </p>
                          <span className="search-item-level">
                            {course.level === 'beginner' ? 'Cơ bản' : 
                             course.level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {searchResults.length > 5 && (
                    <div className="search-footer">
                      <button 
                        onClick={handleSearchSubmit}
                        className="view-all-btn"
                      >
                        Xem tất cả {searchResults.length} kết quả →
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="search-no-results">
                  {isSearching ? (
                    <p>Đang tìm kiếm...</p>
                  ) : (
                    <p>Không tìm thấy kết quả nào cho "{searchQuery}"</p>
                  )}
                </div>
              )}
            </div>
          )}
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

                 {user?.role === 'admin' && (
                  <Link to="/administration" className="dropdown-item" onClick={() => setIsProfileMenuOpen(false)}>
                    <i className="icon">⚙️</i>
                    Quản Lí
                  </Link>
                )}


                 
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