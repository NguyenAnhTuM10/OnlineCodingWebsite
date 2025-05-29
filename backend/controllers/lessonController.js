// controllers/lessonController.js
exports.getLessonContent = async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    const query = `
      SELECT 
        l.lesson_id, l.title, l.content, l.video_url, l.duration, l.is_free,
        c.chapter_id, c.title as chapter_title
      FROM lessons l
      JOIN chapters c ON l.chapter_id = c.chapter_id
      WHERE l.lesson_id = ?
    `;
    
    const [rows] = await db.execute(query, [lessonId]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
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
    console.error('Error fetching lesson content:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};



