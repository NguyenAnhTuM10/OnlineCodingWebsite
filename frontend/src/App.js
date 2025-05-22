import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import RoadMap from './pages/RoadMap/RoadMap';
import Blog from './pages/Blog/Blog';
import Learning from './pages/Learning/Learning';
import AuthModal from './components/Auth/AuthModal';

import './App.css';

function App() {
  // Auth Modal (gồm cả Login và Register)
  const [showAuthModal, setShowAuthModal] = useState(false);

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <Router>
      <div className="app">
        <Header openLoginModal={openAuthModal} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
             <Route path="/OnlineCodingWebsite" element={<Home />} />
            <Route path="/lo-trinh" element={<RoadMap />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/learning" element={<Learning />} />
          </Routes>
        </main>
        <Footer />

        {/* Hiển thị Auth Modal */}
        {showAuthModal && <AuthModal onClose={closeAuthModal} />}
      </div>
    </Router>
  );
}

export default App;
