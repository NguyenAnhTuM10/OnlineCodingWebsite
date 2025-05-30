// backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware xác thực token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Chưa đăng nhập' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin user
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token không hợp lệ' });
  }
};

// Middleware kiểm tra admin (đã bao gồm authenticate)
const verifyAdmin = [authenticate, (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
}];

// Middleware kiểm tra instructor hoặc admin
const verifyInstructor = [authenticate, (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'instructor')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Instructors only.' });
  }
}];

module.exports = {
  authenticate,
  verifyAdmin,
  verifyInstructor
};