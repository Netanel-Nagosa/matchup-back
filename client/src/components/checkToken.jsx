import { Navigate } from 'react-router-dom';

const CheckToken = ({ children }) => {
  const getCookie = (name) => {
    const cookieStr = document.cookie || "";
    const cookies = cookieStr.split('; ').reduce((acc, curr) => {
      const [key, value] = curr.split('=');
      acc[key] = value ? decodeURIComponent(value) : '';
      return acc;
    }, {});
    return cookies[name];
  };

  const token = getCookie('token');

  if (token) {
    console.log("user already logged in.");
    // יש להפנות לנתיב של ה-FRONTEND ("/" או "/home"), לא ל-backend URL
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CheckToken;
