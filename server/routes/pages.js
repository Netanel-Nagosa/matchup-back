const express = require("express");
const router = express.Router();
const checkToken= require("../middlewares/checkToken");
const authenticateToken = require("../middlewares/authToken");
const servises= require("../services/form-services")

/* הדף שייך ועובד רק על הHBS , שייך לטיוטא */

//authenticateToken >> צריך להיות לפני כל דף באפליקציה כדי לבדוק שלמשתמש יש טוקן וקוקי ולא יוכל להיכנס מהQUERY 

router.use('/homeMatches',authenticateToken,(req, res) => {
    res.render("homeMatches");
});

router.use('/homeForm',(req, res, ) => {
    res.render("homeForm");
});

// לדאוג למידלוואר שידאג שלא יכנסו לעמוד הזה דרך הפאט למעלה בכתובת אתר
router.use('/home',authenticateToken,(req, res) => {
    res.render("home");
});
router.use('/welcome',authenticateToken,(req, res) => {
    res.render("welcome");
});
router.use('/login',checkToken,(req, res) => {
    res.render("login");
});

router.use('/register',checkToken,(req, res) => {
    res.render("register");
});

// router.use('/', checkToken,(req, res) => {
//     res.render("matchup");
// });

module.exports = router;