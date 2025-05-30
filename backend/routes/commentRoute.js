const express = require('express');
const router = express.Router();
const {authenticate} = require('../middlewares/authMiddleware');
const {
  getCommentsByLesson,
  addComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');



//app.use('/api/comments', commentsRoutes);



// Lấy tất cả bình luận theo bài học
router.get('/lessons/:lessonId', authenticate, getCommentsByLesson);

// Thêm bình luận mới
router.post('/lessons/:lessonId', authenticate, addComment);

// Cập nhật bình luận
router.put('/:commentId', authenticate, updateComment);
// Xoá bình luận
router.delete('/:commentId', authenticate, deleteComment);
module.exports = router;
