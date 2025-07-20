const { where } = require('sequelize');
const { Op } = require('sequelize');
const betsModel = require('../bets');



const addBet = async (req, res) => {
    let { player, home_team, away_team, competition, result, odd, date } = req.body;
    odd = Math.abs(odd);
    try {
        const checkingBet = await betsModel.findOne({
            where: {
                player,
                home_team,
                away_team
            }
        });

        if (checkingBet) {

            const [updatedRows] = await betsModel.update(
                { result: result, odd: odd },
                {
                    where: {
                        player,
                        home_team,
                        away_team
                    }
                }
            );

            if (updatedRows > 0) {
                return res.send({ msg: "The bet was successfully updated!" });
            } else {
                return res.status(400).json({ msg: "THERES A PROBLAM >>" });
            }
        } else {
            const totalBets = await betsModel.count({
                where: { player }
            });
            if (totalBets >= 5)
                return res.status(400).send({ msg: "There's 5 bets Already." });

            else {

                let match_name = home_team + " VS " + away_team;
                const newMatch = await betsModel.create({
                    player,
                    match_name,
                    home_team,
                    away_team,
                    competition,
                    date,
                    result,
                    odd
                });
                // לדאוג פה לres.json שיחזיר תשובה לפרונט כמו בscript-homeform
                //event.preventDefault(); // לשים את זה בקוד כמו בscript-homeform
                console.log("total bets ::::::::: ", totalBets);
                console.log("new Bet : " + newMatch);
                return res.send({ msg: "New Bet Added Successfully ." });
            }

        }
    } catch (error) {
        console.error("Error on sending new bet >>> ", error);
        return res.status(500).json();
    }
};

const showbets = async (req, res) => {
    const { player } = req.body;
    try {
        const listBets = await betsModel.findAll({
            where: {
                player: player
            }
        });
        const filteredData = listBets.filter(match => {
            const commenceTime = match.date;
            const gameTime = new Date(commenceTime);

            const now = new Date();

            const hasGameStarted = now > gameTime;

            return !hasGameStarted;
        });

        console.log("Fetched bets:", filteredData);
        return res.json(filteredData);
    }
    catch (error) {
        console.log("====> Error in showbets:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const deleteBets = async (req, res) => {
    try {
        const gameId = req.params.id;
        const deleted = await betsModel.destroy({ where: { id: gameId } });

        if (deleted) {
            console.log("Game " + gameId + " is deleted succesfully .")
            res.sendStatus(200);
        }
        else {
            console.log("Game " + gameId + " is not found .")
        }

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}

const editBets = async (req, res) => {
    console.log("Updating game >>>>>>>>>>");

    try {
        const gameId = req.params.id;
        const { result } = req.body; // הנתונים החדשים מה-Frontend

        console.log("Updating game:", gameId, "New Data:", req.body);

        const updated = await betsModel.update(
            { result }, // השדות לעדכון
            { where: { id: gameId } } // התנאי לאיזה משחק לעדכן
        );

        if (updated[0] > 0) { // אם עודכנו רשומות
            console.log("Game updated successfully:", gameId);
            res.sendStatus(200);
        } else {
            console.log("Game not found:", gameId);
            res.status(404).send("Game not found");
        }
    } catch (error) {
        console.error("Error in update Match:", error);
        res.sendStatus(500);
    }
}

async function clearUserBet(req, res) {
    const { player } = req.body; // מקבל את שם המשתמש מהבקשה
    console.log("DELETE PORMITION FOR ::", player);
    try {
        // קריאה לפונקציה שבודקת ומבצעת מחיקה
        await clearUserBetIfNeededLogic(player);
        res.status(200).send({ message: `הימורים למשתמש ${player} נמחקו בהצלחה` });
    } catch (error) {
        console.error('שגיאה במחיקת ההימורים:', error);
        res.status(500).send({ message: 'שגיאה במחיקת ההימורים' });
    }
}

async function clearUserBetIfNeededLogic(player) {
    const lastBet = await betsModel.findOne({
        where: { player },
        order: [['createdAt', 'DESC']]
    });

    if (!lastBet) {
        console.log(`No previwes bets for - ${player}`);
        return;
    }

    const now = new Date();
    const diffMinutes = (now - lastBet.createdAt) / (1000 * 60);
    //אם גדול יותר מ2 דקות (או כל משתנה אחר) אז מתבצעת בדיקה ומחיקה
    if (diffMinutes >= 20) {
        await betsModel.destroy({
            where: { player }
        });
        console.log(`Times up, all the bets are deleted for ${player}`);
    } else {
        console.log(`Passed only ${diffMinutes.toFixed(1)} , The bets is actuve for -${player}`);
    }
}

module.exports = { addBet, showbets, deleteBets, editBets, clearUserBet };