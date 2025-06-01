const express = require('express');
const router = express.Router();
const {authenticate} = require('../middlewares/authMiddleware');
const { enrollCourse,getMyEnrollments } = require('../controllers/enrollmentsController');

//app.use('/api/enrollments', enrollmentRoutes);
// dùng để đăng ký khóa học
// Bảo vệ bằng JWT
router.post('/', authenticate, enrollCourse); // ddawng ký khóa học
router.get('/my', authenticate, getMyEnrollments); // 👈 route mới

module.exports = router;
