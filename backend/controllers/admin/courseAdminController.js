// backend/controllers/admin/courseAdminController.js
const db = require('../../db');

exports.createCourse = async (req, res) => {
  try {
    const { title, slug, description, thumbnail_url, category_id, price, discount_price, level } = req.body;
    
    // Validation
    if (!title || !slug || !level) {
      return res.status(400).json({ error: 'Thiếu thông tin bắt buộc' });
    }

    const [result] = await db.execute(
      `INSERT INTO courses (title, slug, description, thumbnail_url, category_id, instructor_id, price, discount_price, level, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [title, slug, description, thumbnail_url, category_id, req.user.user_id, price || 0, discount_price, level]
    );

    res.status(201).json({ 
      message: 'Tạo khóa học thành công', 
      course_id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, slug, description, thumbnail_url, category_id, price, discount_price, level, status } = req.body;

    const [result] = await db.execute(
      `UPDATE courses 
       SET title = ?, slug = ?, description = ?, thumbnail_url = ?, category_id = ?, price = ?, discount_price = ?, level = ?, status = ?
       WHERE course_id = ?`,
      [title, slug, description, thumbnail_url, category_id, price, discount_price, level, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khóa học' });
    }

    res.json({ message: 'Cập nhật khóa học thành công' });
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug đã tồn tại' });
    }
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute('DELETE FROM courses WHERE course_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khóa học' });
    }

    res.json({ message: 'Xóa khóa học thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.addChapter = async (req, res) => {
  try {
    const { id } = req.params; // course_id
    const { title, position } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Thiếu tiêu đề chương' });
    }

    // Kiểm tra course tồn tại
    const [course] = await db.execute('SELECT course_id FROM courses WHERE course_id = ?', [id]);
    if (course.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khóa học' });
    }

    // Tự động tính position nếu không có
    let chapterPosition = position;
    if (!chapterPosition) {
      const [maxPos] = await db.execute('SELECT MAX(position) as max_pos FROM chapters WHERE course_id = ?', [id]);
      chapterPosition = (maxPos[0].max_pos || 0) + 1;
    }

    const [result] = await db.execute(
      'INSERT INTO chapters (course_id, title, position) VALUES (?, ?, ?)',
      [id, title, chapterPosition]
    );

    res.status(201).json({ 
      message: 'Thêm chương thành công', 
      chapter_id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.addLesson = async (req, res) => {
  try {
    const { id } = req.params; // chapter_id
    const { title, content, video_url, duration, is_free, position } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Thiếu tiêu đề bài học' });
    }

    // Kiểm tra chương có tồn tại không
    const [chapter] = await db.execute('SELECT chapter_id FROM chapters WHERE chapter_id = ?', [id]);
    if (chapter.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy chương' });
    }

    // Tính toán vị trí nếu không truyền vào
    let lessonPosition = position;
    if (!lessonPosition) {
      const [maxPos] = await db.execute('SELECT MAX(position) as max_pos FROM lessons WHERE chapter_id = ?', [id]);
      lessonPosition = (maxPos[0].max_pos || 0) + 1;
    }

    // Chuyển đổi duration sang số giây nếu cần
    function timeToSeconds(str) {
      if (typeof str === 'string' && str.includes(':')) {
        const [min, sec] = str.split(':').map(Number);
        return min * 60 + sec;
      }
      return Number(str); // Nếu đã là số thì dùng luôn
    }

    const durationInSeconds = duration ? timeToSeconds(duration) : null;

    // Thêm bài học
    const [result] = await db.execute(
      `INSERT INTO lessons 
       (chapter_id, title, content, video_url, duration, is_free, position) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, title, content, video_url, durationInSeconds, is_free || false, lessonPosition]
    );

    res.status(201).json({
      message: 'Thêm bài học thành công',
      lesson_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server', message: error.message });
  }
};


// Thêm các function hữu ích khác
exports.getAllCourses = async (req, res) => {
  try {
    const [courses] = await db.execute(`
      SELECT c.*, cat.name as category_name, u.full_name as instructor_name 
      FROM courses c 
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN users u ON c.instructor_id = u.user_id
      ORDER BY c.created_at DESC
    `);

    res.json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin course
    const [course] = await db.execute(`
      SELECT c.*, cat.name as category_name, u.full_name as instructor_name 
      FROM courses c 
      LEFT JOIN categories cat ON c.category_id = cat.category_id
      LEFT JOIN users u ON c.instructor_id = u.user_id
      WHERE c.course_id = ?
    `, [id]);

    if (course.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy khóa học' });
    }

    // Lấy chapters và lessons
    const [chapters] = await db.execute(`
      SELECT ch.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'lesson_id', l.lesson_id,
                 'title', l.title,
                 'content', l.content,
                 'video_url', l.video_url,
                 'duration', l.duration,
                 'is_free', l.is_free,
                 'position', l.position
               )
             ) as lessons
      FROM chapters ch
      LEFT JOIN lessons l ON ch.chapter_id = l.chapter_id
      WHERE ch.course_id = ?
      GROUP BY ch.chapter_id
      ORDER BY ch.position
    `, [id]);

    res.json({ 
      course: course[0], 
      chapters: chapters 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};