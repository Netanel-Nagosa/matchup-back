const {db} = require('./db/sqlConnection');
const {DataTypes}=require('sequelize')
// const {where}=require('sequelize')

// const User=db.define(
//     'User',{
//         username: {
//             type: DataTypes.STRING,
//             allowNull: false,
//           },
//           firstname: {
//             type: DataTypes.STRING,
//             allowNull: false,
//           },
//           lastname: {
//             type: DataTypes.STRING,
//             allowNull: false,
//           },
//           age: {
//             type: DataTypes.NUMBER,
//             allowNull: false,
//           },
//           state: {
//             type: DataTypes.STRING,
//             allowNull: false,
//           },
//           email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//           },
//           phone: {
//             type: DataTypes.NUMBER,
//             allowNull: false,
//           },
//           password: {
//             type: DataTypes.STRING,
//             allowNull: false,
//           },
//           token: {
//             type: DataTypes.STRING,
//             // allowNull: true,
//           },
//         },
        // {
        // timestamps: false,
        // }
// )
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
