import React from "react";
import "./Comments.css";

const Comments = ({ 
  comments, 
  newComment, 
  setNewComment, 
  handleAddComment 
}) => {
  return (
    <div className="comments-container">
      <h3 className="comments-title">
        Bình luận ({comments.length})
      </h3>

      {/* Add Comment Form */}
      <div className="add-comment-form">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="comment-input"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddComment();
            }
          }}
        />
        <button
          onClick={handleAddComment}
          className="submit-comment-btn"
        >
          Gửi
        </button>
      </div>

      {/* Comments List */}
      <div className="comments-list">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <img
              src={comment.avatar}
              alt={`${comment.user} avatar`}
              className="comment-avatar"
            />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-user">{comment.user}</span>
                <span className="comment-time">{comment.createdAt}</span>
              </div>
              <p className="comment-text">{comment.content}</p>
              <div className="comment-actions">
                <button className="comment-action-btn">
                  👍 Thích ({comment.likes})
                </button>
                <button className="comment-action-btn">
                  Trả lời
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;