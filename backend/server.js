const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const courseRoutes = require('./routes/courseRoute');
const authRoutes = require('./routes/authRoute');
const protectedRoutes = require('./routes/protectedRoute');
const enrollmentRoutes = require('./routes/enrollmentsRoute');
const reviewRoutes = require('./routes/reviewRoute');
const lessonProgressRoutes = require('./routes/lessonProgressRoutes');
const userRoutes = require('./routes/userRoute');
const blogRoutes = require('./routes/blogRoute');




const cors = require('cors');









dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Cho phép truy cập tĩnh tới thư mục public
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/lesson-progress', lessonProgressRoutes);
app.use('/api/users', userRoutes);

app.use('/api', courseRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy ở http://localhost:${PORT}`);
});
