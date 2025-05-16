import React from 'react';
import Hero from '../../components/Hero/Hero';
import CourseList from '../../components/CourseList/CourseList';
import Features from '../../components/Features/Features';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <Hero />
      <CourseList />
      <Features />
    </div>
  );
}

export default Home;