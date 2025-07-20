const dbconfig = require("../config/database-config")
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbconfig.DATABASE,
    dbconfig.USER,
    dbconfig.PASSWORD,
    {
        host: dbconfig.HOST,
        dialect: dbconfig.DIALECT,
        port: 3306
    }
)

const checkingConnect = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
  
  module.exports = {db: sequelize, checkingConnect };