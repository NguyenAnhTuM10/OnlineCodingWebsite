const db = require('../db');
// dùng để đăng ký khóa học
const enrollCourse = (req, res) => {
  const userId = req.user.user_id;
  const { course_id } = req.body;

  console.log('📩 userId:', userId);
  console.log('📦 course_id:', course_id);

  if (!course_id) {
    return res.status(400).json({ error: 'Thiếu course_id' });
  }

  const checkSql = 'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?';
  db.query(checkSql, [userId, course_id], (err, results) => {
    if (err) {
      console.error('❌ Lỗi check:', err);
      return res.status(500).json({ error: 'Lỗi kiểm tra DB' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Bạn đã đăng ký khóa học này rồi' });
    }

    const insertSql = 'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)';
    db.query(insertSql, [userId, course_id], (err2) => {
      if (err2) {
        console.error('❌ Lỗi insert:', err2);
        return res.status(500).json({ error: 'Lỗi khi ghi danh' });
      }

      return res.json({ message: 'Đăng ký học thành công' });
    });
  });
};


const getMyEnrollments = (req, res) => {
  const userId = req.user.user_id;

  const sql = `
    SELECT 
      e.enrollment_id,
      e.progress,
      e.status,
      c.course_id,
      c.title,
      c.slug,
      c.thumbnail_url,
      c.level,
      c.price,
      c.discount_price,
      u.full_name AS instructor_name,
      cat.name AS category_name
    FROM enrollments e
    JOIN courses c ON e.course_id = c.course_id
    LEFT JOIN users u ON c.instructor_id = u.user_id
    LEFT JOIN categories cat ON c.category_id = cat.category_id
    WHERE e.user_id = ?
    ORDER BY e.enrollment_date DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi lấy danh sách khóa học đã học:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    res.json(results);
  });
};


module.exports = { enrollCourse,getMyEnrollments };
