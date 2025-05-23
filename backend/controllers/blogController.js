const db = require('../db');

const getAllBlogs = (req, res) => {
  const sql = `
  SELECT 
  b.post_id,
  b.title,
  b.slug,
  b.featured_image,
  b.view_count,
  b.created_at,
  b.content, -- 👈 THÊM DÒNG NÀY
  u.full_name AS author_name
FROM blog_posts b
JOIN users u ON b.author_id = u.user_id
WHERE b.status = 'published'
ORDER BY b.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Lỗi khi lấy danh sách blog:', err);
      return res.status(500).json({ error: 'Lỗi server' });
    }

    res.json(results);
  });
};

module.exports = { getAllBlogs };
