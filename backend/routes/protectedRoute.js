const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');

router.get('/me', authenticate, (req, res) => {
  res.json({
    message: 'Bạn đã đăng nhập rồi!',
    user: req.user
  });
});

module.exports = router;
