// backend/routes/admin/courseAdminRoute.js
const express = require('express');
const router = express.Router();
const courseAdminController = require('../../controllers/admin/courseAdminController');
const { verifyAdmin } = require('../../middlewares/authMiddleware');

// Course management
router.get('/courses', verifyAdmin, courseAdminController.getAllCourses);
router.get('/courses/:id', verifyAdmin, courseAdminController.getCourseDetails);
router.post('/courses', verifyAdmin, courseAdminController.createCourse);
router.put('/courses/:id', verifyAdmin, courseAdminController.updateCourse);
router.delete('/courses/:id', verifyAdmin, courseAdminController.deleteCourse);

// Chapter management
router.post('/courses/:id/chapters', verifyAdmin, courseAdminController.addChapter);

// Lesson management
router.post('/chapters/:id/lessons', verifyAdmin, courseAdminController.addLesson);

module.exports = router;