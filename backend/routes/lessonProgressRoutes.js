const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const { updateLessonProgress,getLessonProgress } = require('../controllers/lessonProgressController');

router.post('/', authenticate, updateLessonProgress);
router.get('/:lesson_id', authenticate, getLessonProgress);

module.exports = router;
