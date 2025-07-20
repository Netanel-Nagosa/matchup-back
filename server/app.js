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

app.use(cookieParser());
app.use('/auth',auth);
app.use('/',require('./routes/pages'))
db.checkingConnect();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})