import React, { useEffect, useState } from 'react';
import './ProfilePage.css'; // Import CSS styles for the profile page

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ full_name: '', bio: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return setLoading(false);

    fetch('http://localhost:3000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setForm({
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:3000/api/users/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (res.ok) {
      alert('🎉 Cập nhật thành công!');
      setUser({ ...user, ...form });
      setEditMode(false);
      
      // Add success animation
      const card = document.querySelector('.profile-card');
      card.classList.add('success');
      setTimeout(() => card.classList.remove('success'), 600);
    } else {
      alert('❌ Lỗi: ' + data.error);
    }
  };

  if (loading) return (
    <div className="profile-page">
      <div className="loading-message">
        <p>Đang tải thông tin...</p>
      </div>
    </div>
  );
  
  if (!user) return (
    <div className="profile-page">
      <div className="error-message">
        <p>Bạn chưa đăng nhập.</p>
      </div>
    </div>
  );

  return (
    <div className="profile-page">
      <h1>Thông tin cá nhân</h1>

      <div className={`profile-card ${editMode ? 'edit-mode' : ''}`}>
        <img 
          src={form.avatar_url || '/images/avatars/default.png'} 
          alt={form.full_name} 
          className="avatar" 
        />
        
        {editMode ? (
          <div className="edit-form">
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Nhập họ tên của bạn"
            />
            <input
              type="url"
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleChange}
              placeholder="Nhập URL ảnh đại diện"
            />
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Viết vài dòng giới thiệu về bản thân..."
              rows="4"
            />
            
            <div className="button-group">
              <button onClick={handleSave}>
                💾 Lưu thay đổi
              </button>
              <button onClick={() => setEditMode(false)}>
                ❌ Hủy bỏ
              </button>
            </div>
          </div>
        ) : (
          <>
            <h2>{user.full_name}</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Vai trò:</strong> {user.role}</p>
            <p><strong>Bio:</strong> {user.bio || 'Chưa cập nhật'}</p>
            <p><strong>Ngày tạo:</strong> {new Date(user.created_at).toLocaleDateString('vi-VN')}</p>
            
            <div className="button-group">
              <button onClick={() => setEditMode(true)}>
                ✏️ Chỉnh sửa hồ sơ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;