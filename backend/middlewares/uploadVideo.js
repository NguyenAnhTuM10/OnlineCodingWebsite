const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu và tên file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads/videos'));
    // cb(null, path.join(__dirname, '/uploads/videos'));
  },
  filename: function (req, file, cb) {
    // Loại bỏ khoảng trắng và ký tự đặc biệt nếu cần
    const originalName = file.originalname.replace(/\s+/g, '_');
    cb(null, originalName); // Giữ nguyên tên gốc
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000 * 1024 * 1024 }, // giới hạn ~1GB
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!['.mp4', '.mov', '.avi', '.mkv'].includes(ext)) {
      return cb(new Error('Chỉ hỗ trợ các định dạng video .mp4, .mov, .avi, .mkv'));
    }
    cb(null, true);
  }
});

module.exports = upload;
