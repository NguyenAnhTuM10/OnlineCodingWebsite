const db = require('../db');

// GET: lấy bình luận của 1 bài học
const getCommentsByLesson = async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user?.user_id || 0; // dùng để xác định quyền sửa

  try {
    const [comments] = await db.execute(`
      SELECT 
        c.comment_id, 
        c.content, 
        c.user_id,
        u.full_name AS user_name,
        c.created_at,
        
        c.user_id = ? AS is_owner
      FROM lesson_comments c
      JOIN users u ON c.user_id = u.user_id
      WHERE c.lesson_id = ?
      ORDER BY c.created_at DESC
    `, [userId, lessonId]);

    res.json(comments);
  } catch (err) {
    console.error('❌ Lỗi lấy bình luận:', err);
    res.status(500).json({ message: 'Lỗi server khi lấy bình luận' });
  }
};

// POST: thêm bình luận mới
const addComment = async (req, res) => {
  const userId = req.user.user_id;
  const { lessonId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Nội dung không được để trống' });
  }

  try {
    await db.execute(
      `INSERT INTO lesson_comments (lesson_id, user_id, content) VALUES (?, ?, ?)`,
      [lessonId, userId, content]
    );

    res.json({ message: 'Bình luận đã được thêm' });
  } catch (err) {
    console.error('❌ Lỗi thêm bình luận:', err);
    res.status(500).json({ message: 'Lỗi server khi thêm bình luận' });
  }
};

// PUT: cập nhật bình luận (chỉ cho chủ comment)
const updateComment = async (req, res) => {
  const userId = req.user.user_id;
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const [check] = await db.execute(
      `SELECT * FROM lesson_comments WHERE comment_id = ? AND user_id = ?`,
      [commentId, userId]
    );

    if (check.length === 0) {
      return res.status(403).json({ message: 'Không có quyền sửa bình luận này' });
    }

    await db.execute(
      `UPDATE lesson_comments SET content = ? WHERE comment_id = ?`,
      [content, commentId]
    );

    res.json({ message: 'Bình luận đã được cập nhật' });
  } catch (err) {
    console.error('❌ Lỗi cập nhật bình luận:', err);
    res.status(500).json({ message: 'Lỗi server khi cập nhật bình luận' });
  }
};


// DELETE: Xoá bình luận (chỉ cho chủ comment)
const deleteComment = async (req, res) => {
  const userId = req.user.user_id;
  const { commentId } = req.params;

  try {
    const [check] = await db.execute(
      `SELECT * FROM lesson_comments WHERE comment_id = ? AND user_id = ?`,
      [commentId, userId]
    );

    if (check.length === 0) {
      return res.status(403).json({ message: 'Không có quyền xoá bình luận này' });
    }

    await db.execute(
      `DELETE FROM lesson_comments WHERE comment_id = ?`,
      [commentId]
    );

    res.json({ message: 'Xoá bình luận thành công' });
  } catch (err) {
    console.error('❌ Lỗi xoá bình luận:', err);
    res.status(500).json({ message: 'Lỗi server khi xoá bình luận' });
  }
};


module.exports = {
  getCommentsByLesson,
  addComment,
  updateComment,
    deleteComment
};
