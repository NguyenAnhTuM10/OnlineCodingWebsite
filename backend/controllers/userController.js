const db = require('../db');

const getCurrentUser = (req, res) => {
  const userId = req.user.user_id;

  const sql = `
    SELECT user_id, username, full_name, email, avatar_url, bio, role, created_at
    FROM users
    WHERE user_id = ?
    LIMIT 1
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn user' });
    if (results.length === 0) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    res.json(results[0]);
  });
};

const updateCurrentUser = (req, res) => {
  const userId = req.user.user_id;
  const { full_name, bio, avatar_url } = req.body;

  const sql = `
    UPDATE users
    SET full_name = ?, bio = ?, avatar_url = ?
    WHERE user_id = ?
  `;

  db.query(sql, [full_name, bio, avatar_url, userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi cập nhật thông tin' });

    res.json({ message: 'Cập nhật thành công' });
  });
};




// controllers/progressController.js
// const getUserProgress = async (req, res) => {
//   try {
//     const { userId, courseId } = req.params;
    
//     // Get overall progress
//     const enrollmentQuery = `
//       SELECT progress FROM enrollments 
//       WHERE user_id = ? AND course_id = ?
//     `;
    
//     const [enrollmentRows] = await db.execute(enrollmentQuery, [userId, courseId]);
    
//     if (enrollmentRows.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: 'User not enrolled in this course'
//       });
//     }
    
//     // Get detailed lesson progress
//     const progressQuery = `
//       SELECT 
//         lp.lesson_id, lp.is_completed, lp.last_watched_position, lp.completed_at
//       FROM lesson_progress lp
//       JOIN lessons l ON lp.lesson_id = l.lesson_id
//       JOIN chapters c ON l.chapter_id = c.chapter_id
//       WHERE lp.user_id = ? AND c.course_id = ?
//       ORDER BY c.position, l.position
//     `;
    
//     const [progressRows] = await db.execute(progressQuery, [userId, courseId]);
    
//     const completedLessons = progressRows
//       .filter(row => row.is_completed)
//       .map(row => row.lesson_id);
    
//     // Find current lesson (first incomplete lesson)
//     const allLessonsQuery = `
//       SELECT l.lesson_id
//       FROM lessons l
//       JOIN chapters c ON l.chapter_id = c.chapter_id
//       WHERE c.course_id = ?
//       ORDER BY c.position, l.position
//     `;
    
//     const [allLessonsRows] = await db.execute(allLessonsQuery, [courseId]);
//     const currentLesson = allLessonsRows.find(lesson => 
//       !completedLessons.includes(lesson.lesson_id)
//     )?.lesson_id || allLessonsRows[0]?.lesson_id;
    
//     res.json({
//       success: true,
//       data: {
//         course_id: parseInt(courseId),
//         overall_progress: enrollmentRows[0].progress,
//         completed_lessons: completedLessons,
//         current_lesson: currentLesson,
//         lesson_progress: progressRows
//       }
//     });
    
//   } catch (error) {
//     console.error('Error fetching user progress:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error'
//     });
//   }
// };


const getUserProgress = (req, res) => {
  const { userId, courseId } = req.params;

  const enrollmentQuery = `
    SELECT progress FROM enrollments 
    WHERE user_id = ? AND course_id = ?
  `;

  db.query(enrollmentQuery, [userId, courseId], (err, enrollmentRows) => {
    if (err) {
      console.error('Query enrollment error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    if (enrollmentRows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not enrolled in this course' });
    }

    const progressQuery = `
      SELECT 
        lp.lesson_id, lp.is_completed, lp.last_watched_position, lp.completed_at
      FROM lesson_progress lp
      JOIN lessons l ON lp.lesson_id = l.lesson_id
      JOIN chapters c ON l.chapter_id = c.chapter_id
      WHERE lp.user_id = ? AND c.course_id = ?
      ORDER BY c.position, l.position
    `;

    db.query(progressQuery, [userId, courseId], (err2, progressRows) => {
      if (err2) {
        console.error('Query progress error:', err2);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }

      const completedLessons = progressRows
        .filter(row => row.is_completed)
        .map(row => row.lesson_id);

      const allLessonsQuery = `
        SELECT l.lesson_id
        FROM lessons l
        JOIN chapters c ON l.chapter_id = c.chapter_id
        WHERE c.course_id = ?
        ORDER BY c.position, l.position
      `;

      db.query(allLessonsQuery, [courseId], (err3, allLessonsRows) => {
        if (err3) {
          console.error('Query allLessons error:', err3);
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }

        const currentLesson = allLessonsRows.find(lesson =>
          !completedLessons.includes(lesson.lesson_id)
        )?.lesson_id || allLessonsRows[0]?.lesson_id;

        res.json({
          success: true,
          data: {
            course_id: parseInt(courseId),
            overall_progress: enrollmentRows[0].progress,
            completed_lessons: completedLessons,
            current_lesson: currentLesson,
            lesson_progress: progressRows
          }
        });
      });
    });
  });
};



const updateLessonProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { lesson_id, is_completed, last_watched_position } = req.body;
    
    // Update lesson progress
    const updateProgressQuery = `
      INSERT INTO lesson_progress (user_id, lesson_id, is_completed, last_watched_position, completed_at)
      VALUES (?, ?, ?, ?, ${is_completed ? 'NOW()' : 'NULL'})
      ON DUPLICATE KEY UPDATE
        is_completed = VALUES(is_completed),
        last_watched_position = VALUES(last_watched_position),
        completed_at = CASE WHEN VALUES(is_completed) = 1 THEN NOW() ELSE completed_at END
    `;
    
    await db.execute(updateProgressQuery, [userId, lesson_id, is_completed, last_watched_position || 0]);
    
    // Get course_id from lesson
    const getCourseQuery = `
      SELECT c.course_id
      FROM lessons l
      JOIN chapters ch ON l.chapter_id = ch.chapter_id
      JOIN courses c ON ch.course_id = c.course_id
      WHERE l.lesson_id = ?
    `;
    
    const [courseRows] = await db.execute(getCourseQuery, [lesson_id]);
    const courseId = courseRows[0].course_id;
    
    // Update overall course progress
    const updateOverallProgressQuery = `
      UPDATE enrollments 
      SET progress = (
        SELECT ROUND((COUNT(CASE WHEN lp.is_completed = 1 THEN 1 END) * 100.0 / COUNT(*)), 2)
        FROM lesson_progress lp
        JOIN lessons l ON lp.lesson_id = l.lesson_id
        JOIN chapters c ON l.chapter_id = c.chapter_id
        WHERE lp.user_id = ? AND c.course_id = ?
      )
      WHERE user_id = ? AND course_id = ?
    `;
    
    await db.execute(updateOverallProgressQuery, [userId, courseId, userId, courseId]);
    
    // Get new progress
    const [newProgressRows] = await db.execute(
      'SELECT progress FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    
    res.json({
      success: true,
      data: {
        lesson_id: lesson_id,
        is_completed: is_completed,
        new_overall_progress: newProgressRows[0].progress
      }
    });
    
  } catch (error) {
    console.error('Error updating lesson progress:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};


module.exports = { getCurrentUser,updateCurrentUser,getUserProgress,updateLessonProgress };
