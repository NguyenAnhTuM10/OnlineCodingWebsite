import React, { useState } from 'react';
import LoginModal from '../Login/LoginModal';
import RegisterModal from '../Register/RegisterModal';

const AuthModal = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-modal-overlay">
      {isLogin ? (
        <LoginModal onSwitch={() => setIsLogin(false)} onClose={onClose} />
      ) : (
        <RegisterModal onSwitch={() => setIsLogin(true)} onClose={onClose} />
      )}
    </div>
  );
};

export default AuthModal;
