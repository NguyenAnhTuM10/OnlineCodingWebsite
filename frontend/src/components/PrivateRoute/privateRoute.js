// privateRoute.js
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
  const isAuthenticated = localStorage.getItem('authToken'); // Đã sửa thành authToken

  console.log("Is User Authenticated? ", isAuthenticated);

  if (!isAuthenticated) {
    // Navigate về trang chủ với state để trigger modal
    return <Navigate to="/" state={{ openAuthModal: true }} replace />;
  }

  return element;
};

export default PrivateRoute;