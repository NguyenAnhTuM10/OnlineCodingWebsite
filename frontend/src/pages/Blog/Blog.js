import React, { useEffect, useState } from 'react';
import './Blog.css';

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const topics = ["Tất cả", "Front-end", "Back-end", "Mobile", "UI/UX", "DevOps"];

  useEffect(() => {
    fetch('http://localhost:3000/api/blogs')
      .then(res => res.json())
      .then(data => {
        console.log('✅ Blog API:', data);
        const formatted = data.map(item => ({
          id: item.post_id,
          title: item.title,
          description: item.content.slice(0, 140) + '...',
          image: item.featured_image,
          author: {
            name: item.author_name,
            avatar: '/images/avatars/default.png' // 👈 Nếu backend chưa có avatar
          },
          publishDate: new Date(item.created_at).toLocaleDateString('vi-VN'),
          readingTime: '5 phút đọc' // 👈 Có thể tính theo độ dài `content.length / 250`
        }));
        setBlogs(formatted);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Lỗi khi fetch blogs:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Đang tải blog...</p>;

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
