const db = require('../db'); // mysql2 connection pool


exports.getLessonProgress = async (req, res) => {
  // Debug request
  console.log('=== DEBUG REQUEST ===');
  console.log('req.params:', req.params);
  console.log('req.query:', req.query);
  console.log('req.url:', req.url);
  console.log('req.method:', req.method);
  console.log('====================');

  const user_id = req.params.user_id;

  try {
    // Validate user_id
    if (!user_id) {
      return res.status(400).json({ 
        message: 'user_id là bắt buộc',
        error: 'MISSING_USER_ID'
      });
    }

    // Log để debug
    console.log('Đang lấy tiến độ cho user_id:', user_id);

    // Kiểm tra kết nối database
    if (!db) {
      throw new Error('Database connection not available');
    }

    const [rows] = await db.execute(
      `SELECT * FROM lesson_progress WHERE user_id = ?`, 
      [user_id]
    );

    console.log('Kết quả query:', rows.length, 'records found');

    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });

  } catch (error) {
    // Log chi tiết lỗi
    console.error('=== Chi tiết lỗi getLessonProgress ===');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('user_id:', user_id);
    console.error('==========================================');

    // Trả về lỗi cụ thể hơn
    let errorMessage = 'Lỗi server khi lấy tiến độ';
    let statusCode = 500;

    if (error.code === 'ER_NO_SUCH_TABLE') {
      errorMessage = 'Bảng lesson_progress không tồn tại';
      statusCode = 500;
    } else if (error.code === 'ER_BAD_FIELD_ERROR') {
      errorMessage = 'Cột trong bảng lesson_progress không đúng';
      statusCode = 500;
    } else if (error.code === 'ECONNREFUSED') {
      errorMessage = 'Không thể kết nối database';
      statusCode = 503;
    }

    res.status(statusCode).json({ 
      message: errorMessage,
      error: error.code || 'UNKNOWN_ERROR',
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message 
      })
    });
  }
};



// // GET: lấy tiến độ học của user
// exports.getLessonProgress = async (req, res) => {
//   const user_id = req.params.user_id;

//   try {
//     const [rows] = await db.execute(
//       `SELECT * FROM lesson_progress WHERE user_id = ?`, 
//       [user_id]
//     );

//     res.status(200).json(rows);
//   } catch (error) {
//     console.error('Lỗi khi lấy tiến độ:', error);
//     res.status(500).json({ message: 'Lỗi server khi lấy tiến độ' });
//   }
// };

// POST: cập nhật hoặc tạo tiến độ học
exports.updateLessonProgress = async (req, res) => {
  const { user_id, lesson_id, is_completed, last_watched_position } = req.body;

  if (!user_id || !lesson_id) {
    return res.status(400).json({ message: 'Thiếu user_id hoặc lesson_id' });
  }

  try {
    const [result] = await db.execute(
      `
      INSERT INTO lesson_progress (user_id, lesson_id, is_completed, last_watched_position, completed_at)
      VALUES (?, ?, ?, ?, IF(?, NOW(), NULL))
      ON DUPLICATE KEY UPDATE 
        is_completed = VALUES(is_completed),
        last_watched_position = VALUES(last_watched_position),
        completed_at = IF(?, NOW(), NULL)
      `,
      [
        user_id,
        lesson_id,
        is_completed || false,
        last_watched_position || 0,
        is_completed || false,
        is_completed || false
      ]
    );

    res.status(200).json({ message: 'Tiến độ đã được cập nhật' });
  } catch (error) {
    console.error('Lỗi khi cập nhật tiến độ:', error);
    res.status(500).json({ message: 'Lỗi server khi cập nhật tiến độ' });
  }
};
