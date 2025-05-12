const express = require('express')
const session = require('express-session')
const path = require('path');
const app = express()
const port = 3001

const db = require('./lib/db');
const sessionOption = require('./lib/sessionOption');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);
app.use(session({  
	key: 'session_cookie_name',
    secret: '~',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}))

// app.get('/', (req, res) => {    
//     res.sendFile(path.join(__dirname, '/build/index.html'));
// })

app.get('/authcheck', (req, res) => {      
    const sendData = { isLogin: "" };
    if (req.session.is_logined) {
        sendData.isLogin = "True"
    } else {
        sendData.isLogin = "False"
    }
    res.send(sendData);
})

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
});

app.post("/login", (req, res) => { // 데이터 받아서 결과 전송
    const username = req.body.userId;
    const password = req.body.userPassword;
    const sendData = { isLogin: "" };

    if (username && password) {             // id와 pw가 입력되었는지 확인
        db.query('SELECT * FROM userTable WHERE username = ?', [username], function (error, results, fields) {
            if (error) throw error;
                if (results.length > 0) {       // db에서의 반환값이 있다 = 일치하는 아이디가 있다.      

                bcrypt.compare(password , results[0].password, (err, result) => {    // 입력된 비밀번호가 해시된 저장값과 같은 값인지 비교

                    if (result === true) {                  // 비밀번호가 일치하면
                        req.session.is_logined = true;      // 세션 정보 갱신
                        req.session.nickname = username;
                        req.session.save(function () {
                            sendData.isLogin = "True"
                            res.send(sendData);
                        });
                        db.query(`INSERT INTO logtable (created, username, action, command, actiondetail) VALUES (NOW(), ?, 'login' , ?, ?)`
                            , [req.session.nickname, '-', `React 로그인 테스트`], function (error, result) { });
                    }
                    else{                                   // 비밀번호가 다른 경우
                        sendData.isLogin = "로그인 정보가 일치하지 않습니다."
                        res.send(sendData);
                    }
                })                      
                } else {    // db에 해당 아이디가 없는 경우
                    sendData.isLogin = "아이디 정보가 일치하지 않습니다."
                    res.send(sendData);
            }
        });
    } else {            // 아이디, 비밀번호 중 입력되지 않은 값이 있는 경우
        sendData.isLogin = "아이디와 비밀번호를 입력하세요!"
        res.send(sendData);
    }
});

app.post("/signin/check", (req, res) => {
    const username = req.body.userId;
    const sendData = { isIDcheck: "" };

    db.query('SELECT * FROM userTable WHERE username = ?', [username], function(error, results, fields) { 
        if (error) throw error;
        
        if (results.length <= 0) {
            sendData.isIDcheck = "True"
            res.send(sendData);        
            
        } else {                                                              
            sendData.isIDcheck = "既に存在するIDです。"
            res.send(sendData);  
          }    
    
    });

});

app.post("/signin", (req, res) => {  
    const username = req.body.userId;
    const password = req.body.userPassword;
    const password2 = req.body.userPassword2;
    const lastnameKanji = req.body.lastnameKanji;
    const firstnameKanji = req.body.firstnameKanji;
    const lastnameKana = req.body.lastnameKana;
    const firstnameKana = req.body.firstnameKana;
    const idavailable = req.body.idavailable;
    const pwavailable = req.body.pwavailable;
    
    const sendData = { isSuccess: "" };

    if (!username) {
        sendData.isSuccess = "IDを入力してください。"
        res.send(sendData);  
    } else if (!password) {
        sendData.isSuccess = "パスワードを入力してください。"
        res.send(sendData);  
    } else if(!lastnameKanji || !firstnameKanji || !lastnameKana || !firstnameKana) {
        sendData.isSuccess = "氏名を確認してください。"
        res.send(sendData);
    } else {
        db.query('SELECT * FROM userTable WHERE username = ?', [username], function(error, results, fields) { 
            if (error) throw error;
            
            if (idavailable && pwavailable) {         
                const hasedPassword = bcrypt.hashSync(password, 10);             
                    db.query('INSERT INTO userTable (username, password, lastnameKanji, firstnameKanji, lastnameKana, firstnameKana) VALUES (?, ?, ?, ?, ?, ?)', 
                        [username, hasedPassword, lastnameKanji, firstnameKanji, lastnameKana, firstnameKana],
                        function (error, data) {
                            if (error) throw error;
                            req.session.save(function () {                        
                                sendData.isSuccess = "True"
                                res.send(sendData);
                            });
                        });
            } else if(!idavailable){
                if(idavailable === false){
                    sendData.isSuccess = "既に存在するIDです。"
                    res.send(sendData);  
                }                                                              
                else if(idavailable === null){
                    sendData.isSuccess = "IDCheckを押してください。"
                    res.send(sendData);  
                }
            }
            　else {                                                              
                sendData.isSuccess = "パスワードを確認してください。"
                res.send(sendData);  
              }
        
        });
    }
 });            


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})