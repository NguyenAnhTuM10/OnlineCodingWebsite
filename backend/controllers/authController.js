const db = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const [results] = await db.execute(sql, [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email không tồn tại' });
    }

    const user = results[0];

    // Sửa lại prefix nếu cần
    const fixedHash = user.password_hash.replace('$2y$', '$2a$');
    const isMatch = await bcrypt.compare(password, fixedHash);

    if (!isMatch) {
      return res.status(401).json({ error: 'Mật khẩu không đúng' });
    }

    delete user.password_hash;

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user
    });
  } catch (error) {
    console.error('❌ Lỗi đăng nhập:', error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Thiếu thông tin đăng ký' });
    }

    const checkSql = 'SELECT * FROM users WHERE email = ? LIMIT 1';
    const [results] = await db.execute(checkSql, [email]);

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email đã tồn tại' });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const username = email.split('@')[0];
    const avatar_url = '/images/avatars/default.png';

    const insertSql = `
      INSERT INTO users (username, email, password_hash, full_name, role, avatar_url)
      VALUES (?, ?, ?, ?, 'student', ?)
    `;
    const [result] = await db.execute(insertSql, [
      username,
      email,
      password_hash,
      full_name,
      avatar_url
    ]);

    const user = {
      user_id: result.insertId,
      email,
      full_name,
      role: 'student'
    };

    const token = jwt.sign(user, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

    res.status(201).json({ message: 'Đăng ký thành công', token, user });
  } catch (error) {
    console.error('❌ Lỗi đăng ký:', error);
    res.status(500).json({ error: 'Lỗi server khi tạo tài khoản' });
  }
};

module.exports = {
  login,
  register
};
