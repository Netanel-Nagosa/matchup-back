const express = require('express');
const app = express();
const port = 8081;
const cors = require('cors')
const path = require('path');
const db=require("./db/sqlConnection");
const auth=require("./routes/auth")
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const pbDictionery = path.join(__dirname, './public');
app.use(express.static(pbDictionery));
app.set('view engine', 'hbs');

app.get("/api/odds/:leagueKey", async (req, res) => {
  const { leagueKey } = req.params;
  const apiKey = process.env.ODDS_API_KEY;

  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/${leagueKey}/odds?regions=us&oddsFormat=american&apiKey=${apiKey}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const apiKey2 = process.env.ODDS_API_KEY_2;

app.get("/api/sports", async (req, res) => {
  try {
    const response = await fetch(`https://api.the-odds-api.com/v4/sports/?daysFrom=1&apiKey=${apiKey2}`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.use(cookieParser());
app.use('/auth',auth);
app.use('/',require('./routes/pages'))
db.checkingConnect();


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})