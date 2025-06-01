import React, { useState } from 'react';
import './LoginModal.css';

function LoginModal({ onClose, onSwitch, onLoginSuccess }) {
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Handle input changes with error clearing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
    
    // Clear error when user starts typing
    if (error) setError('');
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Email hoặc mật khẩu không đúng');
      }

      // ✅ Lưu token và user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Sau khi login thành công
      localStorage.setItem('adminToken', data.token);
      console.log('✅ Đăng nhập thành công:, token sau khi login: ', data.token);

      // ✅ Lưu remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      // ✅ Gọi callback để parent component biết login thành công
      if (onLoginSuccess) {
        onLoginSuccess(data.user, data.token);
      }

      // ✅ Đóng modal
      onClose();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle social login
  const handleSocialLogin = async (provider) => {
    console.log(`Login with ${provider}`);
    setLoading(true);
    setError('');

    try {
      // Implement social login authentication
      // This is a placeholder - replace with actual social login implementation
      window.open(`http://localhost:3000/api/auth/${provider.toLowerCase()}`, '_blank');
    } catch (err) {
      setError(`Lỗi đăng nhập với ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle F8 account login button click
  const handleF8Login = () => {
    setShowEmailForm(true);
    setError(''); // Clear any existing errors
  };

  // Handle back to login methods
  const handleBackToMethods = () => {
    setShowEmailForm(false);
    setEmail('');
    setPassword('');
    setError('');
    setLoading(false);
  };

  // Demo function for testing (remove in production)
  const handleDemoLogin = () => {
    const demoUser = {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'demo@example.com',
      avatar: null
    };
    const demoToken = 'demo_token_12345';
    
    // Simulate saving to localStorage
    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    
    if (onLoginSuccess) {
      onLoginSuccess(demoUser, demoToken);
    }
    onClose();
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-header">
          <div className="login-logo">
            <div className="f8-logo">F8</div>
          </div>
          <button className="close-button" onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        <div className="login-content">
          {!showEmailForm ? (
            <>
              <h2>Đăng nhập vào F8</h2>
              
              <p className="login-description">
                Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều 
                người sử dụng chung sẽ bị khóa.
              </p>

              {/* Error message display */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="login-methods">
                {/* Email/Phone Login */}
                <button 
                  className="login-method-btn email-login"
                  onClick={handleF8Login}
                  disabled={loading}
                >
                  <span className="login-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                    </svg>
                  </span>
                  <span>Tài Khoản F8</span>
                </button>

                {/* Google Login */}
                <button 
                  className="login-method-btn google-login"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={loading}
                >
                  <span className="login-icon">
                    <svg viewBox="0 0 48 48" width="18" height="18">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                      <path fill="#4CAF50" d="M24,44c 5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                  </span>
                  <span>{loading ? 'Đang xử lý...' : 'Đăng nhập với Google'}</span>
                </button>

                {/* Facebook Login */}
                <button 
                  className="login-method-btn facebook-login"
                  onClick={() => handleSocialLogin('Facebook')}
                  disabled={loading}
                >
                  <span className="login-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                    </svg>
                  </span>
                  <span>{loading ? 'Đang xử lý...' : 'Đăng nhập với Facebook'}</span>
                </button>

                {/* GitHub Login */}
                <button 
                  className="login-method-btn github-login"
                  onClick={() => handleSocialLogin('GitHub')}
                  disabled={loading}
                >
                  <span className="login-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                    </svg>
                  </span>
                  <span>{loading ? 'Đang xử lý...' : 'Đăng nhập với Github'}</span>
                </button>

                {/* Demo Login Button - Remove in production */}
                {/* <button 
                  className="login-method-btn demo-login"
                  onClick={handleDemoLogin}
                  style={{backgroundColor: '#28a745', marginTop: '10px'}}
                >
                  <span className="login-icon">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </span>
                  <span>Demo Login (Testing)</span>
                </button> */}
              </div>

              {/* Account registration and recovery links */}
              <div className="login-footer">
                <p className="register-link">
                  Bạn chưa có tài khoản? <span style={{color: "blue", cursor: 'pointer'}} onClick={onSwitch}>Đăng ký</span>
                </p>
                <p className="forgot-password">
                  <a href="/forgot-password">Quên mật khẩu?</a>
                </p>
                <p className="terms-notice">
                  Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với <a href="/terms">điều khoản sử dụng</a> của chúng tôi.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Email/Password Login Form */}
              <div className="login-form-header">
                <button className="back-button" onClick={handleBackToMethods}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z"/>
                  </svg>
                </button>
                <h2>Đăng nhập với tài khoản F8</h2>
              </div>

              {/* Error message display */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="email-login-form">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleInputChange}
                    placeholder="Nhập email của bạn"
                    required
                    className="form-input"
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleInputChange}
                    placeholder="Nhập mật khẩu"
                    required
                    className="form-input"
                    disabled={loading}
                  />
                </div>

                {/* Form options */}
                <div className="form-options">
                  <label className="remember-me">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <a href="/forgot-password" className="forgot-password">Quên mật khẩu?</a>
                </div>

                <button 
                  type="submit" 
                  className="login-submit-btn"
                  disabled={loading}
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </form>

              <div className="login-form-footer">
                <p className="register-link">
                  Bạn chưa có tài khoản? <span style={{color: "blue", cursor: 'pointer'}} onClick={onSwitch}>Đăng ký</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginModal;