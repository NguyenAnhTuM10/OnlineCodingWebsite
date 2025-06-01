const express = require('express');
const router = express.Router();
const lessonProgressController = require('../controllers/lessonProgressController');



//app.use('/api/lesson-progress', lessonProgressRoutes);
router.post('/update', lessonProgressController.updateLessonProgress);  // Route update tiến độ

// Lấy tiến độ của 1 user
router.get('/:user_id', lessonProgressController.getLessonProgress);

// Cập nhật hoặc tạo mới tiến độ
router.post('/', lessonProgressController.updateLessonProgress);

module.exports = router;
