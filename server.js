const express = require('express')
const cors = require('cors')
const session = require('express-session')
const path = require('path');

const app = express()
const port = 3001

const sessionOption = require('./lib/sessionOption');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);
app.use(session({  
  key: 'session_cookie_name',
  secret: '~',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
    cookie: {
    httpOnly: true,
    secure: false,  
    sameSite: 'lax', 
    maxAge: 1000 * 60 * 60 * 24　// 세션유지
  }
}))

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,                // 세션 쿠키 주고받을 때 필요
}));

app.use('/api/auth/', require('./rest_api/auth'));
app.use('/api/reservation/', require('./rest_api/reservation'));
app.use('/api/tickets/', require('./rest_api/tickets'));
app.use('/api/profiles/', require('./rest_api/profiles'));
app.use('/api/payment/', require('./rest_api/payment'));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

