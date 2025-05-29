const db = require('../db');

const getAllBlogs = async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.post_id,
        b.title,
        b.slug,
        b.featured_image,
        b.view_count,
        b.created_at,
        b.content,
        u.full_name AS author_name
      FROM blog_posts b
      JOIN users u ON b.author_id = u.user_id
      WHERE b.status = 'published'
      ORDER BY b.created_at DESC
    `;

    const [results] = await db.execute(sql);
    res.json(results);
  } catch (err) {
    console.error('❌ Lỗi khi lấy danh sách blog:', err);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

module.exports = { getAllBlogs };
