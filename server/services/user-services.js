const { where } = require('sequelize');
const { Op } = require('sequelize');
const userModel = require('../user');
const { SECRET } = require("../config/database-config")
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');


const addUser = async (req, res) => {
    const { username, first_name, last_name, email, password } = req.body;

    const checkingUserName = await userModel.findOne({
        where: {
            username: username
        }
    })
    if (checkingUserName) {
        return res.status(500).json({ msg: "Username in use ,please try another one ." })
    }


    const checkingUser = await userModel.findOne({
        where: {
            email: email
        }
    })
    if (checkingUser) {
        return res.status(500).json({ msg: "there's account with this email , please try another email." })
    }

    if (!username || !first_name || !last_name || !email || !password) {
        return res.status(500).json({ error: "There's a missing field ." })
    }


    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userModel.create({
            username,
            first_name,
            last_name,
            email,
            password:hashedPassword,
        })
        const Token = jwt.sign({ newUser }, SECRET, { expiresIn: '5m' });
        res.cookie('token', Token, { httpOnly: false, sameSite: 'lax' }); newUser.token = Token;
        await newUser.save(); // להחזיר ברגע האמת !!!!!!!!!
        console.log({ msg: "user added succesfuly !", newUser });

        return res.send({ msg: "added succsesfully !!!!!" })

    }
    catch (error) {
        console.log("you have some error :: ", error);
    };
}

let userN = { logedName: " " };
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({
            where: {
                username: username,
                password: password,
            }
        })
        if (!user)
            return res.status(401).json({ err: "User not found" });
        const token = jwt.sign({ user }, SECRET)
        res.cookie("token", token, { httpOnly: false, sameSite: 'lax' });
        user.token = token;
        await user.save();
        userN.logedName = username;
        console.log("USER >>>>>>>>>>> ", userN);
        res.json({
            msg: "Welcome " + username + "!",
            redirectTo: "/",
            username: username
        });

    }
    catch (error) {
        res.send("theres an error  :: " + error)
    }
}

const logout = (req, res) => {

    if (req.cookies && req.cookies.token) {

        res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'Strict' });
        console.log('Logged out successfully');
        return res.json({ msg: "Logged out successfully !!!" });
    } else {

        return res.status(400).json('cannot log out , theres no user .');
    }
};

const getNames = async (req, res) => {
    try {

        const listNames = await userModel.findAll({
            where: {
                active: 1
            }
        });
        listNames.push(userN);
        return res.json(listNames);

    }
    catch (error) {
        console.log("you have some error on get names func:: ", error);
    };
}


const getEmail = async (username) => {
    try {
        const user = await userModel.findOne({ where: { username } });
        return user?.email || null;
    } catch (error) {
        console.log("cannot find email:", error);
        return null;
    }
}

const editUsername = async (req, res) => {
    const { username, newUsername, user } = req.body;

    try {

        const isUser = await userModel.findOne({
            where: {
                username: username
            }
        });
        if (!isUser || username !== user) {
            return res.send({ problem: "Wrong Username, try again or try another Name." })
        }

        const theresUser = await userModel.findOne({
            where: {
                username: newUsername
            }
        });
        if (theresUser) {
            return res.send({ problem: "Theres a Username with that name , try again." })
        }

        const [updatedName] = await userModel.update(
            { username: newUsername },
            { where: { username } }
        );
        if (updatedName > 0)
            return res.send({ good: "The name has succesfuly changed !" })
        else
            return res.send({ problem: "theres a problem l159" });
    }
    catch (error) {
        console.log("you have some error on edit user>> ", error);
        res.status(500).send({ error: "Server error" });
    };
}
const editPassword = async (req, res) => {
    const { password, newPassword, user } = req.body;

    try {

        const theresUser = await userModel.findOne({
            where: {
                username: user,
                password: password
            }
        });
        if (!theresUser) {
            return res.send({ problem: "Current password is worng, try again." })
        }

        const [updatePassword] = await userModel.update(
            { password: newPassword },
            { where: { password } }
        );
        if (updatePassword > 0)
            return res.send({ good: "The Password has succesfuly changed !" })
        else
            return res.send({ problem: "theres a problem l188" });
    }
    catch (error) {
        console.log("you have some error on edit Password >> ", error);
        res.status(500).send({ error: "Server error" });
    };
}

const getJoinDate = async (req, res) => {
    const { user } = req.body;

    try {
        const userDate = await userModel.findOne({
            where: {
                username: user
            }
        });
        const dateOfJoin = userDate.createdAt;
        return res.send({ msg: dateOfJoin })
    } catch (error) {
        console.log("you have some error on getJoinDate >> ", error);
        res.status(500).send({ error: "Server error" });
    }
}

// לבדוק אם צריך את זה 
const upsetPointsONnewMonth = async (req, res) => {
    const [usersPoints] = await userModel.update(
        { points: 0 },
        { where: { id: { [Op.gt]: 0 } } }
    );
    if (usersPoints > 0)
        return res.send({ good: "all goes down to 0 !" })
    else
        return res.send({ problem: "theres a problem 221line" });

}
module.exports = { addUser, login, logout, getNames, getEmail, editUsername, editPassword, getJoinDate, upsetPointsONnewMonth };