const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { getStudentDashboard } = require('../controllers/userController');

router.get('/me/dashboard', authenticate, getStudentDashboard);

module.exports = router;
