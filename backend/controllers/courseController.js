// controllers/courseController.js
const db = require('../db');

const getAllCourses = (req, res) => {
  const sql = 'SELECT * FROM courses';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Lỗi khi lấy danh sách khóa học:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }
    res.json(results);
  });
};





const getChaptersByCourseId = (req, res) => {
  const courseId = req.params.id;

  const sql = `
    SELECT 
      chapter_id, 
      course_id, 
      title, 
      position,
      created_at,
      updated_at
    FROM chapters
    WHERE course_id = ?
    ORDER BY position ASC
  `;

  db.query(sql, [courseId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi khi lấy chapters:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    res.json(results);
  });
};

const getLessonsByChapterId = (req, res) => {
  const chapterId = req.params.id;

  const sql = `
    SELECT 
      lesson_id,
      chapter_id,
      title,
      content,
      video_url,
      duration,
      is_free,
      position,
      created_at,
      updated_at
    FROM lessons
    WHERE chapter_id = ?
    ORDER BY position ASC
  `;

  db.query(sql, [chapterId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi khi lấy bài học:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    res.json(results);
  });
};

const getLessonById = (req, res) => {
  const lessonId = req.params.id;

  const sql = `
    SELECT 
      lesson_id,
      chapter_id,
      title,
      content,
      video_url,
      duration,
      is_free,
      position,
      created_at,
      updated_at
    FROM lessons
    WHERE lesson_id = ?
    LIMIT 1
  `;

  db.query(sql, [lessonId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi khi lấy chi tiết bài học:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài học' });
    }

    res.json(results[0]);
  });
};



const getAllLessonsByCourseId = (req, res) => {
  const courseId = req.params.id;

  const sql = `
    SELECT 
      ch.chapter_id, ch.title AS chapter_title, ch.position AS chapter_position,
      ls.lesson_id, ls.title AS lesson_title, ls.video_url, ls.duration, ls.is_free, ls.position AS lesson_position
    FROM chapters ch
    LEFT JOIN lessons ls ON ch.chapter_id = ls.chapter_id
    WHERE ch.course_id = ?
    ORDER BY ch.position ASC, ls.position ASC
  `;

  db.query(sql, [courseId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi khi lấy chapters & lessons:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    // Nhóm dữ liệu thành dạng nested JSON
    const chaptersMap = {};

    results.forEach(row => {
      const chapterId = row.chapter_id;

      if (!chaptersMap[chapterId]) {
        chaptersMap[chapterId] = {
          chapter_id: chapterId,
          title: row.chapter_title,
          position: row.chapter_position,
          lessons: []
        };
      }

      if (row.lesson_id) {
        chaptersMap[chapterId].lessons.push({
          lesson_id: row.lesson_id,
          title: row.lesson_title,
          video_url: row.video_url,
          duration: row.duration,
          is_free: !!row.is_free,
          position: row.lesson_position
        });
      }
    });

    const nestedChapters = Object.values(chaptersMap);
    res.json(nestedChapters);
  });
};





// Get course chapters and lessons with progress
const getCourseCurriculum = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { userId } = req.user;
    
    // Check enrollment first
    const enrollmentQuery = `
      SELECT enrollment_id FROM enrollments 
      WHERE user_id = ? AND course_id = ? AND status = 'active'
    `;
    const [enrollment] = await db.execute(enrollmentQuery, [userId, courseId]);
    
    if (!enrollment.length) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not enrolled in this course' 
      });
    }
    
    const query = `
      SELECT 
        ch.chapter_id, ch.title as chapter_title, ch.position as chapter_position,
        l.lesson_id, l.title as lesson_title, l.duration, l.is_free, 
        l.position as lesson_position, l.video_url,
        lp.is_completed, lp.last_watched_position
      FROM chapters ch
      LEFT JOIN lessons l ON ch.chapter_id = l.chapter_id
      LEFT JOIN lesson_progress lp ON l.lesson_id = lp.lesson_id AND lp.user_id = ?
      WHERE ch.course_id = ?
      ORDER BY ch.position, l.position
    `;
    
    const [results] = await db.execute(query, [userId, courseId]);
    
    // Group lessons by chapters
    const chapters = [];
    const chaptersMap = new Map();
    
    results.forEach(row => {
      if (!chaptersMap.has(row.chapter_id)) {
        chaptersMap.set(row.chapter_id, {
          chapter_id: row.chapter_id,
          title: row.chapter_title,
          position: row.chapter_position,
          lessons: []
        });
        chapters.push(chaptersMap.get(row.chapter_id));
      }
      
      if (row.lesson_id) {
        chaptersMap.get(row.chapter_id).lessons.push({
          lesson_id: row.lesson_id,
          title: row.lesson_title,
          duration: row.duration,
          is_free: row.is_free,
          position: row.lesson_position,
          video_url: row.video_url,
          is_completed: row.is_completed || false,
          last_watched_position: row.last_watched_position || 0
        });
      }
    });
    
    res.json({
      success: true,
      data: chapters
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};


















// Get course structure with chapters and lessons
const getCourseStructure = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const query = `
      SELECT 
        c.chapter_id, c.title as chapter_title, c.position as chapter_position,
        l.lesson_id, l.title as lesson_title, l.duration, l.is_free, l.position as lesson_position
      FROM chapters c
      LEFT JOIN lessons l ON c.chapter_id = l.chapter_id
      WHERE c.course_id = ?
      ORDER BY c.position, l.position
    `;
    
    const [rows] = await db.execute(query, [courseId]);
    
    // Group lessons by chapters
    const chaptersMap = new Map();
    
    rows.forEach(row => {
      if (!chaptersMap.has(row.chapter_id)) {
        chaptersMap.set(row.chapter_id, {
          chapter_id: row.chapter_id,
          title: row.chapter_title,
          position: row.chapter_position,
          lessons: []
        });
      }
      
      if (row.lesson_id) {
        chaptersMap.get(row.chapter_id).lessons.push({
          lesson_id: row.lesson_id,
          title: row.lesson_title,
          duration: row.duration,
          is_free: row.is_free,
          position: row.lesson_position
        });
      }
    });
    
    const chapters = Array.from(chaptersMap.values());
    
    res.json({
      success: true,
      data: chapters
    });
    
  } catch (error) {
    console.error('Error fetching course structure:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get course basic info
const getCourseInfo = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const query = `
      SELECT 
        c.course_id, c.title, c.description, c.thumbnail_url, c.level,
        u.user_id as instructor_id, u.full_name as instructor_name, u.avatar_url as instructor_avatar,
        COUNT(DISTINCT l.lesson_id) as total_lessons,
        SUM(l.duration) as total_duration,
        COUNT(DISTINCT e.user_id) as total_students
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.user_id
      LEFT JOIN chapters ch ON c.course_id = ch.course_id
      LEFT JOIN lessons l ON ch.chapter_id = l.chapter_id
      LEFT JOIN enrollments e ON c.course_id = e.course_id
      WHERE c.course_id = ?
      GROUP BY c.course_id
    `;
    
    const [rows] = await db.execute(query, [courseId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const course = rows[0];
    
    res.json({
      success: true,
      data: {
        course_id: course.course_id,
        title: course.title,
        description: course.description,
        thumbnail_url: course.thumbnail_url,
        level: course.level,
        instructor: {
          user_id: course.instructor_id,
          full_name: course.instructor_name,
          avatar_url: course.instructor_avatar
        },
        stats: {
          total_lessons: course.total_lessons || 0,
          total_duration: course.total_duration || 0,
          total_students: course.total_students || 0
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching course info:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};











module.exports = {
  getAllCourses,
  
  getChaptersByCourseId,
  getLessonsByChapterId,
  getLessonById,
  getAllLessonsByCourseId,
        // 👈 thêm dòng này
  getCourseCurriculum,
  getCourseInfo,
  getCourseStructure


  
};

