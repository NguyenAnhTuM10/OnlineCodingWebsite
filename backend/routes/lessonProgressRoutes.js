const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { 
  updateLessonProgress,
  getLessonProgress,
  getLessonContent,
  getLessonComments,
  addLessonComment ,
  getUserProgress
} = require('../controllers/lessonProgressController');

router.get('/:lesson_id/content', authenticate, getLessonContent);
router.get('/:lesson_id/progress', authenticate, getLessonProgress);
router.put('/:lesson_id/progress', authenticate, updateLessonProgress);
router.get('/:lesson_id/comments', authenticate, getLessonComments);
router.post('/:lesson_id/comments', authenticate, addLessonComment);

router.post('/', authenticate, updateLessonProgress);






module.exports = router;
