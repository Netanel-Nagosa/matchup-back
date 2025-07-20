const { db } = require('./db/sqlConnection');
const { DataTypes, Sequelize } = require('sequelize')
// const {where}=require('sequelize')

const Prize = db.define(
  'Prize', {
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  winner: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isWinner: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,  
    allowNull: false,
    defaultValue: true,       
  },
},
  {
    tableName: 'prizes',
    timestamps: false,
  }
)

module.exports = Prize;