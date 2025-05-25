const db = require('../db');

const getCurrentUser = (req, res) => {
  const userId = req.user.user_id;

  const sql = `
    SELECT user_id, username, full_name, email, avatar_url, bio, role, created_at
    FROM users
    WHERE user_id = ?
    LIMIT 1
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi truy vấn user' });
    if (results.length === 0) return res.status(404).json({ error: 'Không tìm thấy người dùng' });

    res.json(results[0]);
  });
};

const updateCurrentUser = (req, res) => {
  const userId = req.user.user_id;
  const { full_name, bio, avatar_url } = req.body;

  const sql = `
    UPDATE users
    SET full_name = ?, bio = ?, avatar_url = ?
    WHERE user_id = ?
  `;

  db.query(sql, [full_name, bio, avatar_url, userId], (err, result) => {
    if (err) return res.status(500).json({ error: 'Lỗi cập nhật thông tin' });

    res.json({ message: 'Cập nhật thành công' });
  });
};


module.exports = { getCurrentUser,updateCurrentUser };
