const express = require('express');
const dotenv = require('dotenv');
const courseRoutes = require('./routes/courseRoute');
const authRoutes = require('./routes/authRoute');
const protectedRoutes = require('./routes/protectedRoute');
const enrollmentRoutes = require('./routes/enrollmentsRoute');



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api', courseRoutes);


app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy ở http://localhost:${PORT}`);
});
