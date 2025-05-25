import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import RoadMap from './pages/RoadMap/RoadMap';
import Blog from './pages/Blog/Blog';
import Learning from './pages/Learning/Learning';
import AuthModal from './components/Auth/AuthModal';
import ProfilePage from './pages/Profile/ProfilePage';
import MyCoursesPage from './pages/MyCourses/MyCoursesPage';

import './App.css';

function App() {
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

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

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
    <Router>
      <div className="app">
        <Header 
          openLoginModal={openLoginModal}
          openRegisterModal={openRegisterModal} // Since you use single AuthModal
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
            <Route path="/learning" element={<Learning />} />
            {/* Add these routes for profile functionality */}
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/settings" element={<div>Settings Page - Coming Soon</div>} />
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
    </Router>
  );
}

export default App;