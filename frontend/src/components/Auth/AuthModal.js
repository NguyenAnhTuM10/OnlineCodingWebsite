import React, { useState, useEffect } from 'react';
import LoginModal from '../Login/LoginModal';
import RegisterModal from '../Register/RegisterModal';

const AuthModal = ({ onClose, onLoginSuccess, mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');

  // Cập nhật trạng thái khi prop mode thay đổi
  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  return (
    <div className="auth-modal-overlay">
      {isLogin ? (
        <LoginModal 
          onSwitch={() => setIsLogin(false)} 
          onClose={onClose}
          onLoginSuccess={onLoginSuccess}
        />
      ) : (
        <RegisterModal 
          onSwitch={() => setIsLogin(true)} 
          onClose={onClose} 
          onLoginSuccess={onLoginSuccess}
        />
      )}
    </div>
  );
};

export default AuthModal;
