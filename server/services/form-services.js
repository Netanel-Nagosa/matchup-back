const { where } = require('sequelize');
const { Op } = require('sequelize');
const formModel = require('../form');
const userModel = require('../user')

const addMatches = async (req, res) => {
    console.log("Received data:", req.body);

    const { username, match1, match2, match3, match4, match5,
        result1, result2, result3, result4, result5,
        price1, price2, price3, price4, price5,
        date1, date2, date3, date4, date5
    } = req.body;
    if (!match1 || !match2 || !match3 || !match4 || !match5 ||
        !result1 || !result2 || !result3 || !result4 || !result5 ||
        !price1 || !price2 || !price3 || !price4 || !price5 ||
        !date1 || !date2 || !date3 || !date4 || !date5) {

        return res.send({ msg: "YOU NEED TO FILL ALL THE FORM BEFORE SENDING ." })
    }
    const checkingMatch = await formModel.findOne({
        where: {
            username: username,
            active: 1
        }
    })
    if (checkingMatch) {
        return res.status(500).json({ msg: "sorry , you already send a Matchup form , wait for the results!" })
    }

    else {

        try {
            const total_price = price1 + price2 + price3 + price4 + price5;
            const newmatch = await formModel.create({
                username, match1, match2, match3, match4, match5,
                result1, result2, result3, result4, result5,
                price1, price2, price3, price4, price5,
                date1, date2, date3, date4, date5, total_price
            })
            //אפשר לעשות שברגע השליחה יפנה לקומפוננטה שבה רשום הטופס נשלח בהצלחה
            return res.send({ ok: " The bet was successfully submitted, Good luck!", newmatch })
        }
        catch (error) {
            console.log("you have some error :: ", error);
        };
    }

}


const getForm = async (req, res) => {
    const { username } = req.body;
    console.log("Getting form >>  ");
    try {
        const form = await formModel.findAll({
            where: {
                username: username,
            },
            order: [['id', 'DESC']] // מביא את הטופס עם ה-ID הכי גבוה
        });
        console.log("the form of " + username + " : ", form)
        return res.json(form);

    }
    catch (error) {
        console.log("you have some error on get names func:: ", error);
    };
}

const winCheck = async (req, res) => {
    let { won, username, points } = req.body;

    console.log("BODY FROM CLIENT:", req.body);

    won = parseInt(won);
    const active = 0;
    if (won == 0) {
        try {

            const updated = await formModel.update(
                { won, active },
                { where: { username: username, active: 1 } }
            );
            console.log("updated:", updated);

            return res.status(200).json({ noWin: "So Close , Want To" });


        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    } else {
        try {
            won = won.toString();
            const updated = await formModel.update(
                { won, active },
                { where: { username: username, active: 1 } }
            );
            const user = await userModel.findOne({ where: { username, active: 1 } });
            if (user) {
                const updatedPoints = Number(user.points) + Number(points);

                await userModel.update(
                    { points: updatedPoints },
                    { where: { username } }
                );
            }


            return res.status(200).json({ win: "You Won! Go And Check Your Position On " });


        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }
}

const getPastForms = async (req, res) => {
    const { username } = req.body;
    try {
        const form = await formModel.findAll({
            where: {
                username: username,
                active: 0
            }
        });
        console.log("ALL the forms of " + username + " : ", form)
        return res.json(form);

    }
    catch (error) {
        console.log("you have some error on get names func:: ", error);
    };
}

module.exports = { addMatches, getForm, winCheck, getPastForms };