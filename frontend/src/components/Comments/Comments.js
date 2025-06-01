// import React from "react";
// import "./Comments.css";

// const Comments = ({ 
//   comments, 
//   newComment, 
//   setNewComment, 
//   handleAddComment 
// }) => {
//   return (
//     <div className="comments-container">
//       <h3 className="comments-title">
//         Bình luận ({comments.length})
//       </h3>

//       {/* Add Comment Form */}
//       <div className="add-comment-form">
//         <input
//           type="text"
//           value={newComment}
//           onChange={(e) => setNewComment(e.target.value)}
//           placeholder="Viết bình luận của bạn..."
//           className="comment-input"
//           onKeyPress={(e) => {
//             if (e.key === 'Enter') {
//               handleAddComment();
//             }
//           }}
//         />
//         <button
//           onClick={handleAddComment}
//           className="submit-comment-btn"
//         >
//           Gửi
//         </button>
//       </div>

//       {/* Comments List */}
//       <div className="comments-list">
//         {comments.map((comment) => (
//           <div key={comment.id} className="comment-item">
//             <img
//               src={comment.avatar}
//               alt={`${comment.user} avatar`}
//               className="comment-avatar"
//             />
//             <div className="comment-content">
//               <div className="comment-header">
//                 <span className="comment-user">{comment.user}</span>
//                 <span className="comment-time">{comment.createdAt}</span>
//               </div>
//               <p className="comment-text">{comment.content}</p>
//               <div className="comment-actions">
//                 <button className="comment-action-btn">
//                   👍 Thích ({comment.likes})
//                 </button>
//                 <button className="comment-action-btn">
//                   Trả lời
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Comments;





import React, { useState, useEffect } from "react";
import "./Comments.css";

const Comments = ({ lessonId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  // Fetch comments khi component mount hoặc lessonId thay đổi
  useEffect(() => {
    if (lessonId) {
      fetchComments();
    }
  }, [lessonId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/comments/lessons/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Lỗi khi tải bình luận');
      }
    } catch (error) {
      console.error('Lỗi fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/comments/lessons/${lessonId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newComment })
      });

      if (response.ok) {
        setNewComment("");
        await fetchComments(); // Reload comments
      } else {
        const error = await response.json();
        alert(error.message || 'Lỗi khi thêm bình luận');
      }
    } catch (error) {
      console.error('Lỗi add comment:', error);
      alert('Lỗi kết nối server');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: editContent })
      });

      if (response.ok) {
        setEditingId(null);
        setEditContent("");
        await fetchComments(); // Reload comments
      } else {
        const error = await response.json();
        alert(error.message || 'Lỗi khi cập nhật bình luận');
      }
    } catch (error) {
      console.error('Lỗi edit comment:', error);
      alert('Lỗi kết nối server');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bình luận này?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        await fetchComments(); // Reload comments
      } else {
        const error = await response.json();
        alert(error.message || 'Lỗi khi xóa bình luận');
      }
    } catch (error) {
      console.error('Lỗi delete comment:', error);
      alert('Lỗi kết nối server');
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment.comment_id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };
  if (loading) {
    return (
      <div className="comments-container">
        <div className="loading-comments">Đang tải bình luận...</div>
      </div>
    );
  }

  return (
    <div className="comments-container">
      <h3 className="comments-title">
        Bình luận ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <div className="add-comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="comment-input"
          rows="3"
        />
        <button
          onClick={handleAddComment}
          disabled={submitting || !newComment.trim()}
          className="submit-comment-btn"
        >
          {submitting ? 'Đang gửi...' : 'Gửi'}
        </button>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="no-comments">
            Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.comment_id} className="comment-item">
              <div className="comment-avatar">
                {comment.user_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="comment-content">
                <div className="comment-header">
                  <span className="comment-user">{comment.user_name}</span>
                  <span className="comment-time">{formatDate(comment.created_at)}</span>
                </div>

                {editingId === comment.comment_id ? (
                  <div className="edit-comment-form">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="edit-comment-input"
                      rows="3"
                    />
                    <div className="edit-comment-actions">
                      <button
                        onClick={() => handleEditComment(comment.comment_id)}
                        className="save-edit-btn"
                        disabled={!editContent.trim()}
                      >
                        Lưu
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="cancel-edit-btn"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="comment-text">{comment.content}</p>
                    {comment.is_owner && (
                      <div className="comment-actions">
                        <button 
                          className="comment-action-btn edit-btn"
                          onClick={() => startEdit(comment)}
                        >
                          ✏️ Sửa
                        </button>
                        <button 
                          className="comment-action-btn delete-btn"
                          onClick={() => handleDeleteComment(comment.comment_id)}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;