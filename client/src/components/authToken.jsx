// src/utils/authToken.js
const AuthToken = () => {
  const token = localStorage.getItem("token"); // או cookies

  if (!token) return null;

  try {
    const payload = token.split('.')[1]; // החלק השני של JWT
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export default AuthToken;
