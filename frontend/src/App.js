import React, { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import LoginModal from './components/Login/LoginModal';
import RegisterModal from './components/Register/RegisterModal';
import RoadMap from './pages/RoadMap/RoadMap';
import Blog from './pages/Blog/Blog';
import Learning  from  './pages/Learning/Learning';    


import './App.css';

function App() {


//==================== Login Modal============================
   const [showLoginModal, setShowLoginModal] = useState(false);

  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };
  
//==================== Login Modal============================




//==================== Login Modal============================
   const [showRegisterModal, setShowRegisterModal] = useState(false);

  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };
  
//==================== Register Modal============================

  
  return (
    <Router>
      <div className="app">
        <Header openLoginModal={openLoginModal} openRegisterModal = {openRegisterModal} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lo-trinh" element={<RoadMap />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/learning" element={<Learning />} />
          </Routes>
        </main>
        <Footer />
          {/* Render the LoginModal when showLoginModal is true */}
      {showLoginModal && <LoginModal onClose={closeLoginModal} />}
        {showRegisterModal && <RegisterModal onClose={closeRegisterModal} />}
      </div>
    </Router>
  );
}

export default App;