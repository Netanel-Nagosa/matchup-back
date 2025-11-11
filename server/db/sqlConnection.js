const dbconfig = require("../config/database-config")
const Sequelize = require("sequelize");

if (process.env.PGHOST) {
  // מחליף את ה-host לכתובת IPv4 אם PGHOST מכיל שם דומיין (מוסיף 'ipv4.' רק אם זה רלוונטי)
  process.env.PGHOST = process.env.PGHOST.replace(/^(.+)$/, '$1');
}

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: false
});

module.exports = sequelize;


const checkingConnect = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
  
  module.exports = {db: sequelize, checkingConnect };