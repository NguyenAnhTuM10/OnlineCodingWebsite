const express = require('express');
const router = express.Router();
const {authenticate} = require('../middlewares/authMiddleware');
const { enrollCourse,getMyEnrollments,getMyCourses } = require('../controllers/enrollmentsController');

//app.use('/api/enrollments', enrollmentRoutes);
// dùng để đăng ký khóa học
// Bảo vệ bằng JWT
router.post('/', authenticate, enrollCourse); // ddawng ký khóa học
router.get('/my', authenticate, getMyCourses); // 👈 route mới

module.exports = router;
