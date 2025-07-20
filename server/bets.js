const {db} = require('./db/sqlConnection');
const {DataTypes}=require('sequelize')
// const {where}=require('sequelize')

const Bets=db.define(
  'Bets',{
    player: {
      type: DataTypes.STRING,
      allowNull: true,//במציאות לשנות לFALSE 
    },
    match_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    home_team: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    away_team: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    competition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    odd: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    
  }
)

module.exports=  Bets;
