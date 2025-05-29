const db = require('../db');


// Get specific lesson content
const getLessonContent = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { userId } = req.user;
    
    // Check if user has access to this lesson
    const accessQuery = `
      SELECT 
        l.lesson_id, l.title, l.content, l.video_url, l.duration, l.is_free,
        c.course_id, c.title as course_title,
        e.enrollment_id,
        lp.is_completed, lp.last_watched_position
      FROM lessons l
      JOIN chapters ch ON l.chapter_id = ch.chapter_id
      JOIN courses c ON ch.course_id = c.course_id
      LEFT JOIN enrollments e ON c.course_id = e.course_id AND e.user_id = ?
      LEFT JOIN lesson_progress lp ON l.lesson_id = lp.lesson_id AND lp.user_id = ?
      WHERE l.lesson_id = ?
    `;
    
    const [lesson] = await db.execute(accessQuery, [userId, userId, lessonId]);
    
    if (!lesson.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lesson not found' 
      });
    }
    
    const lessonData = lesson[0];
    
    // Check access: either enrolled or lesson is free
    if (!lessonData.enrollment_id && !lessonData.is_free) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Enrollment required.' 
      });
    }
    
    res.json({
      success: true,
      data: {
        lesson_id: lessonData.lesson_id,
        title: lessonData.title,
        content: lessonData.content,
        video_url: lessonData.video_url,
        duration: lessonData.duration,
        course_title: lessonData.course_title,
        is_completed: lessonData.is_completed || false,
        last_watched_position: lessonData.last_watched_position || 0
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Update lesson progress
const updateLessonProgress = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { userId } = req.user;
    const { is_completed, last_watched_position } = req.body;
    
    // Verify user has access to this lesson
    const accessQuery = `
      SELECT l.lesson_id, c.course_id
      FROM lessons l
      JOIN chapters ch ON l.chapter_id = ch.chapter_id
      JOIN courses c ON ch.course_id = c.course_id
      JOIN enrollments e ON c.course_id = e.course_id
      WHERE l.lesson_id = ? AND e.user_id = ? AND e.status = 'active'
    `;
    
    const [access] = await db.execute(accessQuery, [lessonId, userId]);
    
    if (!access.length) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    
    // Update or insert lesson progress
    const upsertQuery = `
      INSERT INTO lesson_progress (user_id, lesson_id, is_completed, last_watched_position, completed_at)
      VALUES (?, ?, ?, ?, ${is_completed ? 'NOW()' : 'NULL'})
      ON DUPLICATE KEY UPDATE
        is_completed = VALUES(is_completed),
        last_watched_position = VALUES(last_watched_position),
        completed_at = ${is_completed ? 'NOW()' : 'completed_at'}
    `;
    
    await db.execute(upsertQuery, [userId, lessonId, is_completed, last_watched_position]);
    
    // Update overall course progress
    await updateCourseProgress(userId, access[0].course_id);
    
    res.json({
      success: true,
      message: 'Progress updated successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};


// Get lesson comments
const getLessonComments = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT 
        lc.comment_id, lc.content, lc.created_at,
        u.user_id, u.username, u.full_name, u.avatar_url
      FROM lesson_comments lc
      JOIN users u ON lc.user_id = u.user_id
      WHERE lc.lesson_id = ?
      ORDER BY lc.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const [comments] = await db.execute(query, [lessonId, parseInt(limit), offset]);
    
    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM lesson_comments WHERE lesson_id = ?`;
    const [countResult] = await db.execute(countQuery, [lessonId]);
    
    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: countResult[0].total,
          totalPages: Math.ceil(countResult[0].total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Add lesson comment
const addLessonComment = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { userId } = req.user;
    const { content } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Comment content is required' 
      });
    }
    
    // Verify user has access to this lesson
    const accessQuery = `
      SELECT l.lesson_id
      FROM lessons l
      JOIN chapters ch ON l.chapter_id = ch.chapter_id
      JOIN courses c ON ch.course_id = c.course_id
      LEFT JOIN enrollments e ON c.course_id = e.course_id AND e.user_id = ?
      WHERE l.lesson_id = ? AND (e.enrollment_id IS NOT NULL OR l.is_free = 1)
    `;
    
    const [access] = await db.execute(accessQuery, [userId, lessonId]);
    
    if (!access.length) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied' 
      });
    }
    
    const insertQuery = `
      INSERT INTO lesson_comments (lesson_id, user_id, content, created_at)
      VALUES (?, ?, ?, NOW())
    `;
    
    const [result] = await db.execute(insertQuery, [lessonId, userId, content]);
    
    // Get the created comment with user info
    const getCommentQuery = `
      SELECT 
        lc.comment_id, lc.content, lc.created_at,
        u.user_id, u.username, u.full_name, u.avatar_url
      FROM lesson_comments lc
      JOIN users u ON lc.user_id = u.user_id
      WHERE lc.comment_id = ?
    `;
    
    const [newComment] = await db.execute(getCommentQuery, [result.insertId]);
    
    res.status(201).json({
      success: true,
      data: newComment[0],
      message: 'Comment added successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};




// Helper function to update course progress
const updateCourseProgress = async (userId, courseId) => {
  const progressQuery = `
    SELECT 
      COUNT(*) as total_lessons,
      SUM(CASE WHEN lp.is_completed = 1 THEN 1 ELSE 0 END) as completed_lessons
    FROM lessons l
    JOIN chapters ch ON l.chapter_id = ch.chapter_id
    LEFT JOIN lesson_progress lp ON l.lesson_id = lp.lesson_id AND lp.user_id = ?
    WHERE ch.course_id = ?
  `;
  
  const [progress] = await db.execute(progressQuery, [userId, courseId]);
  const progressPercentage = progress[0].total_lessons > 0 
    ? (progress[0].completed_lessons / progress[0].total_lessons) * 100 
    : 0;
  
  const updateQuery = `
    UPDATE enrollments 
    SET progress = ?, status = CASE WHEN ? >= 100 THEN 'completed' ELSE 'active' END
    WHERE user_id = ? AND course_id = ?
  `;
  
  await db.execute(updateQuery, [progressPercentage, progressPercentage, userId, courseId]);
};

// Tạm thêm hàm giả lập (bạn sửa lại logic thật sau)
const getLessonProgress = async (req, res) => {
  res.json({ success: true, message: 'getLessonProgress chưa được implement' });
};





module.exports = {
  getLessonContent,
  
  getLessonComments,
  addLessonComment,
  getLessonProgress,
  updateCourseProgress,
  updateLessonProgress
  
};