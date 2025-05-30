const express = require('express');
const router = express.Router();
const {authenticate} = require('../middlewares/authMiddleware');
const { submitReview,getReviewsByCourseId } = require('../controllers/reviewController');

router.post('/', authenticate, submitReview);
router.get('/course/:id', getReviewsByCourseId); // 👈 route mới

module.exports = router;


