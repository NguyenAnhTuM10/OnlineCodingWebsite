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

// const getCourseBySlug = (req, res) => {

//   const slug = req.params.slug;

//   const sql = `
//     SELECT 
//       c.*, 
//       cat.name AS category_name, 
//       u.full_name AS instructor_name 
//     FROM courses c
//     LEFT JOIN categories cat ON c.category_id = cat.category_id
//     LEFT JOIN users u ON c.instructor_id = u.user_id
//     WHERE c.slug = ?
//     LIMIT 1
//   `;

//   db.query(sql, [slug], (err, results) => {
//     if (err) {
//       console.error('❌ Lỗi truy vấn chi tiết khóa học:', err);
//       return res.status(500).json({ error: 'Lỗi server' });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: 'Không tìm thấy khóa học' });
//     }

//     res.json(results[0]);
//   });
// };








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

















module.exports = {
  getAllCourses,
  
  getChaptersByCourseId,
  getLessonsByChapterId,
  getLessonById,
  getAllLessonsByCourseId,
  
};

