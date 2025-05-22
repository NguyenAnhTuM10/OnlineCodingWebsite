// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { getAllCourses,getCourseBySlug,getChaptersByCourseId,getLessonsByChapterId,getLessonById,getAllLessonsByCourseId } = require('../controllers/courseController');


router.get('/courses/:slug', getCourseBySlug);
router.get('/courses', getAllCourses);
router.get('/courses/:id/chapters', getChaptersByCourseId);
router.get('/chapters/:id/lessons', getLessonsByChapterId);
router.get('/lessons/:id', getLessonById);
router.get('/courses/:id/all-lessons', getAllLessonsByCourseId);






module.exports = router;
