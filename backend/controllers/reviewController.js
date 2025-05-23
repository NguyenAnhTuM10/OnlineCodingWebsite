const db = require('../db');

const submitReview = (req, res) => {
  const userId = req.user.user_id;
  const { course_id, rating, comment } = req.body;

  if (!course_id || !rating) {
    return res.status(400).json({ error: 'Thiếu course_id hoặc rating' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating phải từ 1 đến 5' });
  }

  // Check xem user đã học chưa
  const checkEnrollSql = 'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?';
  db.query(checkEnrollSql, [userId, course_id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi kiểm tra enrollments' });

    if (results.length === 0) {
      return res.status(403).json({ error: 'Bạn chưa học khóa này nên không thể đánh giá' });
    }

    // Check xem đã đánh giá chưa
    const checkReviewSql = 'SELECT * FROM reviews WHERE user_id = ? AND course_id = ?';
    db.query(checkReviewSql, [userId, course_id], (err2, reviewResults) => {
      if (err2) return res.status(500).json({ error: 'Lỗi kiểm tra reviews' });

      if (reviewResults.length > 0) {
        return res.status(400).json({ error: 'Bạn đã đánh giá khóa học này rồi' });
      }

      // Ghi đánh giá mới
      const insertSql = 'INSERT INTO reviews (course_id, user_id, rating, comment) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [course_id, userId, rating, comment || null], (err3) => {
        if (err3) return res.status(500).json({ error: 'Lỗi khi gửi đánh giá' });

        return res.json({ message: 'Đánh giá thành công' });
      });
    });
  });
};


const getReviewsByCourseId = (req, res) => {
  const courseId = req.params.id;

  const sql = `
    SELECT 
      r.review_id,
      r.rating,
      r.comment,
      r.created_at,
      u.full_name AS reviewer_name,
      u.avatar_url
    FROM reviews r
    JOIN users u ON r.user_id = u.user_id
    WHERE r.course_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(sql, [courseId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi lấy reviews:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    res.json(results);
  });
};


module.exports = { submitReview ,getReviewsByCourseId};
