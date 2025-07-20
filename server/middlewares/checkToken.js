const jwt = require('jsonwebtoken');
const { SECRET } = require("../config/database-config")
const JWT_SECRET = SECRET; // החלף במפתח שלך

const checkToken = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        
        return next();
    }


    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return next();
        }

        req.user = decoded;
        console.log("user already loged in.")
        return res.redirect('/home');
    });
};

module.exports = checkToken;


