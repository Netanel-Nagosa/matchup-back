const {db} = require('./db/sqlConnection');
const {DataTypes}=require('sequelize')

const User=db.define(
  'User',{
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    points:{
      type: DataTypes.NUMBER,
      allowNull: true,
    }// new >>>>>>>>>>>>>>>>>>>>>>>>
  },
  {
    timestamps: true,
    
  }
)

module.exports=  User;
