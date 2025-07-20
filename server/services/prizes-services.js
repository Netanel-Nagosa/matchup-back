const { where } = require('sequelize');
const { Op } = require('sequelize');
const prizeModel = require('../prizes')
const nodemailer = require('nodemailer');
const { getEmail } = require('./user-services');
const { Sequelize } = require('sequelize');
const resetDateModel = require("../resetdate")
const { differenceInCalendarMonths } = require('date-fns');

// const sendMail = async (req, res) => {
//     const { username, thePrize } = req.body;

//     try {
//         const winnerEmail = await getEmail(username);
//         if (!winnerEmail) {
//             return res.status(404).json({ msg: "Email not found" });
//         }

//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'nagosa1233211@gmail.com',
//                 pass: 'keha avyu zlrr fuci'
//             }
//         });

//         const mailOptions = {
//             from: 'nagosa1233211@gmail.com',
//             to: winnerEmail,
//             subject: `HELLO, ${username}! YOUR PRIZE!`,
//             text: `Congratulations, ${username}! You've won ${thePrize} 🎉`
//         };

//         const info = await transporter.sendMail(mailOptions);
//         console.log("Email sent >>>", info.response);
//         return res.json({ sent: "Email sent", info: info.response });

//     } catch (err) {
//         console.error("Error sending email:", err);
//         return res.status(500).json({ msg: "Failed to send email" });
//     }
// };


const updatePrizes = async (req, res) => {
    const { player, id } = req.body;
    if (!player || !id)
        return res.send({ idmissing: "theres no winner or problem on line8 Ps." })
    try {

        const winnerCount = await prizeModel.count({
            where: {
                winner: { [Op.not]: null }
            }
        });

        console.log("Current number of winners:", winnerCount);

        if (winnerCount === 5) {

            return res.status(200).send({ good: "Already 5 winners" });
        }

        else {
            const updated = await prizeModel.update(
                { winner: player, isWinner: true },
                { where: { id: id } }
            );

            if (updated[0] > 0) {
                console.log("Winner updated successfully:", player);
                res.status(200).send({ good: "all good" });
            } else {
                console.log("problem at updateing:", player);
                res.status(404).send({ problem: "prize not found/another problem line21 PS" });
            }
        }
    } catch (error) {
        console.error("Error line 24 PS:", error);
        res.sendStatus(500);
    }
}

const getWinners = async (req, res) => {
    try {
        const winners = await prizeModel.findAll()
        return res.json(winners);
    } catch (error) {
        return res.status(404).send({ problem: "Problem in getWinners 33l" });
    }
}

const notCollectedYet = async (req, res) => {
    const { username } = req.body;
    try {
        const winners = await prizeModel.findAll({
            where: {
                active: 1
            }
        });

        const userCollect = winners.find(f => f.winner === username && f.active === 1);

        if (userCollect) {
            return res.json({ prize: "prize waiting for", username });
        }

        return res.json({ msg: "prize collected already || no winner .." });
    } catch (error) {
        return res.status(404).json({ problem: "Problem in getWinners 33l" });
    }
};



// const counterActives = async (req, res) => {
//     try {

//         const activeWinner = await prizeModel.count({
//             where: {
//                 active: 1
//             }
//         });

//         if (activeWinner === 0) {
//             const updated = await prizeModel.update(
//                 { winner: null, isWinner: false, active: 1 },
//                 { where: {} }
//             );

//             if (updated[0] > 0) {
//                 console.log("Set to the begginnig.");
//                 return res.status(200).send({ good: "all good , Set to the begginnig." });
//             } else {
//                 console.log("problem at updateing: 109 ");
//                 return res.status(404).send({ problem: "problem 111  , bc" });
//             }
//         }

//         else {
//             return res.send({ problem: "you dont have a 5 active winners yet." });

//         }
//     } catch (error) {
//         console.error("Error line 24 PS:", error);
//         res.sendStatus(500);
//     }
// }

const collectPrize = async (req, res) => {
    const { username, id } = req.body;

    if (!username)
        return res.status(400).json({ error: "Missing username" });

    try {
        // עדכון שהפרס נאסף (active = false)
        const updated = await prizeModel.update(
            { active: false },
            { where: { winner: username } }
        );

        if (updated[0] === 0) {
            return res.status(404).json({ error: "No prize found for this user" });
        }

        // הבאת הפרס שהמשתמש זכה בו
        const prize = await prizeModel.findOne({
            where: { winner: username }
        });

        if (!prize) {
            return res.status(404).json({ error: "Prize not found after update" });
        }

        const thePrize = prize.name;
        const winnerEmail = await getEmail(username);

        if (!winnerEmail) {
            return res.status(404).json({ error: "Email not found for winner" });
        }

        // שליחת מייל
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nagosa1233211@gmail.com',
                pass: 'keha avyu zlrr fuci'
            }
        });

        const mailOptions = {
            from: 'nagosa1233211@gmail.com',
            to: winnerEmail,
            subject: `🎉 Congratulations, ${username}!`,
            text: `You've won ${thePrize}! 🎁 Enjoy your prize!`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent >>>", info.response);

        res.status(200).json({
            good: "Prize collected and email sent.",
            prize: thePrize,
            email: winnerEmail
        });

    } catch (error) {
        console.error("Error in collectPrize:", error);
        res.status(500).json({ error: "Server error while collecting prize or sending email." });
    }
};


const checkDate = async (req, res) => {
    try {
        const state = await resetDateModel.findOne();

        if (!state) {
            // אם אין שורה – צור אחת
            await resetDateModel.create({ lastResetDate: new Date() });
            return res.json({ resetNewLine: "new line was made." });
        }

        const lastResetDate = state.lastResetDate;
        const now = new Date();
        // now.setMonth(now.getMonth() + 1); לצורכי בדיקה <<<<

        if (differenceInCalendarMonths(now, lastResetDate) >= 1) {
            await prizeModel.update(
                {
                    winner: null,
                    isWinner: 0,
                    active: 1
                },
                {
                    where: {
                        id: { [Op.gt]: 0 } // תנאי where id > 0
                    }
                }
            );

            // עדכון השורה הספציפית לפי המפתח הראשי (id)
            await resetDateModel.update(
                { lastResetDate: now },
                { where: { id: state.id } } // <-- כאן המפתח הראשי
            );
            return res.json({ resetGO: "all good! check date UPDATE." });
        }

        res.json({ reset: false, msg: "not work checked days" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};




module.exports = { updatePrizes, getWinners, collectPrize, checkDate, notCollectedYet };