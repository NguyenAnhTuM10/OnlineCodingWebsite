// backend/controllers/admin/courseAdminController.js
const db = require('../../db');

exports.createCourse = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      thumbnail_url,
      category_id,
      price,
      discount_price,
      level
    } = req.body;

    // Kiểm tra bắt buộc
    if (!title || !level) {
      return res.status(400).json({ error: 'Thiếu title hoặc level' });
    }

    // Hàm tự tạo slug nếu không có
    function generateSlug(text) {
      return text
        .toString()
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
    }

    const safeSlug = slug || generateSlug(title);
    const safeDescription = description || null;
    const safeThumbnail = thumbnail_url || null;
    const safeCategoryId = category_id || null;
    const safePrice = price !== undefined ? price : 0;
    const safeDiscountPrice = discount_price !== undefined ? discount_price : null;
    const safeLevel = level;

    const [result] = await db.execute(
      `INSERT INTO courses (title, slug, description, thumbnail_url, category_id, instructor_id, price, discount_price, level, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [
        title,
        safeSlug,
        safeDescription,
        safeThumbnail,
        safeCategoryId,
        req.user.user_id,
        safePrice,
        safeDiscountPrice,
        safeLevel
      ]
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






exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params; // lesson_id
    const { title, content, video_url, duration, is_free, position } = req.body;

    // Kiểm tra lesson có tồn tại không
    const [lesson] = await db.execute('SELECT lesson_id FROM lessons WHERE lesson_id = ?', [id]);
    if (lesson.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài học' });
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

    // Cập nhật bài học
    const [result] = await db.execute(
      `UPDATE lessons 
       SET title = ?, content = ?, video_url = ?, duration = ?, is_free = ?, position = ?
       WHERE lesson_id = ?`,
      [title, content, video_url, durationInSeconds, is_free, position, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài học để cập nhật' });
    }

    res.json({ message: 'Cập nhật bài học thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server', message: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params; // lesson_id

    // Kiểm tra lesson có tồn tại không
    const [lesson] = await db.execute('SELECT lesson_id FROM lessons WHERE lesson_id = ?', [id]);
    if (lesson.length === 0) {
      return res.status(404).json({ error: 'Không tìm thấy bài học' });
    }

    // Xóa bài học
    const [result] = await db.execute('DELETE FROM lessons WHERE lesson_id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Không thể xóa bài học' });
    }

    res.json({ message: 'Xóa bài học thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server', message: error.message });
  }
};