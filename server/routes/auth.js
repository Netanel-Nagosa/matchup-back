const express=require("express");
const router = express.Router();
const userServices=require("../services/user-services");
const formServices=require("../services/form-services");
const betsServices=require("../services/bets-services");
const prizeServices=require("../services/prizes-services")

router.delete("/delete-game/:id",betsServices.deleteBets);
router.delete('/clear-bets', betsServices.clearUserBet);
router.post("/login",userServices.login);
router.post("/register",userServices.addUser);
router.post("/getJoinDate",userServices.getJoinDate);
router.post("/homeForm",formServices.addMatches );
router.post("/get-form",formServices.getForm );
router.post("/get-past-forms",formServices.getPastForms );
router.post("/checkWin",formServices.winCheck );
router.post("/homeMatches",betsServices.addBet );
router.post("/showbets",betsServices.showbets);
router.post("/update-prizes-winners",prizeServices.updatePrizes);
router.post("/notCollectedYet",prizeServices.notCollectedYet);
router.get("/prizes-winners",prizeServices.getWinners);
router.get("/matchup",userServices.logout);
router.get("/getnames",userServices.getNames);
router.get("/getEmail",userServices.getEmail);
router.put("/checkDate",prizeServices.checkDate);
router.put("/collect-prize",prizeServices.collectPrize);
router.put("/editUsername",userServices.editUsername);
router.put("/editPassword",userServices.editPassword);
router.put("/zeroPoints",userServices.upsetPointsONnewMonth);


module.exports=router;