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
//http://localhost:3000/api/comments/lessons/:lessonId
router.get('/lessons/:lessonId', authenticate, getCommentsByLesson);

// Thêm bình luận mới
//http://localhost:3000/api/comments/lessons/:lessonId
router.post('/lessons/:lessonId', authenticate, addComment);

// Cập nhật bình luận
//http://localhost:3000/api/comments/:commentId
router.put('/:commentId', authenticate, updateComment);
// Xoá bình luận
//http://localhost:3000/api/comments/:commentId
router.delete('/:commentId', authenticate, deleteComment);
module.exports = router;
