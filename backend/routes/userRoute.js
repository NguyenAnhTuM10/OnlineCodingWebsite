const express = require('express');
const router = express.Router();
const { getCurrentUser,updateCurrentUser } = require('../controllers/userController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/me', authenticate, getCurrentUser); // 👈
router.put('/me', authenticate, updateCurrentUser);


module.exports = router;
