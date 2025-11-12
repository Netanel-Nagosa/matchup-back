const jwt = require("jsonwebtoken");
const { SECRET } = require("../config/database-config");

const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token; // לא צריך await

  if (!token) {
    // אם זה API: החזר 401 JSON
    return res.status(401).json({ message: "No token provided." });
    // אם זה רנדור של דף: use res.redirect('/login')
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    // שמור payload ממויין - אל תכניס את אובייקט כל המשתמש אם חתמת עליו
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;
