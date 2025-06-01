const db = require('../db');

// ✅ Đăng ký khóa học
const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { course_id } = req.body;

    if (!course_id) {
      return res.status(400).json({ error: 'Thiếu course_id' });
    }

    const checkSql = 'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?';
    const [existing] = await db.execute(checkSql, [userId, course_id]);

    if (existing.length > 0) {
      return res.status(400).json({ error: 'Bạn đã đăng ký khóa học này rồi' });
    }

    const insertSql = 'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)';
    await db.execute(insertSql, [userId, course_id]);

    res.json({ message: 'Đăng ký học thành công' });
  } catch (err) {
    console.error('❌ Lỗi khi ghi danh khóa học:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

// ✅ Lấy danh sách khóa học đã đăng ký của người dùng
const getMyEnrollments = async (req, res) => {
  try {
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

    const [results] = await db.execute(sql, [userId]);
    res.json(results);
  } catch (err) {
    console.error('❌ Lỗi lấy danh sách khóa học đã học:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};


// controllers/enrollmentController.js

const getMyCourses = async (req, res) => {
  const userId = req.user?.user_id;

  if (!userId) {
    return res.status(400).json({ message: 'Token không chứa user_id' });
  }

  try {
    const [courses] = await db.execute(
      `
      SELECT c.*, 
             e.progress, 
             e.status 
      FROM enrollments e
      JOIN courses c ON c.course_id = e.course_id
      WHERE e.user_id = ?
      `,
      [userId]
    );

    res.status(200).json(courses);
  } catch (error) {
    console.error('Lỗi khi lấy khóa học đã tham gia:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};



module.exports = { enrollCourse, getMyEnrollments,getMyCourses };
