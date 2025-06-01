import React, { useState, useEffect } from 'react';
import Hero from '../../components/Hero/Hero';
import CourseList from '../../components/CourseList/CourseList';
import Features from '../../components/Features/Features';
import './Home.css';

function Home() {
  const [userToken, setUserToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Lấy token và user từ localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setUserToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div className="home-page">
      <Hero />
      <CourseList 
        userToken={userToken}
        isAuthenticated={isAuthenticated}
      />
      <Features />
    </div>
  );
}

export default Home;