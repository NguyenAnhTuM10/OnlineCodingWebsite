import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import RoadMap from './pages/RoadMap/RoadMap';
import Blog from './pages/Blog/Blog';
import AuthModal from './components/Auth/AuthModal';
import ProfilePage from './pages/Profile/ProfilePage';
import MyCoursesPage from './pages/MyCourses/MyCoursesPage';
import CourseDetailPage from './pages/CourseDetailPage/CourseDetailPage';
import PrivateRoute from './components/PrivateRoute/privateRoute';
import './App.css';
import './index.css'; // Import Tailwind CSS
import SearchPage from './components/SeachPage/SearchPage';
import AdministrationPage from './pages/Admin/AdministrationPage';





// Component con để sử dụng useLocation
function AppContent() {
  const location = useLocation();





  

  // Reset scroll position khi route thay đổi
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Reset scroll position khi page load/refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  
  // Auth Modal (gồm cả Login và Register)
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // User authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');

  const openLoginModal = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  // Check login status on app load
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    };

    checkLoginStatus();
  }, []);

  // Listen for navigation state to open modal
  useEffect(() => {
    if (location.state?.openAuthModal) {
      openLoginModal();
      // Clear the state to prevent modal from reopening on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  // Handle successful login (call this from AuthModal)
  const handleLoginSuccess = (userData, token) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowAuthModal(false);
    
    // Save to localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    
    console.log('Login successful:', userData);
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    console.log('User logged out');
  };

  return (
    <div className="app">

      
    <h1 className="text-4xl font-bold text-red-500">Hello Tailwind!</h1>
      <Header 
        openLoginModal={openLoginModal}
        openRegisterModal={openRegisterModal}
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={handleLogout}
      />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/OnlineCodingWebsite" element={<Home />} />
          <Route path="/lo-trinh" element={<RoadMap />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-courses" element={<MyCoursesPage />} />
          <Route
            path="/courses/:id/all-lessons"
            element={<PrivateRoute element={<CourseDetailPage />} />}
          />
          <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />

          <Route path="/courses" element={<SearchPage />} />
          <Route path="/administration" element={<AdministrationPage />} />
        </Routes>
      </main>
      <Footer />

      {/* Hiển thị Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          onClose={closeAuthModal}
          onLoginSuccess={handleLoginSuccess}
          mode={authMode}
        />
      )}
    </div>
  );
}

// Component chính App
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;