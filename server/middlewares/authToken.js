const jwt= require("jsonwebtoken");
const {SECRET}= require("../config/database-config");

const authenticateToken = async (req, res, next) => {
    const token = await req.cookies.token;

    // בדיקה אם הטוקן קיים
    if (!token) {
        return res.render("matchup")
        // פה לשים מעבר לעמוד הרשמה 
    }

    // בדיקת הטוקן (פענוח וודאיות)
    jwt.verify(token, SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token.' });
        }

        // אם הטוקן תקין, שומרים את המידע של המשתמש בבקשה
        req.user = user;

        // ממשיכים לבקשה הבאה בשרשרת
        next();
    });
}
module.exports = authenticateToken;