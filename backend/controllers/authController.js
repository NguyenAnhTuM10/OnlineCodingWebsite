const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';

  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Lỗi server' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email không tồn tại' });
    }

    const user = results[0];
    const fixedHash = user.password_hash.replace('$2y$', '$2a$');
    const isMatch = await bcrypt.compare(password, fixedHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    delete user.password_hash;

    // ✅ Tạo token JWT
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user
    });
  });
};

module.exports = { login };
