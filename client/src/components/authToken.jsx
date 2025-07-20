// components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

const AuthToken = ({ children }) => {
  const getCookie = (name) => {
    const cookieStr = document.cookie;
    const cookies = cookieStr.split('; ').reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key] = value;
      return acc;
    }, {});
    return cookies[name];
  };
  const token = getCookie('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AuthToken;
