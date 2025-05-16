import React from 'react';
import './Blog.css';

function BlogPage() {
  const blogs = [
    {
      id: 1,
      title: "Tổng hợp các sản phẩm của học viên tại F8",
      description: "Bài viết này nhằm tổng hợp lại các dự án mà học viên F8 đã hoàn thành và chia sẻ trên nhóm Học lập trình web F8.",
      image: "https://files.fullstack.edu.vn/f8-prod/blog_posts/65/6139fe28a9844.png",
      author: {
        name: "Sơn Đặng",
        avatar: "https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png"
      },
      publishDate: "10 tháng 4, 2023",
      readingTime: "6 phút đọc"
    },
    {
      id: 2,
      title: "Các nguồn tài nguyên hữu ích để học lập trình web",
      description: "Tổng hợp những nguồn tài liệu hữu ích cho các bạn học lập trình web từ cơ bản đến nâng cao.",
      image: "https://files.fullstack.edu.vn/f8-prod/blog_posts/279/6153f692d366e.jpg",
      author: {
        name: "Sơn Đặng",
        avatar: "https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png"
      },
      publishDate: "5 tháng 4, 2023",
      readingTime: "8 phút đọc"
    },
    {
      id: 3,
      title: "Làm việc với Terminal & Ubuntu",
      description: "Khi làm việc với lập trình và đặc biệt là backend, chúng ta sẽ phải làm việc nhiều với Terminal.",
      image: "https://files.fullstack.edu.vn/f8-prod/blog_posts/1671/61b6368983c16.jpg",
      author: {
        name: "Sơn Đặng",
        avatar: "https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png"
      },
      publishDate: "1 tháng 4, 2023",
      readingTime: "5 phút đọc"
    },
    {
      id: 4,
      title: "Cách để tạo một website với HTML, CSS và JavaScript",
      description: "Bài viết này sẽ hướng dẫn từng bước để xây dựng một trang web đơn giản sử dụng HTML, CSS và JavaScript.",
      image: "https://files.fullstack.edu.vn/f8-prod/blog_posts/51/6139c6453456e.png",
      author: {
        name: "Sơn Đặng",
        avatar: "https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png"
      },
      publishDate: "29 tháng 3, 2023",
      readingTime: "10 phút đọc"
    },
    {
      id: 5,
      title: "ReactJS là gì? Tại sao ReactJS lại phổ biến?",
      description: "ReactJS là một thư viện JavaScript phổ biến được sử dụng để xây dựng giao diện người dùng (UI).",
      image: "https://files.fullstack.edu.vn/f8-prod/blog_posts/677/615436b218d0a.png",
      author: {
        name: "Sơn Đặng",
        avatar: "https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png"
      },
      publishDate: "25 tháng 3, 2023",
      readingTime: "7 phút đọc"
    },
    {
      id: 6,
      title: "TypeScript là gì? Tại sao nên dùng TypeScript",
      description: "TypeScript là một ngôn ngữ lập trình mã nguồn mở phát triển bởi Microsoft, là một tập hợp siêu của JavaScript.",
      image: "https://files.fullstack.edu.vn/f8-prod/blog_posts/1385/61ae415cc6054.jpg",
      author: {
        name: "Sơn Đặng",
        avatar: "https://fullstack.edu.vn/static/media/f8-icon.18cd71cfcfa33566a22b.png"
      },
      publishDate: "20 tháng 3, 2023",
      readingTime: "6 phút đọc"
    }
  ];

  const topics = [
    "Tất cả", "Front-end", "Back-end", "Mobile", "UI/UX", "DevOps"
  ];

  return (
    <div className="blog-page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title">Bài viết nổi bật</h1>
          <p className="page-description">
            Tổng hợp các bài viết chia sẻ về kinh nghiệm tự học lập trình và các kỹ thuật lập trình web.
          </p>
        </div>

        <div className="topic-filter">
          {topics.map((topic, index) => (
            <button 
              key={index} 
              className={`topic-btn ${index === 0 ? 'active' : ''}`}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="blog-list">
          {blogs.map(blog => (
            <div key={blog.id} className="blog-item">
              <div className="blog-image">
                <img src={blog.image} alt={blog.title} />
              </div>
              <div className="blog-content">
                <div className="blog-author">
                  <div className="author-avatar">
                    <img src={blog.author.avatar} alt={blog.author.name} />
                  </div>
                  <span className="author-name">{blog.author.name}</span>
                </div>
                <h2 className="blog-title">{blog.title}</h2>
                <p className="blog-description">{blog.description}</p>
                <div className="blog-meta">
                  <span className="publish-date">{blog.publishDate}</span>
                  <span className="dot">·</span>
                  <span className="reading-time">{blog.readingTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">4</button>
          <button className="page-btn next">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlogPage;