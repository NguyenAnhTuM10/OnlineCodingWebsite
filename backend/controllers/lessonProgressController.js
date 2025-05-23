const db = require('../db');

const updateLessonProgress = (req, res) => {
  const userId = req.user.user_id;
  const { lesson_id, last_watched_position, is_completed } = req.body;

  if (!lesson_id) {
    return res.status(400).json({ error: 'Thiếu lesson_id' });
  }

  const checkSql = 'SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?';
  db.query(checkSql, [userId, lesson_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi kiểm tra tiến độ' });

    const completed = is_completed ? 1 : 0;
    const completedAt = is_completed ? new Date() : null;

    if (results.length > 0) {
      // ✅ Cập nhật
      const updateSql = `
        UPDATE lesson_progress
        SET last_watched_position = ?, is_completed = ?, completed_at = ?
        WHERE user_id = ? AND lesson_id = ?
      `;
      db.query(updateSql, [last_watched_position, completed, completedAt, userId, lesson_id], (err2) => {
        if (err2) return res.status(500).json({ error: 'Lỗi cập nhật tiến độ' });
        res.json({ message: 'Cập nhật tiến độ thành công' });
      });
    } else {
      // ✅ Thêm mới
      const insertSql = `
        INSERT INTO lesson_progress (user_id, lesson_id, last_watched_position, is_completed, completed_at)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.query(insertSql, [userId, lesson_id, last_watched_position || 0, completed, completedAt], (err3) => {
        if (err3) return res.status(500).json({ error: 'Lỗi ghi tiến độ' });
        res.json({ message: 'Lưu tiến độ thành công' });
      });
    }
  });
};



const getLessonProgress = (req, res) => {
  const userId = req.user.user_id;
  const lessonId = req.params.lesson_id;

  const sql = `
    SELECT last_watched_position, is_completed, completed_at
    FROM lesson_progress
    WHERE user_id = ? AND lesson_id = ?
    LIMIT 1
  `;

  db.query(sql, [userId, lessonId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn tiến độ' });

    if (results.length === 0) {
      return res.status(404).json({ error: 'Chưa có tiến độ học cho bài học này' });
    }

    res.json(results[0]);
  });
};


module.exports = { updateLessonProgress,getLessonProgress };
