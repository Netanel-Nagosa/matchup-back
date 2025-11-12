// src/utils/authToken.js
const AuthToken = () => {
  const token = localStorage.getItem("token"); // או cookies

     if (!token) {
        return res.render("https://matchup-back.vercel.app")
        // פה לשים מעבר לעמוד הרשמה 
    }

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
