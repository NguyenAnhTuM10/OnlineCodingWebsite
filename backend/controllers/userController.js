const db = require('../db');

const getStudentDashboard = (req, res) => {
  const userId = req.user.user_id;

  const sql = `
    SELECT
      c.course_id,
      c.title,
      c.thumbnail_url,
      c.level,
      c.slug,
      e.status,
      COUNT(DISTINCT l.lesson_id) AS total_lessons,
      COUNT(DISTINCT lp.lesson_id) AS completed_lessons
    FROM enrollments e
    JOIN courses c ON e.course_id = c.course_id
    LEFT JOIN chapters ch ON ch.course_id = c.course_id
    LEFT JOIN lessons l ON l.chapter_id = ch.chapter_id
    LEFT JOIN lesson_progress lp ON lp.lesson_id = l.lesson_id AND lp.user_id = ?
    WHERE e.user_id = ?
    GROUP BY c.course_id, c.title, c.thumbnail_url, c.level, c.slug, e.status
    ORDER BY e.enrollment_date DESC
  `;

  db.query(sql, [userId, userId], (err, results) => {
    if (err) {
      console.error('❌ Lỗi truy vấn dashboard:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    const dashboard = results.map(row => {
      const progress = row.total_lessons > 0
        ? Math.round((row.completed_lessons / row.total_lessons) * 100)
        : 0;

      return {
        course_id: row.course_id,
        title: row.title,
        slug: row.slug,
        thumbnail_url: row.thumbnail_url,
        level: row.level,
        status: row.status,
        progress
      };
    });

    res.json(dashboard);
  });
};

module.exports = { getStudentDashboard };
