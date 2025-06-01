const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadVideo');

router.post('/upload', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Chưa chọn video' });
  }

  const videoPath = `/uploads/videos/${req.file.filename}`;

  res.status(200).json({
    message: 'Upload video thành công',
    video_url: videoPath
  });
});

module.exports = router;
