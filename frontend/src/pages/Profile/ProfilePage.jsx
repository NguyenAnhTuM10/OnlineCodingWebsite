

// import React, { useEffect, useState } from 'react';
// import './ProfilePage.css';

// function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [editMode, setEditMode] = useState(false);
//   const [form, setForm] = useState({ full_name: '', bio: '', avatar_url: '' });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       console.log('❌ No token found');
//       return setLoading(false);
//     }

//     console.log('🔄 Fetching user data...');
//     fetch('http://localhost:3000/api/users/me', {
//       headers: { Authorization: `Bearer ${token}` }
//     })
//       .then(res => {
//         console.log('📡 Response status:', res.status);
//         return res.json();
//       })
//       .then(data => {
//         console.log('✅ API Response:', data); // Debug log
        
//         // Handle both nested and flat response structures
//         const userData = data.data || data;
//         console.log('👤 User data:', userData);
        
//         setUser(userData);
//         setForm({
//           full_name: userData.full_name || '',
//           bio: userData.bio || '',
//           avatar_url: userData.avatar_url || ''
//         });
//         setLoading(false);
//       })
//       .catch(err => {
//         console.error('❌ Fetch error:', err);
//         setLoading(false);
//       });
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSave = async () => {
//     const token = localStorage.getItem('token');

//     try {
//       const res = await fetch('http://localhost:3000/api/users/me', {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         },
//         body: JSON.stringify(form)
//       });

//       const data = await res.json();
//       if (res.ok) {
//         alert('🎉 Cập nhật thành công!');
//         setUser({ ...user, ...form });
//         setEditMode(false);
        
//         // Add success animation
//         const card = document.querySelector('.profile-card');
//         if (card) {
//           card.classList.add('success');
//           setTimeout(() => card.classList.remove('success'), 600);
//         }
//       } else {
//         alert('❌ Lỗi: ' + (data.error || 'Unknown error'));
//       }
//     } catch (err) {
//       console.error('Save error:', err);
//       alert('❌ Lỗi kết nối');
//     }
//   };

//   // Debug rendering states
//   console.log('🎨 Render state - Loading:', loading, 'User:', !!user, 'EditMode:', editMode);

//   if (loading) {
//     return (
//       <div className="profile-page">
//         <div className="loading-message">
//           <p>Đang tải thông tin...</p>
//         </div>
//       </div>
//     );
//   }
  
//   if (!user) {
//     return (
//       <div className="profile-page">
//         <div className="error-message">
//           <p>Bạn chưa đăng nhập hoặc không thể tải thông tin.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="profile-page">
//       <h1>Thông tin cá nhân</h1>

//       <div className={`profile-card ${editMode ? 'edit-mode' : ''}`}>
//         <img 
//           src={form.avatar_url || '/images/avatars/default.png'} 
//           alt={form.full_name || 'Avatar'} 
//           className="avatar"
//           onError={(e) => {
//             e.target.src = '/images/avatars/default.png';
//           }}
//         />
        
//         {editMode ? (
//           <div className="edit-form">
//             <input
//               type="text"
//               name="full_name"
//               value={form.full_name}
//               onChange={handleChange}
//               placeholder="Nhập họ tên của bạn"
//             />
//             <input
//               type="url"
//               name="avatar_url"
//               value={form.avatar_url}
//               onChange={handleChange}
//               placeholder="Nhập URL ảnh đại diện"
//             />
//             <textarea
//               name="bio"
//               value={form.bio}
//               onChange={handleChange}
//               placeholder="Viết vài dòng giới thiệu về bản thân..."
//               rows="4"
//             />
            
//             <div className="button-group">
//               <button onClick={handleSave}>
//                 💾 Lưu thay đổi
//               </button>
//               <button onClick={() => setEditMode(false)}>
//                 ❌ Hủy bỏ
//               </button>
//             </div>
//           </div>
//         ) : (
//           <>
//             <h2>{user.full_name || user.username || 'Chưa cập nhật tên'}</h2>
//             <p><strong>ID:</strong> {user.user_id || user.id}</p>
//             <p><strong>Username:</strong> {user.username || 'Chưa cập nhật'}</p>
//             <p><strong>Email:</strong> {user.email || 'Chưa cập nhật'}</p>
//             <p><strong>Vai trò:</strong> {user.role || 'Chưa cập nhật'}</p>
//             <p><strong>Bio:</strong> {user.bio || 'Chưa cập nhật'}</p>
//             <p><strong>Ngày tạo:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
            
//             <div className="button-group">
//               <button onClick={() => setEditMode(true)}>
//                 ✏️ Chỉnh sửa hồ sơ
//               </button>
//             </div>
//           </>
//         )}
//       </div>
      
//       {/* Debug info - remove in production */}
//       <div style={{marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5', fontSize: '12px'}}>
//         <strong>Debug Info:</strong>
//         <pre>{JSON.stringify({loading, hasUser: !!user, editMode, userKeys: user ? Object.keys(user) : []}, null, 2)}</pre>
//       </div>
//     </div>
//   );
// }

// export default ProfilePage;





import React, { useEffect, useState } from 'react';
import './ProfilePage.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [form, setForm] = useState({ full_name: '', bio: '', avatar_url: '' });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('❌ No token found');
      return setLoading(false);
    }

    console.log('🔄 Fetching user data...');
    fetch('http://localhost:3000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log('📡 Response status:', res.status);
        return res.json();
      })
      .then(data => {
        console.log('✅ API Response:', data);
        
        const userData = data.data || data;
        console.log('👤 User data:', userData);
        
        setUser(userData);
        setForm({
          full_name: userData.full_name || '',
          bio: userData.bio || '',
          avatar_url: userData.avatar_url || ''
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ Fetch error:', err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');

    try {
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
        alert('🎉 Cập nhật thông tin thành công!');
        setUser({ ...user, ...form });
        setEditMode(false);
        
        const card = document.querySelector('.profile-card');
        if (card) {
          card.classList.add('success');
          setTimeout(() => card.classList.remove('success'), 600);
        }
      } else {
        alert('❌ Lỗi: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('❌ Lỗi kết nối');
    }
  };

  const handleChangePassword = async () => {
    const token = localStorage.getItem('token');

    // Validate form
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      alert('❌ Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('❌ Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (passwordForm.new_password.length < 6) {
      alert('❌ Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(passwordForm)
      });

      const data = await res.json();
      if (res.ok) {
        alert('🎉 Đổi mật khẩu thành công!');
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setPasswordMode(false);
        
        const card = document.querySelector('.profile-card');
        if (card) {
          card.classList.add('success');
          setTimeout(() => card.classList.remove('success'), 600);
        }
      } else {
        alert('❌ Lỗi: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Change password error:', err);
      alert('❌ Lỗi kết nối');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-message">
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="profile-page">
        <div className="error-message">
          <p>Bạn chưa đăng nhập hoặc không thể tải thông tin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <h1>Thông tin cá nhân</h1>

      <div className={`profile-card ${editMode ? 'edit-mode' : ''} ${passwordMode ? 'password-mode' : ''}`}>
        <img 
          src={form.avatar_url || '/images/avatars/default.png'} 
          alt={form.full_name || 'Avatar'} 
          className="avatar"
          onError={(e) => {
            e.target.src = '/images/avatars/default.png';
          }}
        />
        
        {passwordMode ? (
          // Form đổi mật khẩu
          <div className="password-form">
            <h3>🔒 Đổi mật khẩu</h3>
            <input
              type="password"
              name="current_password"
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
              placeholder="Mật khẩu hiện tại"
            />
            <input
              type="password"
              name="new_password"
              value={passwordForm.new_password}
              onChange={handlePasswordChange}
              placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
            />
            <input
              type="password"
              name="confirm_password"
              value={passwordForm.confirm_password}
              onChange={handlePasswordChange}
              placeholder="Xác nhận mật khẩu mới"
            />
            
            <div className="button-group">
              <button onClick={handleChangePassword}>
                🔒 Đổi mật khẩu
              </button>
              <button onClick={() => {
                setPasswordMode(false);
                setPasswordForm({
                  current_password: '',
                  new_password: '',
                  confirm_password: ''
                });
              }}>
                ❌ Hủy bỏ
              </button>
            </div>
          </div>
        ) : editMode ? (
          // Form chỉnh sửa thông tin
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
          // Hiển thị thông tin
          <>
            <h2>{user.full_name || user.username || 'Chưa cập nhật tên'}</h2>
            <p><strong>ID:</strong> {user.user_id || user.id}</p>
            <p><strong>Username:</strong> {user.username || 'Chưa cập nhật'}</p>
            <p><strong>Email:</strong> {user.email || 'Chưa cập nhật'}</p>
            <p><strong>Bio:</strong> {user.bio || 'Chưa cập nhật'}</p>
            <p><strong>Ngày tạo:</strong> {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
            
            <div className="button-group">
              <button onClick={() => setEditMode(true)}>
                ✏️ Chỉnh sửa hồ sơ
              </button>
              <button onClick={() => setPasswordMode(true)} className="password-btn">
                🔒 Đổi mật khẩu
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;