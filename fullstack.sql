Drop database if exists fullstack_edu;

-- Create the database
CREATE DATABASE fullstack_edu;
USE fullstack_edu;

-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(255),
    bio TEXT,
    role ENUM('student', 'instructor', 'admin') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    thumbnail_url VARCHAR(255),
    category_id INT,
    instructor_id INT,
    price DECIMAL(10, 2) DEFAULT 0.00,
    discount_price DECIMAL(10, 2) DEFAULT NULL,
    level ENUM('beginner', 'intermediate', 'advanced') NOT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id),
    FOREIGN KEY (instructor_id) REFERENCES users(user_id)
);

-- Chapters table
CREATE TABLE chapters (
    chapter_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);

-- Lessons table
CREATE TABLE lessons (
    lesson_id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    video_url VARCHAR(255),
    duration INT COMMENT 'Duration in seconds',
    is_free BOOLEAN DEFAULT FALSE,
    position INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (chapter_id) REFERENCES chapters(chapter_id) ON DELETE CASCADE
);

-- Enrollments table
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'completed', 'refunded') DEFAULT 'active',
    progress DECIMAL(5, 2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    UNIQUE KEY (user_id, course_id)
);

-- Lesson progress table
CREATE TABLE lesson_progress (
    progress_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    lesson_id INT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    last_watched_position INT DEFAULT 0 COMMENT 'Last watched position in seconds',
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id),
    UNIQUE KEY (user_id, lesson_id)
);

-- Reviews table
CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    UNIQUE KEY (user_id, course_id)
);

-- Blog posts table
CREATE TABLE blog_posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    featured_image VARCHAR(255),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id)
);

-- Tags table
CREATE TABLE tags (
    tag_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE
);

-- Course tags relationship table
CREATE TABLE course_tags (
    course_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (course_id, tag_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

-- Blog post tags relationship table
CREATE TABLE post_tags (
    post_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(tag_id) ON DELETE CASCADE
);

-- Comments table for blog posts
CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT DEFAULT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES blog_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (parent_id) REFERENCES comments(comment_id) ON DELETE CASCADE
);

-- Notifications table
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    notification_type VARCHAR(50),
    related_id INT COMMENT 'ID of related entity (course, lesson, etc.)',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_lessons_chapter ON lessons(chapter_id);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);

-- Insert sample data

-- Sample users
INSERT INTO users (username, email, password_hash, full_name, avatar_url, bio, role) VALUES
('admin', 'admin@fullstack.edu.vn', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', '/images/avatars/admin.jpg', 'Administrator of the website', 'admin'),
('sondnf8', 'sondn@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sơn Đặng', '/images/avatars/sondang.jpg', 'Founder F8 - Học lập trình để đi làm', 'instructor'),
('johndoe', 'john@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', '/images/avatars/john.jpg', 'Frontend developer with 5 years of experience', 'instructor'),
('janesmith', 'jane@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith', '/images/avatars/jane.jpg', 'Backend developer specializing in Node.js', 'instructor'),
('student1', 'student1@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Student One', '/images/avatars/student1.jpg', 'Learning web development', 'student'),
('student2', 'student2@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Student Two', '/images/avatars/student2.jpg', 'Aspiring full-stack developer', 'student'),
('student3', 'student3@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Student Three', '/images/avatars/student3.jpg', 'Software engineering student', 'student');
INSERT INTO users (username, email, password_hash, full_name, avatar_url, bio, role)
VALUES (
  'user01',
  'test01@example.com',
  '$2b$10$ztXtM2zXGt1lSli/mXNKjOywVGpjD2efKMs4IacD4N6DeRFykVG4C',
  'Test User',
  '/images/avatars/testuser.jpg',
  'Test login user',
  'student'
);

-- Sample categories
INSERT INTO categories (name, slug, description, image_url) VALUES
('Front-end', 'front-end', 'Learn to build beautiful user interfaces with HTML, CSS, and JavaScript', '/images/categories/frontend.jpg'),
('Back-end', 'back-end', 'Master server-side programming and database management', '/images/categories/backend.jpg'),
('Mobile', 'mobile', 'Develop applications for iOS and Android devices', '/images/categories/mobile.jpg'),
('DevOps', 'devops', 'Learn deployment, integration, and infrastructure automation', '/images/categories/devops.jpg'),
('Database', 'database', 'Master SQL and NoSQL database management systems', '/images/categories/database.jpg');

-- Sample courses
INSERT INTO courses (title, slug, description, thumbnail_url, category_id, instructor_id, price, discount_price, level, status) VALUES
('HTML, CSS từ Zero đến Hero', 'html-css-tu-zero-den-hero', 'Khóa học HTML CSS từ cơ bản đến nâng cao dành cho người mới bắt đầu. Học đi đôi với hành, dự án thực tế sau mỗi bài học.', '/images/courses/htmlcss.jpg', 1, 2, 0.00, NULL, 'beginner', 'published'),
('JavaScript Cơ Bản', 'javascript-co-ban', 'Học Javascript cơ bản phù hợp cho người chưa từng học lập trình. Với hơn 100 bài học và có bài tập thực hành sau mỗi bài học.', '/images/courses/javascript.jpg', 1, 2, 0.00, NULL, 'beginner', 'published'),
('Node.js & ExpressJS', 'nodejs-expressjs', 'Học Back-end với Node & ExpressJS với kiến thức từ cơ bản đến chuyên sâu, xây dựng RESTful API và kết nối với cơ sở dữ liệu.', '/images/courses/nodejs.jpg', 2, 3, 1200000.00, 1000000.00, 'intermediate', 'published'),
('React.js Pro', 'reactjs-pro', 'Đi sâu vào các khái niệm của React như React Hook, Redux, React Router và kết hợp với TypeScript.', '/images/courses/reactjs.jpg', 1, 2, 1500000.00, 1200000.00, 'advanced', 'published'),
('React Native', 'react-native', 'Xây dựng ứng dụng di động đa nền tảng với React Native. Học một lần, viết mã cho cả iOS và Android.', '/images/courses/reactnative.jpg', 3, 4, 1800000.00, 1500000.00, 'intermediate', 'published'),
('Docker Cơ Bản', 'docker-co-ban', 'Làm quen với container và Docker, triển khai ứng dụng với Docker một cách chuyên nghiệp.', '/images/courses/docker.jpg', 4, 3, 1000000.00, 800000.00, 'intermediate', 'published'),
('MongoDB Toàn Tập', 'mongodb-toan-tap', 'Tìm hiểu sâu về NoSQL và MongoDB, từ cơ bản đến các tính năng nâng cao như aggregation và indexing.', '/images/courses/mongodb.jpg', 5, 4, 1200000.00, 1000000.00, 'intermediate', 'published'),
('Git & GitHub', 'git-github', 'Quản lý mã nguồn và làm việc nhóm hiệu quả với Git và GitHub. Học từ cơ bản đến workflow chuyên nghiệp.', '/images/courses/git.jpg', 4, 2, 0.00, NULL, 'beginner', 'published');

-- Sample chapters
INSERT INTO chapters (course_id, title, position) VALUES
(1, 'Giới thiệu HTML', 1),
(1, 'CSS cơ bản', 2),
(1, 'CSS Layout', 3),
(1, 'Responsive Design', 4),
(2, 'Giới thiệu JavaScript', 1),
(2, 'Biến và kiểu dữ liệu', 2),
(2, 'Hàm trong JavaScript', 3),
(2, 'DOM và sự kiện', 4),
(3, 'Giới thiệu Node.js', 1),
(3, 'Express.js cơ bản', 2),
(3, 'RESTful API', 3),
(3, 'MongoDB với Node.js', 4);

-- Sample lessons
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(1, 'HTML là gì?', 'Giới thiệu về HTML và cấu trúc của một trang web.', '/videos/html-intro.mp4', 600, TRUE, 1),
(1, 'Cấu trúc HTML cơ bản', 'Tìm hiểu về các thẻ HTML cơ bản và cách sử dụng.', '/videos/html-basic.mp4', 720, TRUE, 2),
(1, 'HTML5 và các thẻ ngữ nghĩa', 'Giới thiệu về HTML5 và các thẻ ngữ nghĩa mới.', '/videos/html5.mp4', 840, FALSE, 3),
(2, 'CSS là gì?', 'Giới thiệu về CSS và cách sử dụng để tạo kiểu cho trang web.', '/videos/css-intro.mp4', 660, TRUE, 1),
(2, 'Selectors trong CSS', 'Tìm hiểu về các loại selectors trong CSS.', '/videos/css-selectors.mp4', 780, FALSE, 2),
(3, 'Box Model trong CSS', 'Giải thích về box model và cách tính toán kích thước.', '/videos/box-model.mp4', 720, FALSE, 1),
(3, 'Flexbox Layout', 'Hướng dẫn sử dụng Flexbox để tạo layout linh hoạt.', '/videos/flexbox.mp4', 900, FALSE, 2),
(4, 'Media Queries', 'Sử dụng media queries để tạo responsive design.', '/videos/media-queries.mp4', 840, FALSE, 1),
(5, 'JavaScript là gì?', 'Giới thiệu về JavaScript và vai trò của nó trong phát triển web.', '/videos/js-intro.mp4', 660, TRUE, 1),
(5, 'Cài đặt môi trường và Hello World', 'Hướng dẫn cài đặt môi trường và viết chương trình đầu tiên.', '/videos/js-setup.mp4', 540, TRUE, 2);

-- Sample tags
INSERT INTO tags (name, slug) VALUES
('HTML', 'html'),
('CSS', 'css'),
('JavaScript', 'javascript'),
('React', 'react'),
('Node.js', 'nodejs'),
('Express', 'express'),
('MongoDB', 'mongodb'),
('Git', 'git'),
('Docker', 'docker'),
('Responsive', 'responsive'),
('Frontend', 'frontend'),
('Backend', 'backend');

-- Sample course tags
INSERT INTO course_tags (course_id, tag_id) VALUES
(1, 1), (1, 2), (1, 10), (1, 11),
(2, 3), (2, 11),
(3, 5), (3, 6), (3, 7), (3, 12),
(4, 3), (4, 4), (4, 11),
(5, 3), (5, 4),
(6, 9),
(7, 7), (7, 12),
(8, 8);

-- Sample enrollments
INSERT INTO enrollments (user_id, course_id, status, progress) VALUES
(5, 1, 'active', 25.00),
(5, 2, 'active', 10.00),
(6, 1, 'completed', 100.00),
(6, 3, 'active', 45.00),
(7, 2, 'active', 30.00),
(7, 4, 'active', 15.00);

-- Sample lesson progress
INSERT INTO lesson_progress (user_id, lesson_id, is_completed, last_watched_position) VALUES
(5, 1, TRUE, 600),
(5, 2, TRUE, 720),
(5, 3, FALSE, 300),
(5, 4, FALSE, 200),
(6, 1, TRUE, 600),
(6, 2, TRUE, 720),
(6, 3, TRUE, 840),
(6, 4, TRUE, 660),
(7, 9, TRUE, 660),
(7, 10, FALSE, 240);

-- Sample reviews
INSERT INTO reviews (course_id, user_id, rating, comment) VALUES
(1, 6, 5, 'Khóa học rất hay và dễ hiểu, phù hợp cho người mới bắt đầu. Giảng viên giảng dạy rất nhiệt tình.'),
(1, 7, 4, 'Nội dung chất lượng, nhưng tôi mong muốn có thêm nhiều bài tập thực hành hơn.'),
(2, 5, 5, 'Khóa học JavaScript cơ bản rất tuyệt vời, giúp tôi hiểu rõ những khái niệm cơ bản.'),
(3, 6, 4, 'Khóa học Node.js rất hay, giảng viên có kinh nghiệm thực tế và chia sẻ nhiều kiến thức hữu ích.');

-- Sample blog posts
INSERT INTO blog_posts (title, slug, content, author_id, featured_image, status, view_count) VALUES
('Lộ trình học Front-end Developer từ số 0', 'lo-trinh-hoc-front-end-developer-tu-so-0', 'Bài viết này sẽ hướng dẫn chi tiết lộ trình học để trở thành một Front-end Developer chuyên nghiệp, bắt đầu từ các kiến thức cơ bản nhất. Chúng ta sẽ đi qua các bước từ HTML, CSS cơ bản đến JavaScript, các framework hiện đại như React, và các công cụ phát triển web.', 2, '/images/blog/frontend-roadmap.jpg', 'published', 1250),
('5 tips giúp học lập trình hiệu quả', '5-tips-giup-hoc-lap-trinh-hieu-qua', 'Trong bài viết này, chúng tôi chia sẻ 5 phương pháp giúp bạn học lập trình hiệu quả hơn, từ việc lên kế hoạch học tập, thực hành thường xuyên, đến cách giải quyết các vấn đề khi gặp khó khăn.', 2, '/images/blog/programming-tips.jpg', 'published', 980),
('So sánh React và Vue.js: Nên chọn framework nào?', 'so-sanh-react-va-vuejs-nen-chon-framework-nao', 'Bài viết phân tích chi tiết về ưu và nhược điểm của hai framework phổ biến nhất hiện nay: React và Vue.js. Giúp bạn có cái nhìn khách quan để lựa chọn công nghệ phù hợp với dự án của mình.', 3, '/images/blog/react-vs-vue.jpg', 'published', 1560),
('Tìm hiểu về Microservices Architecture', 'tim-hieu-ve-microservices-architecture', 'Giới thiệu về kiến trúc Microservices, các ưu điểm, thách thức và trường hợp nên áp dụng. Bài viết cũng so sánh Microservices với kiến trúc Monolithic truyền thống.', 4, '/images/blog/microservices.jpg', 'published', 750);

-- Sample blog post tags
INSERT INTO post_tags (post_id, tag_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 11),
(2, 11), (2, 12),
(3, 3), (3, 4), (3, 11),
(4, 5), (4, 12);

-- Sample comments
INSERT INTO comments (post_id, user_id, content) VALUES
(1, 5, 'Bài viết rất hữu ích cho người mới bắt đầu như mình. Cảm ơn tác giả!'),
(1, 6, 'Mình đang theo đúng lộ trình này và thấy rất hiệu quả. Mong tác giả ra thêm nhiều bài viết chi tiết hơn về từng phần.'),
(2, 7, 'Những tips này đã giúp mình cải thiện rất nhiều trong việc học lập trình. Đặc biệt là tip về thực hành thường xuyên.'),
(3, 5, 'Mình đang phân vân giữa React và Vue, bài viết này đã giúp mình có cái nhìn rõ ràng hơn để lựa chọn.'),
(3, 6, 'Theo kinh nghiệm của mình thì React phù hợp với dự án lớn hơn, còn Vue thì dễ học hơn cho người mới.'),
(4, 7, 'Bài viết hay nhưng hơi khó hiểu với người mới. Mong tác giả có thêm phần giải thích cơ bản hơn.');

-- Sample notifications
INSERT INTO notifications (user_id, title, message, is_read, notification_type, related_id) VALUES
(5, 'Khóa học mới', 'Khóa học "React.js Pro" mới được ra mắt. Hãy đăng ký ngay!', FALSE, 'course', 4),
(5, 'Nhắc nhở học tập', 'Bạn chưa hoàn thành bài học "CSS là gì?" trong khóa học HTML, CSS.', FALSE, 'lesson', 4),
(6, 'Bình luận mới', 'Có người đã phản hồi bình luận của bạn trong bài viết "So sánh React và Vue.js".', TRUE, 'comment', 5),
(7, 'Cập nhật khóa học', 'Khóa học "JavaScript Cơ Bản" đã được cập nhật nội dung mới.', FALSE, 'course_update', 2);




















-- Thêm các khóa học mới từ fullstack.edu.vn
INSERT INTO courses (title, slug, description, thumbnail_url, category_id, instructor_id, price, discount_price, level, status) VALUES

-- Thêm khóa học Front-end
('Kiến Thức Nhập Môn IT', 'kien-thuc-nhap-mon-it', 'Khoá học cung cấp cho người học cái nhìn tổng quan về ngành IT - Lập trình web. Các khái niệm, thuật ngữ cốt lõi của ngành lập trình web. Hiểu về các loại hình website, mô hình Client - Server, các công nghệ Front-end, Back-end, Database và cách chúng liên kết với nhau như thế nào.', '/images/courses/nhap-mon-it.jpg', 1, 2, 0.00, NULL, 'beginner', 'published'),

('Responsive Web Design', 'responsive-web-design', 'Trong khóa học này chúng ta sẽ học về Responsive Web Design (thiết kế web đáp ứng). Đây là kỹ năng bắt buộc của một Front-end Developer.', '/images/courses/responsive.jpg', 1, 2, 0.00, NULL, 'beginner', 'published'),

('HTML CSS Pro', 'html-css-pro', 'Khóa học HTML CSS Pro với nhiều dự án thực tế, nâng cao kỹ năng Front-end. Áp dụng kiến thức HTML, CSS vào các dự án thực tế.', '/images/courses/html-css-pro.jpg', 1, 2, 1290000.00, 990000.00, 'intermediate', 'published'),

('JavaScript Nâng Cao', 'javascript-nang-cao', 'Khóa học JavaScript chuyên sâu, tìm hiểu các khái niệm nâng cao như Closure, Hoisting, Prototype, Async/Await, và nhiều design patterns.', '/images/courses/js-advanced.jpg', 1, 2, 1490000.00, 1190000.00, 'advanced', 'published'),

('Xây Dựng Website với ReactJS', 'xay-dung-website-voi-reactjs', 'Học ReactJS từ cơ bản đến nâng cao, xây dựng các ứng dụng web hiện đại với React Hooks, Context API, và các thư viện phổ biến.', '/images/courses/reactjs-website.jpg', 1, 3, 1890000.00, 1490000.00, 'intermediate', 'published'),

-- Thêm khóa học Back-end
('Làm Quen với Express JS', 'lam-quen-voi-expressjs', 'Tìm hiểu về Express.js - framework phổ biến nhất của Node.js. Xây dựng RESTful API, middleware, routing và các tính năng cốt lõi.', '/images/courses/expressjs.jpg', 2, 4, 1290000.00, 990000.00, 'intermediate', 'published'),

('Node & ExpressJS', 'node-expressjs-advanced', 'Khóa học Node.js và Express.js chuyên sâu, xây dựng ứng dụng web full-stack với authentication, authorization, và deployment.', '/images/courses/node-express-advanced.jpg', 2, 4, 1690000.00, 1390000.00, 'advanced', 'published'),

('Kiến Thức Cốt Lõi về Backend', 'kien-thuc-cot-loi-backend', 'Tìm hiểu các khái niệm cốt lõi của Backend development: Database design, API design, Security, Performance optimization.', '/images/courses/backend-core.jpg', 2, 4, 1490000.00, 1190000.00, 'intermediate', 'published'),

-- Thêm khóa học Mobile
('Làm Ứng Dụng với Flutter', 'lam-ung-dung-voi-flutter', 'Học Flutter để phát triển ứng dụng di động đa nền tảng. Xây dựng ứng dụng cho cả iOS và Android với một codebase duy nhất.', '/images/courses/flutter.jpg', 3, 3, 1890000.00, 1590000.00, 'intermediate', 'published'),

('React Native từ Cơ Bản đến Nâng Cao', 'react-native-co-ban-den-nang-cao', 'Phát triển ứng dụng di động với React Native, từ setup môi trường đến publish app lên App Store và Google Play.', '/images/courses/react-native-advanced.jpg', 3, 3, 1990000.00, 1690000.00, 'advanced', 'published'),

-- Thêm khóa học DevOps & Tools
('Làm Việc với Terminal & Ubuntu', 'lam-viec-voi-terminal-ubuntu', 'Học cách sử dụng Terminal hiệu quả, các lệnh Linux cơ bản và nâng cao. Làm quen với hệ điều hành Ubuntu.', '/images/courses/terminal-ubuntu.jpg', 4, 4, 690000.00, 490000.00, 'beginner', 'published'),

('Triển Khai Ứng Dụng với Heroku', 'trien-khai-ung-dung-voi-heroku', 'Học cách deploy ứng dụng web lên Heroku, cấu hình domain, environment variables và monitoring.', '/images/courses/heroku.jpg', 4, 4, 890000.00, 690000.00, 'intermediate', 'published'),

('SASS/SCSS từ Cơ Bản đến Nâng Cao', 'sass-scss-tu-co-ban-den-nang-cao', 'Tìm hiểu về SASS/SCSS - CSS preprocessor mạnh mẽ. Biến, mixins, functions, và các tính năng nâng cao.', '/images/courses/sass.jpg', 1, 2, 890000.00, 690000.00, 'intermediate', 'published'),

-- Thêm khóa học Database
('SQL Server từ Cơ Bản đến Nâng Cao', 'sql-server-tu-co-ban-den-nang-cao', 'Học SQL Server từ cơ bản đến nâng cao, thiết kế database, stored procedures, triggers, và performance tuning.', '/images/courses/sql-server.jpg', 5, 4, 1490000.00, 1190000.00, 'intermediate', 'published'),

('MySQL và Database Design', 'mysql-va-database-design', 'Nắm vững MySQL và các nguyên tắc thiết kế cơ sở dữ liệu. Optimization, indexing, và best practices.', '/images/courses/mysql-design.jpg', 5, 4, 1290000.00, 990000.00, 'intermediate', 'published');

-- Thêm chapters cho các khóa học mới
INSERT INTO chapters (course_id, title, position) VALUES
-- Kiến Thức Nhập Môn IT (course_id = 9)
(9, 'Giới thiệu về Ngành IT', 1),
(9, 'Mô hình Client-Server', 2),
(9, 'Frontend vs Backend', 3),
(9, 'Cơ sở dữ liệu cơ bản', 4),
(9, 'Lộ trình học tập', 5),

-- Responsive Web Design (course_id = 10)
(10, 'Khái niệm về Responsive', 1),
(10, 'Media Queries nâng cao', 2),
(10, 'Flexible Grid Systems', 3),
(10, 'Responsive Images', 4),
(10, 'Mobile First Design', 5),

-- HTML CSS Pro (course_id = 11)
(11, 'CSS Architecture', 1),
(11, 'CSS Grid Layout', 2),
(11, 'CSS Animations', 3),
(11, 'Dự án Shopee UI', 4),
(11, 'Dự án The Band', 5),

-- JavaScript Nâng Cao (course_id = 12)
(12, 'Scope và Closure', 1),
(12, 'Prototype và Inheritance', 2),
(12, 'Asynchronous JavaScript', 3),
(12, 'Design Patterns', 4),
(12, 'Module Systems', 5),

-- Xây Dựng Website với ReactJS (course_id = 13)
(13, 'React Fundamentals', 1),
(13, 'React Hooks', 2),
(13, 'State Management', 3),
(13, 'React Router', 4),
(13, 'Dự án Tiktok UI', 5),

-- Làm Quen với Express JS (course_id = 14)
(14, 'Express.js Cơ bản', 1),
(14, 'Routing và Middleware', 2),
(14, 'Template Engines', 3),
(14, 'Error Handling', 4),
(14, 'RESTful API Design', 5),

-- Node & ExpressJS (course_id = 15)
(15, 'Node.js Nâng cao', 1),
(15, 'Authentication & Authorization', 2),
(15, 'Database Integration', 3),
(15, 'API Security', 4),
(15, 'Testing và Deployment', 5),

-- Kiến Thức Cốt Lõi về Backend (course_id = 16)
(16, 'Backend Architecture', 1),
(16, 'Database Design Principles', 2),
(16, 'Caching Strategies', 3),
(16, 'Performance Optimization', 4),
(16, 'Scalability Patterns', 5),

-- Làm Ứng Dụng với Flutter (course_id = 17)
(17, 'Flutter Development Setup', 1),
(17, 'Dart Programming Language', 2),
(17, 'Widgets và UI Design', 3),
(17, 'State Management', 4),
(17, 'Firebase Integration', 5),

-- React Native từ Cơ Bản đến Nâng Cao (course_id = 18)
(18, 'React Native Setup', 1),
(18, 'Navigation Systems', 2),
(18, 'Native Modules', 3),
(18, 'Performance Optimization', 4),
(18, 'App Store Deployment', 5),

-- Làm Việc với Terminal & Ubuntu (course_id = 19)
(19, 'Linux Fundamentals', 1),
(19, 'File System và Permissions', 2),
(19, 'Process Management', 3),
(19, 'Shell Scripting', 4),
(19, 'System Administration', 5),

-- Triển Khai Ứng Dụng với Heroku (course_id = 20)
(20, 'Heroku Platform Overview', 1),
(20, 'Deploying Applications', 2),
(20, 'Environment Configuration', 3),
(20, 'Add-ons và Services', 4),
(20, 'Monitoring và Scaling', 5),

-- SASS/SCSS (course_id = 21)
(21, 'SASS/SCSS Cơ bản', 1),
(21, 'Variables và Mixins', 2),
(21, 'Functions và Control Directives', 3),
(21, 'Advanced Features', 4),
(21, 'Build Tools Integration', 5),

-- SQL Server (course_id = 22)
(22, 'SQL Server Fundamentals', 1),
(22, 'Advanced Queries', 2),
(22, 'Stored Procedures', 3),
(22, 'Performance Tuning', 4),
(22, 'Database Administration', 5),

-- MySQL và Database Design (course_id = 23)
(23, 'MySQL Cơ bản', 1),
(23, 'Database Design Principles', 2),
(23, 'Advanced MySQL Features', 3),
(23, 'Optimization Techniques', 4),
(23, 'Backup và Recovery', 5);

-- Thêm lessons cho các chapters mới


-- Kiến Thức Nhập Môn IT - Chapter 1 (chapter_id = 13)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(13, 'Ngành IT là gì?', 'Tổng quan về ngành Công nghệ thông tin, các lĩnh vực chính và cơ hội nghề nghiệp.', '/videos/it-overview.mp4', 900, TRUE, 1),
(13, 'Lập trình viên làm gì?', 'Mô tả công việc hàng ngày của một lập trình viên và các kỹ năng cần thiết.', '/videos/programmer-job.mp4', 720, TRUE, 2),
(13, 'Các ngôn ngữ lập trình phổ biến', 'Giới thiệu về các ngôn ngữ lập trình chính và ứng dụng của chúng.', '/videos/programming-languages.mp4', 840, FALSE, 3);

-- Kiến Thức Nhập Môn IT - Chapter 2 (chapter_id = 14)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(14, 'Mô hình Client-Server là gì?', 'Hiểu về kiến trúc Client-Server và cách thức hoạt động.', '/videos/client-server.mp4', 660, TRUE, 1),
(14, 'HTTP và HTTPS', 'Tìm hiểu về giao thức HTTP/HTTPS và cách dữ liệu được truyền tải.', '/videos/http-https.mp4', 780, FALSE, 2),
(14, 'DNS và Domain', 'Giải thích hệ thống tên miền và cách nó hoạt động.', '/videos/dns-domain.mp4', 600, FALSE, 3);

-- Responsive Web Design - Chapter 1 (chapter_id = 15)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(15, 'Responsive Design là gì?', 'Giới thiệu khái niệm thiết kế web đáp ứng và tầm quan trọng.', '/videos/responsive-intro.mp4', 720, TRUE, 1),
(15, 'Viewport Meta Tag', 'Tìm hiểu về viewport và cách sử dụng meta tag.', '/videos/viewport.mp4', 540, TRUE, 2),
(15, 'Flexible Layout Basics', 'Các nguyên tắc cơ bản để tạo layout linh hoạt.', '/videos/flexible-layout.mp4', 840, FALSE, 3);

-- HTML CSS Pro - Chapter 4 (chapter_id = 18)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(18, 'Phân tích giao diện Shopee', 'Phân tích và lên kế hoạch cho dự án clone Shopee.', '/videos/shopee-analysis.mp4', 1200, FALSE, 1),
(18, 'Xây dựng Header Shopee', 'Tạo header cho trang web Shopee với HTML và CSS.', '/videos/shopee-header.mp4', 1800, FALSE, 2),
(18, 'Xây dựng Navigation Menu', 'Tạo menu navigation responsive cho Shopee.', '/videos/shopee-nav.mp4', 1560, FALSE, 3),
(18, 'Product Grid Layout', 'Tạo layout hiển thị sản phẩm dạng grid.', '/videos/shopee-grid.mp4', 2100, FALSE, 4);

-- JavaScript Nâng Cao - Chapter 1 (chapter_id = 19)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(19, 'Function Scope vs Block Scope', 'Hiểu rõ về scope trong JavaScript và sự khác biệt giữa var, let, const.', '/videos/js-scope.mp4', 960, FALSE, 1),
(19, 'Closure và Practical Applications', 'Tìm hiểu về closure và các ứng dụng thực tế.', '/videos/js-closure.mp4', 1080, FALSE, 2),
(19, 'Module Pattern với Closure', 'Sử dụng closure để tạo module pattern.', '/videos/js-module-pattern.mp4', 840, FALSE, 3);

-- React Website - Chapter 5 (chapter_id = 23)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(23, 'Giới thiệu dự án Tiktok UI', 'Tổng quan về dự án và công nghệ sử dụng.', '/videos/tiktok-intro.mp4', 600, FALSE, 1),
(23, 'Setup dự án và cài đặt thư viện', 'Cài đặt Create React App và các thư viện cần thiết.', '/videos/tiktok-setup.mp4', 720, FALSE, 2),
(23, 'Tạo Layout cơ bản', 'Xây dựng layout cơ bản cho ứng dụng Tiktok.', '/videos/tiktok-layout.mp4', 1440, FALSE, 3),
(23, 'Header và Sidebar Component', 'Tạo các component Header và Sidebar.', '/videos/tiktok-header-sidebar.mp4', 1800, FALSE, 4),
(23, 'Video Feed Component', 'Xây dựng component hiển thị video feed.', '/videos/tiktok-video-feed.mp4', 2400, FALSE, 5);

-- Express.js - Chapter 1 (chapter_id = 24)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(24, 'Giới thiệu Express.js', 'Tổng quan về Express.js framework và ưu điểm.', '/videos/express-intro.mp4', 480, TRUE, 1),
(24, 'Cài đặt và Hello World', 'Cài đặt Express.js và tạo ứng dụng đầu tiên.', '/videos/express-hello.mp4', 600, TRUE, 2),
(24, 'Express Application Structure', 'Cấu trúc cơ bản của một ứng dụng Express.', '/videos/express-structure.mp4', 720, FALSE, 3);

-- Flutter - Chapter 2 (chapter_id = 28)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(28, 'Dart Syntax Cơ bản', 'Học cú pháp cơ bản của ngôn ngữ Dart.', '/videos/dart-syntax.mp4', 900, FALSE, 1),
(28, 'Variables và Data Types', 'Biến và các kiểu dữ liệu trong Dart.', '/videos/dart-variables.mp4', 720, FALSE, 2),
(28, 'Functions và Classes', 'Hàm và lớp trong Dart programming.', '/videos/dart-functions-classes.mp4', 1080, FALSE, 3),
(28, 'Collections và Generics', 'List, Map, Set và Generics trong Dart.', '/videos/dart-collections.mp4', 960, FALSE, 4);

-- Terminal & Ubuntu - Chapter 1 (chapter_id = 31)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(31, 'Giới thiệu về Linux', 'Lịch sử và triết lý của hệ điều hành Linux.', '/videos/linux-intro.mp4', 600, TRUE, 1),
(31, 'Ubuntu Installation', 'Hướng dẫn cài đặt Ubuntu trên máy tính.', '/videos/ubuntu-install.mp4', 1200, TRUE, 2),
(31, 'Linux File System', 'Hiểu về cấu trúc thư mục trong Linux.', '/videos/linux-filesystem.mp4', 840, FALSE, 3);

-- SASS/SCSS - Chapter 1 (chapter_id = 35)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(35, 'SASS vs SCSS', 'Sự khác biệt giữa SASS và SCSS syntax.', '/videos/sass-vs-scss.mp4', 480, TRUE, 1),
(35, 'Cài đặt SASS', 'Hướng dẫn cài đặt SASS trên máy tính.', '/videos/sass-install.mp4', 360, TRUE, 2),
(35, 'Nesting Rules', 'Sử dụng tính năng nesting trong SASS.', '/videos/sass-nesting.mp4', 600, FALSE, 3);

-- SQL Server - Chapter 1 (chapter_id = 37)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(37, 'SQL Server Overview', 'Giới thiệu về Microsoft SQL Server.', '/videos/sqlserver-overview.mp4', 720, TRUE, 1),
(37, 'Installation và Setup', 'Cài đặt SQL Server và SQL Server Management Studio.', '/videos/sqlserver-install.mp4', 900, TRUE, 2),
(37, 'Database Basics', 'Các khái niệm cơ bản về cơ sở dữ liệu.', '/videos/sqlserver-basics.mp4', 840, FALSE, 3);

-- Cập nhật course tags cho các khóa học mới
INSERT INTO course_tags (course_id, tag_id) VALUES
(9, 11), (9, 12),
(10, 1), (10, 2), (10, 10),
(11, 1), (11, 2), (11, 10), (11, 11),
(12, 3), (12, 11),
(13, 3), (13, 4), (13, 11),
(14, 5), (14, 6), (14, 12),
(15, 5), (15, 6), (15, 12),
(16, 12),
(17, 3),
(18, 3), (18, 4),
(19, 8),
(20, 9),
(21, 2),
(22, 12),
(23, 7), (23, 12);

-- Thêm một số enrollments và lesson progress mẫu
INSERT INTO enrollments (user_id, course_id, status, progress) VALUES
(5, 9, 'completed', 100.00),
(5, 10, 'active', 60.00),
(6, 11, 'active', 30.00),
(6, 12, 'active', 20.00),
(7, 13, 'active', 40.00),
(7, 14, 'active', 70.00);

-- Thêm reviews cho các khóa học mới
INSERT INTO reviews (course_id, user_id, rating, comment) VALUES
(9, 5, 5, 'Khóa học rất tốt cho người mới bắt đầu, giúp mình hiểu rõ về ngành IT.'),
(10, 6, 4, 'Học được nhiều kiến thức về responsive design, rất hữu ích.'),
(11, 7, 5, 'Dự án thực tế rất hay, giúp mình áp dụng kiến thức vào thực tế.'),
(13, 5, 4, 'ReactJS được giảng dạy rất chi tiết và dễ hiểu.'),
(14, 6, 5, 'Express.js từ cơ bản đến nâng cao, rất đầy đủ và chất lượng.');































-- Bổ sung các lessons còn thiếu cho các chapters hiện có

-- HTML CSS từ Zero đến Hero - Bổ sung lessons
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
-- Chapter 2: CSS cơ bản (chapter_id = 2) - thiếu lessons
(2, 'CSS Properties cơ bản', 'Học các CSS properties quan trọng như color, font, background.', '/videos/css-properties.mp4', 720, FALSE, 3),
(2, 'Text Styling và Typography', 'Tạo kiểu cho văn bản và typography trong CSS.', '/videos/css-typography.mp4', 660, FALSE, 4);

-- Chapter 3: CSS Layout (chapter_id = 3) - bổ sung lessons
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(3, 'CSS Grid Layout', 'Sử dụng CSS Grid để tạo layout phức tạp.', '/videos/css-grid.mp4', 1080, FALSE, 3),
(3, 'Position và Z-index', 'Hiểu về CSS positioning và z-index.', '/videos/css-position.mp4', 900, FALSE, 4);

-- Chapter 4: Responsive Design (chapter_id = 4) - bổ sung lessons
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(4, 'Responsive Images và Videos', 'Tạo hình ảnh và video responsive.', '/videos/responsive-media.mp4', 720, FALSE, 2),
(4, 'Mobile First Approach', 'Phương pháp thiết kế Mobile First.', '/videos/mobile-first.mp4', 960, FALSE, 3);


-- Chapter 6: Biến và kiểu dữ liệu (chapter_id = 6)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(6, 'Khai báo biến với var, let, const', 'Phân biệt và sử dụng var, let, const trong JavaScript.', '/videos/js-variables.mp4', 720, TRUE, 1),
(6, 'Kiểu dữ liệu cơ bản', 'Number, String, Boolean, undefined, null trong JavaScript.', '/videos/js-datatypes.mp4', 840, FALSE, 2),
(6, 'Objects và Arrays', 'Làm việc với đối tượng và mảng trong JavaScript.', '/videos/js-objects-arrays.mp4', 960, FALSE, 3);

-- Chapter 7: Hàm trong JavaScript (chapter_id = 7)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(7, 'Function Declaration vs Expression', 'Phân biệt các cách khai báo hàm trong JavaScript.', '/videos/js-functions.mp4', 780, FALSE, 1),
(7, 'Arrow Functions', 'Sử dụng arrow functions trong ES6.', '/videos/js-arrow-functions.mp4', 600, FALSE, 2),
(7, 'Callback Functions', 'Hiểu về callback functions và cách sử dụng.', '/videos/js-callbacks.mp4', 840, FALSE, 3);

-- Chapter 8: DOM và sự kiện (chapter_id = 8)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(8, 'DOM Manipulation', 'Thao tác với DOM elements bằng JavaScript.', '/videos/js-dom-manipulation.mp4', 900, FALSE, 1),
(8, 'Event Handling', 'Xử lý các sự kiện trong JavaScript.', '/videos/js-events.mp4', 780, FALSE, 2),
(8, 'Event Delegation', 'Kỹ thuật Event Delegation và bubbling.', '/videos/js-event-delegation.mp4', 720, FALSE, 3);

-- Node.js & ExpressJS - Bổ sung lessons
-- Chapter 9: Giới thiệu Node.js (chapter_id = 9) - thêm lessons

INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(9, 'Node.js là gì?', 'Giới thiệu về Node.js và runtime environment.', '/videos/nodejs-intro.mp4', 600, TRUE, 1),
(9, 'NPM và Package Management', 'Sử dụng NPM để quản lý packages.', '/videos/npm-basics.mp4', 720, TRUE, 2),
(9, 'Modules trong Node.js', 'CommonJS modules và ES6 modules.', '/videos/nodejs-modules.mp4', 840, FALSE, 3);

-- Chapter 10: Express.js cơ bản (chapter_id = 10)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(10, 'Express.js Setup', 'Cài đặt và cấu hình Express.js.', '/videos/express-setup.mp4', 480, TRUE, 1),
(10, 'Routing cơ bản', 'Tạo routes cơ bản trong Express.', '/videos/express-routing.mp4', 720, FALSE, 2),
(10, 'Middleware Functions', 'Sử dụng middleware trong Express.', '/videos/express-middleware.mp4', 840, FALSE, 3);

-- Chapter 11: RESTful API (chapter_id = 11)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(11, 'REST API Principles', 'Nguyên tắc thiết kế RESTful API.', '/videos/rest-principles.mp4', 660, FALSE, 1),
(11, 'HTTP Methods và Status Codes', 'GET, POST, PUT, DELETE và response codes.', '/videos/http-methods.mp4', 780, FALSE, 2),
(11, 'API Testing với Postman', 'Test API endpoints với Postman.', '/videos/api-testing.mp4', 600, FALSE, 3);

-- Chapter 12: MongoDB với Node.js (chapter_id = 12)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(12, 'MongoDB Introduction', 'Giới thiệu về MongoDB NoSQL database.', '/videos/mongodb-intro.mp4', 720, FALSE, 1),
(12, 'Mongoose ODM', 'Sử dụng Mongoose để kết nối MongoDB.', '/videos/mongoose.mp4', 900, FALSE, 2),
(12, 'CRUD Operations', 'Create, Read, Update, Delete với MongoDB.', '/videos/mongodb-crud.mp4', 1080, FALSE, 3);

-- Bổ sung lessons cho các khóa học mới đã tạo

-- Responsive Web Design - Bổ sung chapters 2-5
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
-- Chapter 16: Media Queries nâng cao
(16, 'Breakpoints Strategy', 'Chiến lược thiết kế breakpoints hiệu quả.', '/videos/breakpoints-strategy.mp4', 660, FALSE, 1),
(16, 'Print Media Queries', 'Tạo CSS cho print media.', '/videos/print-media.mp4', 480, FALSE, 2),
(16, 'Device Orientation', 'Xử lý thay đổi orientation của device.', '/videos/device-orientation.mp4', 540, FALSE, 3);

-- Chapter 17: Flexible Grid Systems
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(17, 'CSS Grid vs Flexbox', 'So sánh và khi nào sử dụng Grid vs Flexbox.', '/videos/grid-vs-flexbox.mp4', 720, FALSE, 1),
(17, 'Bootstrap Grid System', 'Sử dụng Bootstrap grid system.', '/videos/bootstrap-grid.mp4', 840, FALSE, 2),
(17, 'Custom Grid Framework', 'Tạo grid system tùy chỉnh.', '/videos/custom-grid.mp4', 960, FALSE, 3);

-- Chapter 18: Responsive Images
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(18, 'Picture Element và srcset', 'Sử dụng picture element cho responsive images.', '/videos/picture-element.mp4', 600, FALSE, 1),
(18, 'WebP và Image Optimization', 'Tối ưu hóa hình ảnh cho web.', '/videos/image-optimization.mp4', 720, FALSE, 2),
(18, 'Lazy Loading Images', 'Kỹ thuật lazy loading cho images.', '/videos/lazy-loading.mp4', 480, FALSE, 3);

-- HTML CSS Pro - Bổ sung lessons cho các chapters
-- Chapter 19: CSS Architecture
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(19, 'BEM Methodology', 'Sử dụng BEM naming convention.', '/videos/bem-methodology.mp4', 720, FALSE, 1),
(19, 'SMACSS và OOCSS', 'Các phương pháp tổ chức CSS.', '/videos/css-methodologies.mp4', 840, FALSE, 2),
(19, 'CSS Variables', 'Sử dụng CSS custom properties.', '/videos/css-variables.mp4', 600, FALSE, 3);

-- Chapter 20: CSS Grid Layout
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(20, 'Grid Container và Grid Items', 'Cơ bản về CSS Grid layout.', '/videos/grid-basics.mp4', 900, FALSE, 1),
(20, 'Grid Template Areas', 'Sử dụng grid template areas.', '/videos/grid-template-areas.mp4', 720, FALSE, 2),
(20, 'Auto-fit và Auto-fill', 'Tạo responsive grid với auto-fit/fill.', '/videos/grid-auto.mp4', 660, FALSE, 3);

-- Chapter 21: CSS Animations
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(21, 'Keyframes và Animations', 'Tạo animations với CSS keyframes.', '/videos/css-keyframes.mp4', 840, FALSE, 1),
(21, 'Transitions và Transform', 'CSS transitions và transform properties.', '/videos/css-transitions.mp4', 720, FALSE, 2),
(21, 'Performance Considerations', 'Tối ưu performance cho CSS animations.', '/videos/animation-performance.mp4', 600, FALSE, 3);

-- Chapter 22: Dự án The Band
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(22, 'Phân tích thiết kế The Band', 'Phân tích layout và components.', '/videos/theband-analysis.mp4', 900, FALSE, 1),
(22, 'Header và Navigation', 'Xây dựng header với navigation menu.', '/videos/theband-header.mp4', 1200, FALSE, 2),
(22, 'Hero Section', 'Tạo hero section với background image.', '/videos/theband-hero.mp4', 1080, FALSE, 3),
(22, 'About Section', 'Xây dựng about section với team members.', '/videos/theband-about.mp4', 1440, FALSE, 4),
(22, 'Tour Section', 'Tạo tour dates section.', '/videos/theband-tour.mp4', 1200, FALSE, 5),
(22, 'Contact Form', 'Xây dựng contact form responsive.', '/videos/theband-contact.mp4', 960, FALSE, 6);

-- Thêm các khóa học còn thiếu từ fullstack.edu.vn

INSERT INTO courses (title, slug, description, thumbnail_url, category_id, instructor_id, price, discount_price, level, status) VALUES

-- Thêm khóa học về TypeScript
('TypeScript từ Cơ Bản đến Nâng Cao', 'typescript-tu-co-ban-den-nang-cao', 'Học TypeScript để viết JavaScript an toàn hơn với static typing. Từ cú pháp cơ bản đến advanced types, generics và decorators.', '/images/courses/typescript.jpg', 1, 3, 1390000.00, 1090000.00, 'intermediate', 'published'),

-- Thêm khóa học về Vue.js
('Vue.js từ Cơ Bản đến Nâng Cao', 'vuejs-tu-co-ban-den-nang-cao', 'Học Vue.js framework từ cơ bản đến nâng cao. Vue 3 Composition API, Vuex, Vue Router và xây dựng SPA.', '/images/courses/vuejs.jpg', 1, 3, 1590000.00, 1290000.00, 'intermediate', 'published'),

-- Thêm khóa học về Next.js
('Next.js & Nuxt.js', 'nextjs-nuxtjs', 'Học các framework full-stack: Next.js cho React và Nuxt.js cho Vue. SSR, SSG, API routes và deployment.', '/images/courses/nextjs-nuxtjs.jpg', 1, 3, 1890000.00, 1590000.00, 'advanced', 'published'),

-- Thêm khóa học về Python
('Python từ Cơ Bản đến Nâng Cao', 'python-tu-co-ban-den-nang-cao', 'Học Python programming từ cơ bản đến nâng cao. OOP, web development với Django/Flask, data science cơ bản.', '/images/courses/python.jpg', 2, 4, 1690000.00, 1390000.00, 'beginner', 'published'),

-- Thêm khóa học về Java
('Java Core & Spring Boot', 'java-core-spring-boot', 'Học Java programming và Spring Boot framework để phát triển enterprise applications.', '/images/courses/java-spring.jpg', 2, 4, 1990000.00, 1690000.00, 'intermediate', 'published'),

-- Thêm khóa học về Testing
('Unit Testing & Test-Driven Development', 'unit-testing-tdd', 'Học cách viết unit tests, integration tests với Jest, Mocha, JUnit. TDD methodology và best practices.', '/images/courses/testing.jpg', 4, 4, 1290000.00, 990000.00, 'intermediate', 'published'),

-- Thêm khóa học về AWS
('AWS Cloud Fundamentals', 'aws-cloud-fundamentals', 'Học các dịch vụ cơ bản của Amazon Web Services: EC2, S3, RDS, Lambda và cách deploy applications.', '/images/courses/aws.jpg', 4, 4, 1790000.00, 1490000.00, 'intermediate', 'published'),

-- Thêm khóa học về GraphQL
('GraphQL với Apollo', 'graphql-voi-apollo', 'Tìm hiểu về GraphQL query language và Apollo Client/Server để xây dựng APIs hiệu quả.', '/images/courses/graphql.jpg', 2, 3, 1490000.00, 1190000.00, 'advanced', 'published'),

-- Thêm khóa học về Microservices
('Microservices Architecture', 'microservices-architecture', 'Thiết kế và triển khai microservices với Docker, Kubernetes, API Gateway và service discovery.', '/images/courses/microservices.jpg', 4, 4, 2190000.00, 1890000.00, 'advanced', 'published'),

-- Thêm khóa học về Data Structures & Algorithms
('Cấu Trúc Dữ Liệu và Giải Thuật', 'cau-truc-du-lieu-va-giai-thuat', 'Học các cấu trúc dữ liệu cơ bản và algorithms, phân tích độ phức tạp, chuẩn bị cho coding interviews.', '/images/courses/dsa.jpg', 2, 4, 1590000.00, 1290000.00, 'intermediate', 'published'),

-- Thêm khóa học về UI/UX
('UI/UX Design Fundamentals', 'ui-ux-design-fundamentals', 'Học thiết kế giao diện và trải nghiệm người dùng với Figma, design principles và usability testing.', '/images/courses/ui-ux.jpg', 1, 2, 1390000.00, 1090000.00, 'beginner', 'published'),

-- Thêm khóa học về Blockchain
('Blockchain & Smart Contracts', 'blockchain-smart-contracts', 'Tìm hiểu về blockchain technology, cryptocurrency và phát triển smart contracts với Solidity.', '/images/courses/blockchain.jpg', 2, 4, 2490000.00, 2190000.00, 'advanced', 'published');

-- Thêm chapters cho các khóa học mới

INSERT INTO chapters (course_id, title, position) VALUES
-- TypeScript (course_id = 24)
(24, 'TypeScript Fundamentals', 1),
(24, 'Advanced Types', 2),
(24, 'Generics và Constraints', 3),
(24, 'Decorators và Metadata', 4),
(24, 'TypeScript với React', 5),

-- Vue.js (course_id = 25)
(25, 'Vue.js Cơ bản', 1),
(25, 'Vue 3 Composition API', 2),
(25, 'Vuex State Management', 3),
(25, 'Vue Router', 4),
(25, 'Vue.js Best Practices', 5),

-- Next.js & Nuxt.js (course_id = 26)
(26, 'Next.js Fundamentals', 1),
(26, 'Server-Side Rendering', 2),
(26, 'API Routes và Authentication', 3),
(26, 'Nuxt.js với Vue', 4),
(26, 'Deployment và Optimization', 5),

-- Python (course_id = 27)
(27, 'Python Basics', 1),
(27, 'Object-Oriented Programming', 2),
(27, 'Web Development với Flask', 3),
(27, 'Django Framework', 4),
(27, 'Data Science với Python', 5),

-- Java & Spring Boot (course_id = 28)
(28, 'Java Core Programming', 1),
(28, 'Spring Framework', 2),
(28, 'Spring Boot Applications', 3),
(28, 'Spring Data JPA', 4),
(28, 'Microservices với Spring', 5),

-- Unit Testing (course_id = 29)
(29, 'Testing Fundamentals', 1),
(29, 'JavaScript Testing với Jest', 2),
(29, 'React Testing Library', 3),
(29, 'Backend Testing', 4),
(29, 'Test-Driven Development', 5),

-- AWS (course_id = 30)
(30, 'AWS Overview và IAM', 1),
(30, 'EC2 và VPC', 2),
(30, 'S3 và CloudFront', 3),
(30, 'RDS và DynamoDB', 4),
(30, 'Lambda và Serverless', 5),

-- GraphQL (course_id = 31)
(31, 'GraphQL Fundamentals', 1),
(31, 'Schema Design', 2),
(31, 'Apollo Server', 3),
(31, 'Apollo Client', 4),
(31, 'GraphQL với React', 5),

-- Microservices (course_id = 32)
(32, 'Microservices Patterns', 1),
(32, 'Service Communication', 2),
(32, 'API Gateway', 3),
(32, 'Docker và Containerization', 4),
(32, 'Kubernetes Orchestration', 5),

-- DSA (course_id = 33)
(33, 'Arrays và Strings', 1),
(33, 'Linked Lists và Stacks', 2),
(33, 'Trees và Graphs', 3),
(33, 'Sorting Algorithms', 4),
(33, 'Dynamic Programming', 5),

-- UI/UX (course_id = 34)
(34, 'Design Principles', 1),
(34, 'User Research', 2),
(34, 'Wireframing và Prototyping', 3),
(34, 'Figma Design Tool', 4),
(34, 'Usability Testing', 5),

-- Blockchain (course_id = 35)
(35, 'Blockchain Basics', 1),
(35, 'Cryptocurrency Fundamentals', 2),
(35, 'Ethereum và Smart Contracts', 3),
(35, 'Solidity Programming', 4),
(35, 'DApps Development', 5);

-- Thêm lessons mẫu cho một số khóa học mới



-- TypeScript Fundamentals (chapter_id = 40)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(40, 'TypeScript là gì?', 'Giới thiệu về TypeScript và lợi ích của static typing.', '/videos/typescript-intro.mp4', 600, TRUE, 1),
(40, 'Cài đặt TypeScript', 'Hướng dẫn cài đặt và cấu hình TypeScript.', '/videos/typescript-setup.mp4', 480, TRUE, 2),
(40, 'Basic Types', 'Các kiểu dữ liệu cơ bản trong TypeScript.', '/videos/typescript-basic-types.mp4', 720, FALSE, 3),
(40, 'Interfaces', 'Sử dụng interfaces để định nghĩa contracts.', '/videos/typescript-interfaces.mp4', 840, FALSE, 4);

-- Vue.js Cơ bản (chapter_id = 41)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(41, 'Vue.js Introduction', 'Giới thiệu về Vue.js framework.', '/videos/vuejs-intro.mp4', 660, TRUE, 1),
(41, 'Vue Instance và Reactivity', 'Hiểu về Vue instance và reactivity system.', '/videos/vuejs-reactivity.mp4', 720, TRUE, 2),
(41, 'Template Syntax', 'Cú pháp template trong Vue.js.', '/videos/vuejs-template.mp4', 600, FALSE, 3),
(41, 'Components Basics', 'Tạo và sử dụng components trong Vue.', '/videos/vuejs-components.mp4', 900, FALSE, 4);

-- Next.js Fundamentals (chapter_id = 46)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(46, 'Next.js Overview', 'Giới thiệu về Next.js React framework.', '/videos/nextjs-intro.mp4', 540, TRUE, 1),
(46, 'Pages và Routing', 'File-based routing trong Next.js.', '/videos/nextjs-routing.mp4', 720, TRUE, 2),
(46, 'Static Generation vs SSR', 'So sánh Static Generation và Server-side Rendering.', '/videos/nextjs-rendering.mp4', 840, FALSE, 3);

-- Python Basics (chapter_id = 51)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(51, 'Python Introduction', 'Giới thiệu về Python programming language.', '/videos/python-intro.mp4', 600, TRUE, 1),
(51, 'Variables và Data Types', 'Biến và kiểu dữ liệu trong Python.', '/videos/python-variables.mp4', 720, TRUE, 2),
(51, 'Control Structures', 'If/else, loops trong Python.', '/videos/python-control.mp4', 840, FALSE, 3),
(51, 'Functions và Modules', 'Định nghĩa functions và sử dụng modules.', '/videos/python-functions.mp4', 780, FALSE, 4);

-- Testing Fundamentals (chapter_id = 56)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(56, 'Why Testing Matters', 'Tầm quan trọng của testing trong phát triển phần mềm.', '/videos/testing-importance.mp4', 480, TRUE, 1),
(56, 'Types of Testing', 'Unit testing, integration testing, e2e testing.', '/videos/testing-types.mp4', 600, TRUE, 2),
(56, 'Testing Pyramid', 'Mô hình testing pyramid và best practices.', '/videos/testing-pyramid.mp4', 540, FALSE, 3);

-- AWS Overview (chapter_id = 61)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(61, 'Cloud Computing Basics', 'Giới thiệu về cloud computing và AWS.', '/videos/aws-cloud-basics.mp4', 720, TRUE, 1),
(61, 'AWS Global Infrastructure', 'Regions, Availability Zones trong AWS.', '/videos/aws-infrastructure.mp4', 600, TRUE, 2),
(61, 'IAM - Identity and Access Management', 'Quản lý users, groups, roles trong AWS.', '/videos/aws-iam.mp4', 900, FALSE, 3);

-- UI/UX Design Principles (chapter_id = 71)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(71, 'What is UI/UX Design?', 'Phân biệt UI và UX design.', '/videos/ui-ux-intro.mp4', 540, TRUE, 1),
(71, 'Design Thinking Process', 'Quy trình design thinking trong UX.', '/videos/design-thinking.mp4', 720, TRUE, 2),
(71, 'Color Theory', 'Lý thuyết màu sắc trong thiết kế.', '/videos/color-theory.mp4', 600, FALSE, 3),
(71, 'Typography Basics', 'Cơ bản về typography trong UI design.', '/videos/typography-basics.mp4', 660, FALSE, 4);

-- Thêm tags mới cho các khóa học
INSERT INTO tags (name, slug) VALUES
('TypeScript', 'typescript'),
('Vue', 'vue'),
('Next.js', 'nextjs'),
('Nuxt.js', 'nuxtjs'),
('Python', 'python'),
('Django', 'django'),
('Flask', 'flask'),
('Java', 'java'),
('Spring Boot', 'spring-boot'),
('Testing', 'testing'),
('Jest', 'jest'),
('AWS', 'aws'),
('Cloud', 'cloud'),
('GraphQL', 'graphql'),
('Apollo', 'apollo'),
('Microservices', 'microservices'),
('Kubernetes', 'kubernetes'),
('Data Structures', 'data-structures'),
('Algorithms', 'algorithms'),
('UI Design', 'ui-design'),
('UX Design', 'ux-design'),
('Figma', 'figma'),
('Blockchain', 'blockchain'),
('Solidity', 'solidity'),
('Smart Contracts', 'smart-contracts');

-- Thêm course tags cho các khóa học mới
INSERT INTO course_tags (course_id, tag_id) VALUES
-- TypeScript
(24, 13), (24, 3), (24, 11),
-- Vue.js
(25, 14), (25, 11),
-- Next.js & Nuxt.js
(26, 15), (26, 16), (26, 4), (26, 14),
-- Python
(27, 17), (27, 18), (27, 19), (27, 12),
-- Java & Spring Boot
(28, 20), (28, 21), (28, 12),
-- Testing
(29, 22), (29, 23), (29, 11), (29, 12),
-- AWS
(30, 24), (30, 25), (30, 12),
-- GraphQL
(31, 26), (31, 27), (31, 12),
-- Microservices
(32, 28), (32, 29), (32, 9), (32, 12),
-- DSA
(33, 30), (33, 31),
-- UI/UX
(34, 32), (34, 33), (34, 34),
-- Blockchain
(35, 35), (35, 36), (35, 37);

-- Thêm một số blog posts mới
INSERT INTO blog_posts (title, slug, content, author_id, featured_image, status, view_count) VALUES
('Lộ trình học Backend Developer 2024', 'lo-trinh-hoc-backend-developer-2024', 'Hướng dẫn chi tiết lộ trình học để trở thành Backend Developer chuyên nghiệp. Từ cơ sở dữ liệu, API design đến microservices và cloud deployment.', 4, '/images/blog/backend-roadmap-2024.jpg', 'published', 2100),
('TypeScript vs JavaScript: Khi nào nên sử dụng?', 'typescript-vs-javascript-khi-nao-nen-su-dung', 'So sánh chi tiết giữa TypeScript và JavaScript, ưu nhược điểm và trường hợp nên áp dụng TypeScript trong dự án.', 3, '/images/blog/typescript-vs-js.jpg', 'published', 1800),
('Microservices vs Monolithic: Lựa chọn kiến trúc phù hợp', 'microservices-vs-monolithic-lua-chon-kien-truc-phu-hop', 'Phân tích ưu nhược điểm của kiến trúc Microservices và Monolithic, giúp bạn đưa ra quyết định đúng đắn cho dự án.', 4, '/images/blog/microservices-vs-monolithic.jpg', 'published', 1650),
('Xu hướng phát triển web năm 2024', 'xu-huong-phat-trien-web-nam-2024', 'Tổng quan về các xu hướng công nghệ web mới nhất: JAMstack, Web3, AI integration, và performance optimization.', 2, '/images/blog/web-trends-2024.jpg', 'published', 2300),
('Cách tối ưu hiệu suất website', 'cach-toi-uu-hieu-suat-website', 'Hướng dẫn các kỹ thuật tối ưu hiệu suất website: image optimization, code splitting, lazy loading, và caching strategies.', 3, '/images/blog/web-performance.jpg', 'published', 1900);

-- Thêm tags cho blog posts mới
INSERT INTO post_tags (post_id, tag_id) VALUES
(5, 12), (5, 5), (5, 7), (5, 28),
(6, 13), (6, 3), (6, 11),
(7, 28), (7, 12),
(8, 11), (8, 12), (8, 4), (8, 35),
(9, 11), (9, 12), (9, 10);

-- Thêm comments cho blog posts mới
INSERT INTO comments (post_id, user_id, content) VALUES
(5, 5, 'Lộ trình backend rất chi tiết và thực tế. Mình đang theo đúng roadmap này.'),
(5, 6, 'Cảm ơn tác giả đã chia sẻ kinh nghiệm quý báu. Phần về microservices rất hữu ích.'),
(5, 7, 'Mình mới bắt đầu học backend, bài viết này giúp mình định hướng rõ ràng hơn.'),
(6, 5, 'TypeScript thực sự giúp mình tránh được nhiều lỗi runtime. Recommend mọi người nên học.'),
(6, 6, 'Bài viết so sánh rất khách quan. Mình quyết định chuyển sang TypeScript cho dự án mới.'),
(7, 7, 'Microservices phù hợp với startup không? Hay nên bắt đầu với monolithic trước?'),
(7, 5, 'Theo kinh nghiệm mình thì startup nên bắt đầu với monolithic, sau đó mới migrate sang microservices.'),
(8, 6, 'Bài viết rất hay, cập nhật các trend mới nhất. Đặc biệt quan tâm đến phần AI integration.'),
(8, 7, 'Web3 có thực sự là tương lai không? Mình thấy vẫn còn nhiều thách thức.'),
(9, 5, 'Performance optimization là chủ đề rất quan trọng. Mình đã áp dụng lazy loading và thấy hiệu quả rõ rệt.');

-- Thêm enrollments cho các khóa học mới
INSERT INTO enrollments (user_id, course_id, status, progress) VALUES
(5, 24, 'active', 15.00),  -- TypeScript
(5, 25, 'active', 25.00),  -- Vue.js
(6, 26, 'active', 10.00),  -- Next.js & Nuxt.js
(6, 27, 'active', 40.00),  -- Python
(7, 28, 'active', 20.00),  -- Java & Spring Boot
(7, 29, 'active', 35.00),  -- Testing
(5, 30, 'active', 5.00),   -- AWS
(6, 31, 'active', 30.00),  -- GraphQL
(7, 34, 'active', 50.00);  -- UI/UX Design

-- Thêm reviews cho các khóa học mới
INSERT INTO reviews (course_id, user_id, rating, comment) VALUES
(24, 5, 5, 'TypeScript được giảng dạy rất hay, từ cơ bản đến nâng cao. Giúp mình viết code JavaScript an toàn hơn.'),
(25, 6, 4, 'Vue.js framework rất dễ học so với React. Khóa học này giúp mình hiểu rõ Composition API.'),
(27, 7, 5, 'Python là ngôn ngữ tuyệt vời để bắt đầu lập trình. Khóa học từ cơ bản đến web development rất đầy đủ.'),
(29, 5, 4, 'Testing là kỹ năng quan trọng mà nhiều developer bỏ qua. Khóa học này thay đổi cách mình code.'),
(34, 6, 5, 'UI/UX design rất cần thiết cho frontend developer. Học xong mình thiết kế interface đẹp hơn nhiều.');

-- Thêm notifications cho users
INSERT INTO notifications (user_id, title, message, is_read, notification_type, related_id) VALUES
(5, 'Khóa học TypeScript mới', 'Khóa học "TypeScript từ Cơ Bản đến Nâng Cao" đã được cập nhật nội dung mới về Advanced Types.', FALSE, 'course_update', 24),
(6, 'Hoàn thành milestone', 'Chúc mừng! Bạn đã hoàn thành 40% khóa học Python. Tiếp tục học tập nhé!', FALSE, 'progress', 27),
(7, 'Khóa học mới ra mắt', 'Khóa học "Blockchain & Smart Contracts" vừa được ra mắt. Đăng ký ngay để nhận ưu đãi!', FALSE, 'course', 35),
(5, 'Reminder học tập', 'Bạn chưa truy cập khóa học AWS trong 3 ngày. Hãy tiếp tục học để không quên kiến thức!', FALSE, 'reminder', 30),
(6, 'Bình luận mới', 'Có người đã trả lời bình luận của bạn trong bài viết "TypeScript vs JavaScript".', TRUE, 'comment', 6);

-- Bổ sung lessons cho các chapters còn thiếu

-- JavaScript Nâng Cao - Chapter 2: Prototype và Inheritance (chapter_id = 20)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(20, 'Prototype Chain', 'Hiểu về prototype chain và cách JavaScript inheritance hoạt động.', '/videos/js-prototype-chain.mp4', 900, FALSE, 1),
(20, 'Constructor Functions', 'Sử dụng constructor functions để tạo objects.', '/videos/js-constructors.mp4', 720, FALSE, 2),
(20, 'ES6 Classes', 'Sử dụng ES6 class syntax để thay thế constructor functions.', '/videos/js-es6-classes.mp4', 840, FALSE, 3),
(20, 'Inheritance Patterns', 'Các pattern inheritance trong JavaScript.', '/videos/js-inheritance-patterns.mp4', 960, FALSE, 4);

-- JavaScript Nâng Cao - Chapter 3: Asynchronous JavaScript (chapter_id = 21)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
 (21, 'Callbacks và Callback Hell', 'Hiểu về callbacks và vấn đề callback hell.', '/videos/js-callbacks-hell.mp4', 780, FALSE, 1),
(21, 'Promises', 'Sử dụng Promises để xử lý asynchronous operations.', '/videos/js-promises.mp4', 900, FALSE, 2),
(21, 'Async/Await', 'Cú pháp async/await để viết asynchronous code dễ đọc hơn.', '/videos/js-async-await.mp4', 840, FALSE, 3),
(21, 'Error Handling', 'Xử lý lỗi trong asynchronous JavaScript.', '/videos/js-async-error-handling.mp4', 720, FALSE, 4);

-- JavaScript Nâng Cao - Chapter 4: Design Patterns (chapter_id = 22)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(22, 'Module Pattern', 'Sử dụng module pattern để tổ chức code.', '/videos/js-module-pattern.mp4', 840, FALSE, 1),
(22, 'Observer Pattern', 'Implement observer pattern trong JavaScript.', '/videos/js-observer-pattern.mp4', 900, FALSE, 2),
(22, 'Singleton Pattern', 'Tạo và sử dụng singleton pattern.', '/videos/js-singleton-pattern.mp4', 660, FALSE, 3),
(22, 'Factory Pattern', 'Sử dụng factory pattern để tạo objects.', '/videos/js-factory-pattern.mp4', 720, FALSE, 4);

-- React Website - Chapter 1: React Fundamentals (chapter_id = 24)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(24, 'React Ecosystem Overview', 'Tổng quan về hệ sinh thái React và các tools.', '/videos/react-ecosystem.mp4', 720, FALSE, 1),
(24, 'JSX Deep Dive', 'Hiểu sâu về JSX syntax và cách nó hoạt động.', '/videos/react-jsx-deep.mp4', 840, FALSE, 2),
(24, 'Props và State', 'Sự khác biệt giữa props và state trong React.', '/videos/react-props-state.mp4', 900, FALSE, 3);

-- React Website - Chapter 2: React Hooks (chapter_id = 25)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(25, 'useState Hook', 'Quản lý state với useState hook.', '/videos/react-usestate.mp4', 720, FALSE, 1),
(25, 'useEffect Hook', 'Side effects với useEffect hook.', '/videos/react-useeffect.mp4', 900, FALSE, 2),
(25, 'Custom Hooks', 'Tạo và sử dụng custom hooks.', '/videos/react-custom-hooks.mp4', 840, FALSE, 3),
(25, 'useContext Hook', 'Chia sẻ data với useContext hook.', '/videos/react-usecontext.mp4', 780, FALSE, 4);

-- React Website - Chapter 3: State Management (chapter_id = 26)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(26, 'State Management Patterns', 'Các pattern quản lý state trong React.', '/videos/react-state-patterns.mp4', 660, FALSE, 1),
(26, 'Redux Toolkit', 'Sử dụng Redux Toolkit để quản lý state.', '/videos/react-redux-toolkit.mp4', 1200, FALSE, 2),
(26, 'Zustand', 'State management đơn giản với Zustand.', '/videos/react-zustand.mp4', 840, FALSE, 3);

-- React Website - Chapter 4: React Router (chapter_id = 27)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(27, 'Client-side Routing', 'Hiểu về client-side routing trong SPA.', '/videos/react-router-concepts.mp4', 600, FALSE, 1),
(27, 'React Router Setup', 'Cài đặt và cấu hình React Router.', '/videos/react-router-setup.mp4', 720, FALSE, 2),
(27, 'Dynamic Routes', 'Tạo dynamic routes với parameters.', '/videos/react-router-dynamic.mp4', 840, FALSE, 3),
(27, 'Route Guards', 'Bảo vệ routes với authentication.', '/videos/react-router-guards.mp4', 900, FALSE, 4);

-- Express.js - Chapter 2: Routing và Middleware (chapter_id = 25)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(25, 'Advanced Routing', 'Route parameters, query strings, và route handlers.', '/videos/express-advanced-routing.mp4', 840, FALSE, 1),
(25, 'Middleware Types', 'Application-level, router-level, và error-handling middleware.', '/videos/express-middleware-types.mp4', 960, FALSE, 2),
(25, 'Custom Middleware', 'Tạo custom middleware functions.', '/videos/express-custom-middleware.mp4', 720, FALSE, 3);

-- Express.js - Chapter 3: Template Engines (chapter_id = 26)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(26, 'EJS Template Engine', 'Sử dụng EJS để render dynamic HTML.', '/videos/express-ejs.mp4', 840, FALSE, 1),
(26, 'Handlebars Template', 'Sử dụng Handlebars template engine.', '/videos/express-handlebars.mp4', 780, FALSE, 2),
(26, 'Template Best Practices', 'Best practices khi sử dụng template engines.', '/videos/express-template-best-practices.mp4', 600, FALSE, 3);

-- Express.js - Chapter 4: Error Handling (chapter_id = 27)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(27, 'Error Handling Basics', 'Cơ bản về error handling trong Express.', '/videos/express-error-basics.mp4', 660, FALSE, 1),
(27, 'Custom Error Classes', 'Tạo custom error classes.', '/videos/express-custom-errors.mp4', 720, FALSE, 2),
(27, 'Global Error Handler', 'Tạo global error handling middleware.', '/videos/express-global-error.mp4', 840, FALSE, 3);

-- Flutter - Chapter 3: Widgets và UI Design (chapter_id = 29)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(29, 'Stateless vs Stateful Widgets', 'Sự khác biệt và khi nào sử dụng mỗi loại.', '/videos/flutter-widgets-types.mp4', 720, FALSE, 1),
(29, 'Layout Widgets', 'Container, Row, Column, Stack widgets.', '/videos/flutter-layout-widgets.mp4', 900, FALSE, 2),
(29, 'Material Design Widgets', 'Sử dụng Material Design widgets.', '/videos/flutter-material-widgets.mp4', 840, FALSE, 3),
(29, 'Custom Widgets', 'Tạo custom widgets và reusable components.', '/videos/flutter-custom-widgets.mp4', 960, FALSE, 4);

-- Flutter - Chapter 4: State Management (chapter_id = 30)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(30, 'setState() Method', 'Quản lý state cơ bản với setState.', '/videos/flutter-setstate.mp4', 600, FALSE, 1),
(30, 'Provider Pattern', 'State management với Provider package.', '/videos/flutter-provider.mp4', 900, FALSE, 2),
(30, 'BLoC Pattern', 'Business Logic Component pattern.', '/videos/flutter-bloc.mp4', 1080, FALSE, 3),
(30, 'Riverpod', 'Modern state management với Riverpod.', '/videos/flutter-riverpod.mp4', 840, FALSE, 4);

-- SASS/SCSS - Chapter 2: Variables và Mixins (chapter_id = 36)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(36, 'SASS Variables', 'Sử dụng variables để tái sử dụng values.', '/videos/sass-variables.mp4', 540, FALSE, 1),
(36, 'Mixins Basics', 'Tạo và sử dụng mixins trong SASS.', '/videos/sass-mixins-basics.mp4', 720, FALSE, 2),
(36, 'Mixins với Parameters', 'Tạo mixins với parameters và default values.', '/videos/sass-mixins-params.mp4', 660, FALSE, 3),
(36, 'Extend/Inheritance', 'Extend selectors để tái sử dụng styles.', '/videos/sass-extend.mp4', 600, FALSE, 4);

-- SASS/SCSS - Chapter 3: Functions và Control Directives (chapter_id = 37)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(37, 'SASS Functions', 'Built-in functions và custom functions.', '/videos/sass-functions.mp4', 780, FALSE, 1),
(37, '@if và @else Directives', 'Conditional logic trong SASS.', '/videos/sass-conditionals.mp4', 660, FALSE, 2),
(37, '@for và @each Loops', 'Loops trong SASS để generate styles.', '/videos/sass-loops.mp4', 720, FALSE, 3),
(37, 'Maps và Lists', 'Sử dụng data structures trong SASS.', '/videos/sass-data-structures.mp4', 840, FALSE, 4);

-- TypeScript - Chapter 2: Advanced Types (chapter_id = 41)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(41, 'Union và Intersection Types', 'Kết hợp types với union và intersection.', '/videos/typescript-union-intersection.mp4', 720, FALSE, 1),
(41, 'Type Guards', 'Sử dụng type guards để narrow types.', '/videos/typescript-type-guards.mp4', 660, FALSE, 2),
(41, 'Conditional Types', 'Tạo types dựa trên conditions.', '/videos/typescript-conditional-types.mp4', 840, FALSE, 3),
(41, 'Utility Types', 'Sử dụng built-in utility types.', '/videos/typescript-utility-types.mp4', 780, FALSE, 4);

-- TypeScript - Chapter 3: Generics và Constraints (chapter_id = 42)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(42, 'Generic Functions', 'Tạo reusable functions với generics.', '/videos/typescript-generic-functions.mp4', 720, FALSE, 1),
(42, 'Generic Classes', 'Sử dụng generics với classes.', '/videos/typescript-generic-classes.mp4', 840, FALSE, 2),
(42, 'Generic Constraints', 'Giới hạn generic types với constraints.', '/videos/typescript-generic-constraints.mp4', 780, FALSE, 3),
(42, 'Mapped Types', 'Tạo new types từ existing types.', '/videos/typescript-mapped-types.mp4', 900, FALSE, 4);

-- Vue.js - Chapter 2: Vue 3 Composition API (chapter_id = 47)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(47, 'setup() Function', 'Sử dụng setup function trong Composition API.', '/videos/vue-setup-function.mp4', 720, FALSE, 1),
(47, 'ref() và reactive()', 'Tạo reactive data với ref và reactive.', '/videos/vue-ref-reactive.mp4', 840, FALSE, 2),
(47, 'computed() và watch()', 'Computed properties và watchers trong Composition API.', '/videos/vue-computed-watch.mp4', 780, FALSE, 3),
(47, 'Lifecycle Hooks', 'Sử dụng lifecycle hooks trong Composition API.', '/videos/vue-composition-lifecycle.mp4', 660, FALSE, 4);

-- Vue.js - Chapter 3: Vuex State Management (chapter_id = 48)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, is_free, position) VALUES
(48, 'Vuex Core Concepts', 'State, getters, mutations, actions trong Vuex.', '/videos/vuex-core-concepts.mp4', 900, FALSE, 1),
(48, 'Modules', 'Tổ chức Vuex store với modules.', '/videos/vuex-modules.mp4', 840, FALSE, 2),
(48, 'Vuex với Composition API', 'Sử dụng Vuex trong Composition API.', '/videos/vuex-composition-api.mp4', 720, FALSE, 3);


-- Cập nhật một số thông tin khóa học và bổ sung dữ liệu cuối cùng
UPDATE courses SET 
    description = 'Khóa học HTML CSS từ cơ bản đến nâng cao, bao gồm Flexbox, Grid, Responsive Design và nhiều dự án thực tế. Phù hợp cho người mới bắt đầu.'
WHERE course_id = 1;

UPDATE courses SET 
    description = 'Học Javascript từ cơ bản đến nâng cao với hơn 100 bài học. ES6+, DOM manipulation, Async/Await và các design patterns.'
WHERE course_id = 2;

-- Thêm final notifications
INSERT INTO notifications (user_id, title, message, is_read, notification_type, related_id) VALUES
(5, 'Chúc mừng thành tích', 'Bạn đã hoàn thành 5 khóa học! Tiếp tục học tập để trở thành Full-stack Developer.', FALSE, 'achievement', NULL),
(6, 'Khóa học Hot', 'Khóa học "Full-Stack JavaScript Developer" đang được nhiều người quan tâm. Đăng ký ngay!', FALSE, 'trending', 36),
(7, 'Cập nhật hệ thống', 'Hệ thống đã được cập nhật với nhiều tính năng mới. Khám phá ngay!', FALSE, 'system', NULL);

-- Tạo index cho performance
CREATE INDEX idx_lessons_chapter_position ON lessons(chapter_id, position);
CREATE INDEX idx_chapters_course_position ON chapters(course_id, position);
CREATE INDEX idx_course_tags_course ON course_tags(course_id);
CREATE INDEX idx_post_tags_post ON post_tags(post_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_reviews_course ON reviews(course_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);