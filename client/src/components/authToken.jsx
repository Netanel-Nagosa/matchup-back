// src/components/authToken.js
import jwt from "jsonwebtoken";
import { SECRET } from "../config/database-config.js"; // שים לב להוסיף .js בסוף בקבצי ESM

export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.token; // לא צריך await

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token." });
    }

    req.user = decoded;
    next();
  });
};
