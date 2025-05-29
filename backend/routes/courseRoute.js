// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const {getCourseStructure,getCourseInfo, getAllCourses,getCourseBySlug,getChaptersByCourseId,getLessonsByChapterId,getLessonById,getAllLessonsByCourseId,getCourseEnrollment,getCourseCurriculum } = require('../controllers/courseController');


router.get('/courses/:slug', getAllLessonsByCourseId);
router.get('/courses', getAllCourses);
router.get('/courses/:id/chapters', getChaptersByCourseId);
router.get('/chapters/:id/lessons', getLessonsByChapterId);
router.get('/lessons/:id', getLessonById);
router.get('/courses/:id/all-lessons', getAllLessonsByCourseId);

router.get('/courses/:courseId', getCourseInfo);

// GET /api/courses/:courseId/chapters
router.get('/courses/:courseId/chapters', getCourseStructure);











module.exports = router;
