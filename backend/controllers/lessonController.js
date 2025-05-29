const db = require('../db');

exports.getLessonContent = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const query = `
      SELECT 
        l.lesson_id,
        l.title,
        l.content,
        l.video_url,
        l.duration,
        l.is_free,
        c.chapter_id,
        c.title AS chapter_title
      FROM lessons l
      JOIN chapters c ON l.chapter_id = c.chapter_id
      WHERE l.lesson_id = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(query, [lessonId]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bài học'
      });
    }

    const lesson = rows[0];

    res.json({
      success: true,
      data: {
        lesson_id: lesson.lesson_id,
        title: lesson.title,
        content: lesson.content,
        video_url: lesson.video_url,
        duration: lesson.duration,
        is_free: lesson.is_free,
        chapter: {
          chapter_id: lesson.chapter_id,
          title: lesson.chapter_title
        }
      }
    });

  } catch (error) {
    console.error('❌ Lỗi khi lấy nội dung bài học:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server nội bộ'
    });
  }
};
