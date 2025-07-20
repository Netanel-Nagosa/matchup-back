const {db} = require('./db/sqlConnection');
const {DataTypes,Sequelize }=require('sequelize')
// const {where}=require('sequelize')

const Form=db.define(
    'Form',{
        username: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          match1: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          match2: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          match3: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          match4: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          match5: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          result1: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          result2: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          result3: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          result4: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          result5: {
            type: DataTypes.STRING,
            allowNull: true,
          },
          price1: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          price2: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          price3: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          price4: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          price5: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          total_price: {
            type: DataTypes.DECIMAL,
            allowNull: true,
          },
          date1:{
            type: DataTypes.STRING,
            allowNull: true,
          },
          date2:{
            type: DataTypes.STRING,
            allowNull: true,
          },
          date3:{
            type: DataTypes.STRING,
            allowNull: true,
          },
          date4:{
            type: DataTypes.STRING,
            allowNull: true,
          },
          date5:{
            type: DataTypes.STRING,
            allowNull: true,
          },
          active: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
          },
          won: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
          },
          created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
}
        },
        {
          tableName: 'forms',
          timestamps: false,
        }
)

module.exports=  Form;