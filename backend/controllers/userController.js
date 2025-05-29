



const db = require('../db');
const bcrypt = require('bcrypt');

// Lấy thông tin người dùng hiện tại
const getCurrentUser = async (req, res) => {
  try {
    console.log('✅ Vào được controller getCurrentUser');
    const userId = req.user?.user_id;
    if (!userId) {
      console.log('❌ Không có userId trong req.user');
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const sql = `SELECT user_id, username, full_name,email FROM users WHERE user_id = ? LIMIT 1`;

    const [results] = await db.execute(sql, [userId]);
    console.log('✅ Đã thực thi xong query');

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }

    res.json({ success: true, data: results[0] });
  } catch (err) {
    console.error('❌ Lỗi truy vấn:', err);
    return res.status(500).json({ success: false, message: 'Lỗi truy vấn' });
  }
};

// Cập nhật thông tin người dùng
const updateCurrentUser = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { full_name, bio, avatar_url } = req.body;

    const sql = `
      UPDATE users
      SET full_name = ?, bio = ?, avatar_url = ?
      WHERE user_id = ?
    `;

    await db.execute(sql, [full_name, bio, avatar_url, userId]);

    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    console.error('❌ Lỗi cập nhật user:', err);
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật thông tin người dùng' });
  }
};

// Lấy tiến độ học của người dùng trong khóa học
const getUserProgress = async (req, res) => {
  try {
    const { userId, courseId } = req.params;

    const enrollmentQuery = `
      SELECT progress FROM enrollments 
      WHERE user_id = ? AND course_id = ?
    `;

    const [enrollmentRows] = await db.execute(enrollmentQuery, [userId, courseId]);

    if (enrollmentRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Người dùng chưa đăng ký khóa học này' });
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

    const [progressRows] = await db.execute(progressQuery, [userId, courseId]);

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

    const [allLessonsRows] = await db.execute(allLessonsQuery, [courseId]);

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

  } catch (err) {
    console.error('❌ Lỗi truy vấn:', err);
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin tiến độ học tập' });
  }
};

// Cập nhật tiến độ bài học
const updateLessonProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { lesson_id, is_completed, last_watched_position } = req.body;

    const updateProgressQuery = `
      INSERT INTO lesson_progress (user_id, lesson_id, is_completed, last_watched_position, completed_at)
      VALUES (?, ?, ?, ?, ${is_completed ? 'NOW()' : 'NULL'})
      ON DUPLICATE KEY UPDATE
        is_completed = VALUES(is_completed),
        last_watched_position = VALUES(last_watched_position),
        completed_at = CASE WHEN VALUES(is_completed) = 1 THEN NOW() ELSE completed_at END
    `;

    await db.execute(updateProgressQuery, [userId, lesson_id, is_completed, last_watched_position || 0]);

    const getCourseQuery = `
      SELECT c.course_id
      FROM lessons l
      JOIN chapters ch ON l.chapter_id = ch.chapter_id
      JOIN courses c ON ch.course_id = c.course_id
      WHERE l.lesson_id = ?
    `;

    const [courseRows] = await db.execute(getCourseQuery, [lesson_id]);
    if (courseRows.length === 0) {
      return res.status(400).json({ success: false, message: 'Không tìm thấy khóa học tương ứng' });
    }
    const courseId = courseRows[0].course_id;

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

    const [newProgressRows] = await db.execute(
      'SELECT progress FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    res.json({
      success: true,
      data: {
        lesson_id,
        is_completed,
        new_overall_progress: newProgressRows[0].progress
      }
    });

  } catch (error) {
    console.error('❌ Lỗi cập nhật lesson progress:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi cập nhật tiến độ bài học'
    });
  }
};






// Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { current_password, new_password, confirm_password } = req.body;

    // Validate input
    if (!current_password || !new_password || !confirm_password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin' 
      });
    }

    if (new_password !== confirm_password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu mới và xác nhận mật khẩu không khớp' 
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu mới phải có ít nhất 6 ký tự' 
      });
    }

    // Lấy mật khẩu hiện tại từ database
    const getUserQuery = `SELECT password_hash FROM users WHERE user_id = ? LIMIT 1`;
    const [userRows] = await db.execute(getUserQuery, [userId]);

    if (userRows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy người dùng' 
      });
    }

    // Kiểm tra mật khẩu hiện tại
      const isCurrentPasswordValid = await bcrypt.compare(current_password, userRows[0].password_hash);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ 
          success: false, 
          message: 'Mật khẩu hiện tại không đúng' 
        });
      }

      // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
      const isSamePassword = await bcrypt.compare(new_password, userRows[0].password_hash);
      if (isSamePassword) {
        return res.status(400).json({ 
          success: false, 
          message: 'Mật khẩu mới phải khác mật khẩu hiện tại' 
        });
      }


    // Hash mật khẩu mới
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

    // Cập nhật mật khẩu trong database
    const updatePasswordQuery = `
      UPDATE users 
      SET password_hash = ?, updated_at = NOW() 
      WHERE user_id = ?
    `;

    await db.execute(updatePasswordQuery, [hashedNewPassword, userId]);

    console.log(`✅ User ${userId} đã đổi mật khẩu thành công`);

    res.json({ 
      success: true, 
      message: 'Đổi mật khẩu thành công' 
    });

  } catch (err) {
    console.error('❌ Lỗi đổi mật khẩu:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Lỗi máy chủ khi đổi mật khẩu' 
    });
  }
};







module.exports = {
  getCurrentUser,
  updateCurrentUser,
  getUserProgress,
  updateLessonProgress,
  changePassword
};