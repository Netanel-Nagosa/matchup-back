// מכריח את Node להשתמש ב-IPv4 (חשוב ב-Render!)
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const { Sequelize } = require('sequelize');

// יצירת החיבור למסד הנתונים
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  logging: false,
});

// פונקציה לבדוק חיבור
const checkingConnect = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

// מייצאים גם את ה-sequelize וגם את הפונקציה
module.exports = { db: sequelize, checkingConnect };
