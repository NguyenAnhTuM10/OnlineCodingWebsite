import React, { useState } from 'react';
import './LoginModal.css';

function LoginModal({ onClose,onSwitch }) {
  const [loginMethod, setLoginMethod] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Handle login form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would implement actual login logic
    console.log('Login attempted with:', { email, password });
  };

  // Handle social login
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login authentication
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
          <h2>Đăng nhập vào F8</h2>
          
          <p className="login-description">
            Mỗi người nên sử dụng riêng một tài khoản, tài khoản nhiều 
            người sử dụng chung sẽ bị khóa.
          </p>

          <div className="login-methods">
            {/* Email/Phone Login */}
            <button 
              className="login-method-btn email-login"
              onClick={() => setLoginMethod('email')}
            >
              <span className="login-icon">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                </svg>
              </span>
              <span>Sử dụng email / số điện thoại</span>
            </button>

            {/* Google Login */}
            <button 
              className="login-method-btn google-login"
              onClick={() => handleSocialLogin('Google')}
            >
              <span className="login-icon">
                <svg viewBox="0 0 48 48" width="18" height="18">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                  <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                  <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                  <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
              </span>
              <span>Đăng nhập với Google</span>
            </button>

            {/* Facebook Login */}
            <button 
              className="login-method-btn facebook-login"
              onClick={() => handleSocialLogin('Facebook')}
            >
              <span className="login-icon">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path>
                </svg>
              </span>
              <span>Đăng nhập với Facebook</span>
            </button>

            {/* GitHub Login */}
            <button 
              className="login-method-btn github-login"
              onClick={() => handleSocialLogin('GitHub')}
            >
              <span className="login-icon">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
                </svg>
              </span>
              <span>Đăng nhập với Github</span>
            </button>
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
        </div>
      </div>
    </div>
  );
}

export default LoginModal;