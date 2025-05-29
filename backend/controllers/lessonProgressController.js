const db = require('../db'); // mysql2 connection pool

// GET: lấy tiến độ học của user
exports.getLessonProgress = async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await db.execute(
      `SELECT * FROM lesson_progress WHERE user_id = ?`, 
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi khi lấy tiến độ:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy tiến độ' });
  }
};

// POST: cập nhật hoặc tạo tiến độ học
exports.updateLessonProgress = async (req, res) => {
  const { user_id, lesson_id, is_completed, last_watched_position } = req.body;

  if (!user_id || !lesson_id) {
    return res.status(400).json({ message: 'Thiếu user_id hoặc lesson_id' });
  }

  try {
    const [result] = await db.execute(
      `
      INSERT INTO lesson_progress (user_id, lesson_id, is_completed, last_watched_position, completed_at)
      VALUES (?, ?, ?, ?, IF(?, NOW(), NULL))
      ON DUPLICATE KEY UPDATE 
        is_completed = VALUES(is_completed),
        last_watched_position = VALUES(last_watched_position),
        completed_at = IF(?, NOW(), NULL)
      `,
      [
        user_id, 
        lesson_id, 
        is_completed || false, 
        last_watched_position || 0,
        is_completed || false,  // cho completed_at
        is_completed || false   // cho ON DUPLICATE
      ]
    );

    res.status(200).json({ message: 'Tiến độ đã được cập nhật' });
  } catch (error) {
    console.error('Lỗi khi cập nhật tiến độ:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật tiến độ' });
  }
};



// controllers/lessonProgressController.js

exports.updateLessonProgress = async (req, res) => {
  const { userId, lessonId, isCompleted, lastWatchedPosition } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO lesson_progress (user_id, lesson_id, is_completed, last_watched_position, completed_at)
       VALUES (?, ?, ?, ?, IF(?, NOW(), NULL))
       ON DUPLICATE KEY UPDATE 
         is_completed = VALUES(is_completed),
         last_watched_position = VALUES(last_watched_position),
         completed_at = IF(VALUES(is_completed), NOW(), NULL);`,
      [userId, lessonId, isCompleted, lastWatchedPosition, isCompleted]
    );

    res.status(200).json({ message: 'Tiến độ đã được cập nhật thành công!' });
  } catch (error) {
    console.error('Lỗi khi cập nhật tiến độ:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật tiến độ' });
  }
};
