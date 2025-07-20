// components/CheckToken.jsx
import { Navigate } from 'react-router-dom';

const CheckToken = ({ children }) => {
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

    if (token) {
      console.log("user already logged in.");
      return <Navigate to="/" />;
    }
  
    return children;
};

export default CheckToken;
