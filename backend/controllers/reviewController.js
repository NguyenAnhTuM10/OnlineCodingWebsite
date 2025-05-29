const db = require('../db');

// Gửi đánh giá khóa học
const submitReview = (req, res) => {
  const userId = req.user.user_id;
  const { course_id, rating, comment } = req.body;

  if (!course_id || !rating) {
    return res.status(400).json({ success: false, message: 'Thiếu course_id hoặc rating' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating phải từ 1 đến 5' });
  }

  // Kiểm tra đã học khóa học chưa
  const checkEnrollSql = 'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?';
  db.query(checkEnrollSql, [userId, course_id], (err, results) => {
    if (err) {
      console.error('❌ Lỗi kiểm tra enrollments:', err);
      return res.status(500).json({ success: false, message: 'Lỗi kiểm tra ghi danh' });
    }

    if (results.length === 0) {
      return res.status(403).json({ success: false, message: 'Bạn chưa học khóa học này nên không thể đánh giá' });
    }

    // Kiểm tra đã đánh giá chưa
    const checkReviewSql = 'SELECT * FROM reviews WHERE user_id = ? AND course_id = ?';
    db.query(checkReviewSql, [userId, course_id], (err2, reviewResults) => {
      if (err2) {
        console.error('❌ Lỗi kiểm tra reviews:', err2);
        return res.status(500).json({ success: false, message: 'Lỗi kiểm tra đánh giá' });
      }

      if (reviewResults.length > 0) {
        return res.status(400).json({ success: false, message: 'Bạn đã đánh giá khóa học này rồi' });
      }

      // Ghi nhận đánh giá mới
      const insertSql = `
        INSERT INTO reviews (course_id, user_id, rating, comment)
        VALUES (?, ?, ?, ?)
      `;
      db.query(insertSql, [course_id, userId, rating, comment || null], (err3) => {
        if (err3) {
          console.error('❌ Lỗi ghi đánh giá:', err3);
          return res.status(500).json({ success: false, message: 'Lỗi khi gửi đánh giá' });
        }

        return res.json({ success: true, message: 'Đánh giá thành công' });
      });
    });
  });
};

// Lấy tất cả đánh giá của 1 khóa học
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
      console.error('❌ Lỗi khi lấy danh sách đánh giá:', err);
      return res.status(500).json({ success: false, message: 'Lỗi server khi lấy đánh giá' });
    }

    return res.json({
      success: true,
      data: results
    });
  });
};

module.exports = {
  submitReview,
  getReviewsByCourseId
};
