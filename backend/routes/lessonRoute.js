// routes/lessons.js
const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

// GET /api/lessons/:lessonId
router.get('/:lessonId', lessonController.getLessonContent);

module.exports = router;