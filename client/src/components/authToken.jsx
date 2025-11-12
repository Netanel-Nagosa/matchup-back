// components/PrivateRoute.jsx
// src/utils/authToken.js
import jwtDecode from "jwt-decode"; // ספרייה קלה לפענוח JWT בצד קליינט

export const AuthToken = () => {
  const token = localStorage.getItem("token"); // או cookies

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    return decoded; // מחזיר את ה payload
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};
