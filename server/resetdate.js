const { db } = require('./db/sqlConnection');
const { DataTypes, Sequelize } = require('sequelize')
// const {where}=require('sequelize')

const Resetedate = db.define(
  'Resetedate', {
  lastResetDate: {
    type: DataTypes.DATE,
    allowNull: false,
  }
},
  {
    tableName: 'resetdate',
    timestamps: false,
  }
)

module.exports = Resetedate;