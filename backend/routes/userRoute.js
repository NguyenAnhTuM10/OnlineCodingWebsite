const express = require('express');
const router = express.Router();
const { getCurrentUser,updateCurrentUser,getUserProgress,updateLessonProgress } = require('../controllers/userController');
// const progressController = require('../controllers/progressController');
const authenticate = require('../middlewares/authMiddleware');

router.get('/me', authenticate, getCurrentUser); // 👈
router.put('/me', authenticate, updateCurrentUser);

// GET /api/users/:userId/progress/:courseId
router.get('/:userId/progress/:courseId',getUserProgress);

// POST /api/users/:userId/progress
router.post('/:userId/progress',updateLessonProgress );



module.exports = router;
