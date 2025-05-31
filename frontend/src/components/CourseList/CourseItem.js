import React from 'react';
import { Link } from 'react-router-dom';
import './CourseItem.css';

function CourseItem({ course }) {
  return (
    <div className="course-item">
      {/* <Link to={`/learning/${course.id}`} className="course-link"> */}
      <Link to={`/courses/${course.id}/all-lessons`} className="course-link">
        <div className="course-thumbnail">
          <img src={`http://localhost:3000/public${course.image}`} alt={course.title} />
        </div>
        <div className="course-info">
          <h3 className="course-title">{course.title}</h3>
          <p className="course-description">{course.description}</p>
          <div className="course-meta">
            <span className="course-students">
              <i className="students-icon">👥</i>
              {course.students.toLocaleString()}
            </span>
            <span className="course-level">
              <i className="level-icon">🏆</i>
              {course.level}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CourseItem;