import React, { useState } from 'react';
import './RegisterModal.css';

function RegisterModal({ onClose, onSwitch }) {
  const [registerMethod, setRegisterMethod] = useState('buttons'); // 'buttons' hoặc 'form'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Handle Register form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      // Gửi request đến API
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          full_name: fullName
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Registration successful:', result);
        alert('Đăng ký thành công!');
        onClose();
      } else {
        const error = await response.json();
        console.error('Registration failed:', error);
        alert(`Đăng ký thất bại: ${error.message || 'Vui lòng thử lại'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Lỗi kết nối. Vui lòng kiểm tra kết nối mạng và thử lại.');
    }
  };

  // Handle social Register
  const handleSocialRegister = (provider) => {
    console.log(`Register with ${provider}`);
    // Implement social Register authentication
  };

  // Handle F8 account register button click
  const handleF8AccountRegister = () => {
    setRegisterMethod('form');
  };

  // Go back to button selection
  const handleBackToButtons = () => {
    setRegisterMethod('buttons');
    // Reset form data
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  return (
    <div className="Register-modal-overlay">
      <div className="Register-modal">
        <div className="Register-header">
          <div className="Register-logo">
            <div className="f8-logo">F8</div>
          </div>
          <button className="close-button" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        <div className="Register-content">
          <h2>Đăng ký vào F8</h2>
          
          {registerMethod === 'buttons' && (
            <>
              <p className="Register-description">
                Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều 
                người sử dụng chung sẽ bị khóa.
              </p>

              <div className="Register-methods">
                {/* Email/Phone Register */}
                <button 
                  className="Register-method-btn email-Register"
                  onClick={handleF8AccountRegister}
                >
                  <span className="Register-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                    </svg>
                  </span>
                  <span> Tài khoản F8</span>
                </button>

                {/* Google Register */}
                <button 
                  className="Register-method-btn google-Register"
                  onClick={() => handleSocialRegister('Google')}
                >
                  <span className="Register-icon">
                    <svg viewBox="0 0 48 48" width="18" height="18">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                  </span>
                  <span>Đăng ký với Google</span>
                </button>

                {/* Facebook Register */}
                <button 
                  className="Register-method-btn facebook-Register"
                  onClick={() => handleSocialRegister('Facebook')}
                >
                  <span className="Register-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                    </svg>
                  </span>
                  <span>Đăng ký với Facebook</span>
                </button>

                {/* GitHub Register */}
                <button 
                  className="Register-method-btn github-Register"
                  onClick={() => handleSocialRegister('GitHub')}
                >
                  <span className="Register-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12"></path>
                    </svg>
                  </span>
                  <span>Đăng ký với Github</span>
                </button>
              </div>
            </>
          )}

          {registerMethod === 'form' && (
            <>
              <div className="back-button-container">
                <button 
                  className="back-button"
                  onClick={handleBackToButtons}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#007bff',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <span>←</span> Quay lại
                </button>
              </div>

              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-group">
                  <label htmlFor="fullName">Họ và tên</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Nhập họ và tên của bạn"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginBottom: '15px'
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Nhập email của bạn"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginBottom: '15px'
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Nhập mật khẩu"
                    minLength="6"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginBottom: '15px'
                    }}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Nhập lại mật khẩu"
                    minLength="6"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      marginBottom: '20px'
                    }}
                  />
                </div>

                <button 
                  type="submit"
                  className="submit-button"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '20px'
                  }}
                >
                  Đăng ký tài khoản
                </button>
              </form>
            </>
          )}

          {/* Account registration and recovery links */}
          <div className="Register-footer">
            <p className="register-link">
              Bạn đã có tài khoản? <span style={{color: "blue", cursor: 'pointer'}} onClick={onSwitch}>Đăng nhập</span>
            </p>
            <p className="forgot-password">
              <a href="/forgot-password">Quên mật khẩu?</a>
            </p>
            <p className="terms-notice">
              Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với <a href="/terms">điều khoản sử dụng</a> của chúng tôi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;