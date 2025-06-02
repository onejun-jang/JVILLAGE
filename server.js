const express = require('express')
const cors = require('cors')
const session = require('express-session')
const path = require('path');
const dayjs = require('dayjs');


const app = express()
const port = 3001

const db = require('./lib/db'); // mysql2/promise 기반
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
  saveUninitialized: false,
    cookie: {
    httpOnly: true,
    secure: false,  // HTTPS가 아니라면 false
    sameSite: 'lax', // 또는 'strict'
    maxAge: 1000 * 60 * 60 * 24 
  }
}))

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,                // 세션 쿠키 주고받을 때 필요
}));

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

app.post("/login", async (req, res) => { 
  const username = req.body.userId;
  const password = req.body.userPassword;
  const sendData = { isLogin: "" };

  if (!username || !password) {
    sendData.isLogin = "ID及びパスワードを入力してください。";
    return res.send(sendData);
  }

  try {
    const [results] = await db.query('SELECT * FROM userTable WHERE username = ?', [username]);
    if (results.length > 0) {
      const user = results[0];
      // console.log(user);
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.is_logined = true;
        req.session.nickname = user.username;
        // console.log(req.session.nickname);
        req.session.nickname2 = user.firstnameKana;
        // console.log(req.session.nickname2);
        req.session.save(() => {
          sendData.isLogin = "True";
          res.send(sendData);
        });

        // 로그 기록은 에러 무시하고 비동기 실행
        db.query(
          `INSERT INTO logtable (created, username, action, command, actiondetail) VALUES (NOW(), ?, 'login', ?, ?)`,
          [username, '-', `React 로그인 테스트`]
        ).catch(console.error);

      } else {
        sendData.isLogin = "ログイン情報が一致していません。";
        res.send(sendData);
      }
    } else {
      sendData.isLogin = "存在しないIDです。";
      res.send(sendData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: '서버 오류' });
  }
});

app.post("/signin/check", async (req, res) => {
  const username = req.body.userId;
  const sendData = { isIDcheck: "" };

  try {
    const [results] = await db.query('SELECT * FROM userTable WHERE username = ?', [username]);
    if (results.length <= 0) {
      sendData.isIDcheck = "True"
    } else {                                                              
      sendData.isIDcheck = "既に存在するIDです。"
    }
    res.send(sendData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: '서버 오류' });
  }
});

app.post("/signin", async (req, res) => {  
  const username = req.body.userId;
  const password = req.body.userPassword;
  const lastnameKanji = req.body.lastnameKanji;
  const firstnameKanji = req.body.firstnameKanji;
  const lastnameKana = req.body.lastnameKana;
  const firstnameKana = req.body.firstnameKana;
  const idavailable = req.body.idavailable;
  const pwavailable = req.body.pwavailable;
  const phoneNumber = req.body.phoneNumber;
  
  const sendData = { isSuccess: "" };

  if (!username) {
    sendData.isSuccess = "IDを入力してください。"
    return res.send(sendData);
  } 
  if (!password) {
    sendData.isSuccess = "パスワードを入力してください。"
    return res.send(sendData);
  } 
  if (!phoneNumber) {
    sendData.isSuccess = "電話番号を入力してください。"
    return res.send(sendData);
  }   
  if (!lastnameKanji || !firstnameKanji || !lastnameKana || !firstnameKana) {
    sendData.isSuccess = "氏名を確認してください。"
    return res.send(sendData);
  }

  try {
    const [results] = await db.query('SELECT * FROM userTable WHERE username = ?', [username]);

    if (idavailable && pwavailable) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        'INSERT INTO userTable (username, password, phoneNumber, lastnameKanji, firstnameKanji, lastnameKana, firstnameKana) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [username, hashedPassword, phoneNumber, lastnameKanji, firstnameKanji, lastnameKana, firstnameKana]
      );
      await db.query(
        'INSERT INTO userTickets (username, lesson_tickets, cancel_tickets) VALUES (?, ?, ?)',
        [username, 1, 0]
      );
      await new Promise((resolve) => req.session.save(resolve)); // 세션 저장 대기
      sendData.isSuccess = "True";
      res.send(sendData);

    } else if (!idavailable) {
      if (idavailable === false) {
        sendData.isSuccess = "既に存在するIDです。"
      } else if (idavailable === null) {
        sendData.isSuccess = "IDCheckを押してください。"
      }
      res.send(sendData);
    } else {
      sendData.isSuccess = "パスワードを確認してください。"
      res.send(sendData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: '서버 오류' });
  }
});

app.get('/getAvailabilityTable', async (req, res) => {
  const today = new Date();
  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30'
  ];

 
  const dates = [];
  for (let i = 1; i < 15; i++) {
    const date = new Date(today);
    // console.log("date:", date);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
    // console.log("dates:", dates);
  }

  const placeholders = dates.map(() => '?').join(',');
  const sql = `SELECT date, time FROM reservations WHERE date IN (${placeholders})`;

  try {
    const [rows] = await db.query(sql, dates);
    const convertedRows = rows.map(r => {
  const localDate = new Date(r.date);
  localDate.setHours(localDate.getHours() + 9); // UTC → JST
  return {
    ...r,
    date: localDate.toISOString().split('T')[0], // JST 기준 날짜
  };
});

    const reservedSet = new Set(convertedRows.map(r => `${r.date}_${r.time}`));

    const result = [];
    dates.forEach(date => {
      timeSlots.forEach(time => {
        const key = `${date}_${time}`;
        result.push({
          date,
          time,
          isAvailable: !reservedSet.has(key)
        });
      });
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'DB 조회 중 오류 발생' });
  }
});

app.post('/reserve', async (req, res) => {
  const slots = req.body.slots; 
  const username = req.session.nickname;

  if (!username) {
    return res.status(401).json({ success: false, message: 'ログインしてください。' });
  }

  if (!Array.isArray(slots) || slots.length === 0) {
    return res.status(400).json({ success: false, message: '予約の時間帯を選択して下さい。' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [[user]] = await connection.query(
      'SELECT lesson_tickets FROM userTickets WHERE username = ?',
      [username]
    );

    if (!user) {
      throw new Error('ユーザー情報が見つかりません。');
    }

    if (user.lesson_tickets < slots.length) {
      throw new Error('受講券が不足しています。');
    }    

    for (const slot of slots) {
      const [rows] = await connection.query(
        'SELECT * FROM reservations WHERE date = ? AND time = ?',
        [slot.date, slot.time]
      );
      if (rows.length > 0) {
        throw new Error(`${slot.date} ${slot.time} 은 이미 예약되었습니다.`);
      }

      await connection.query(
        'INSERT INTO reservations (username, date, time) VALUES (?, ?, ?)',
        [username, slot.date, slot.time]
      );
    }

      await connection.query(
      'UPDATE userTickets SET lesson_tickets = lesson_tickets - ? WHERE username = ?',
      [slots.length, username]
    );


    await connection.commit();
    res.json({ success: true });
  } catch (err) {
    await connection.rollback();
    res.json({ success: false, message: err.message });
  } finally {
    connection.release();
  }
});

app.get('/getUsername', (req, res) => {
  if (req.session.is_logined && req.session.nickname) {
    res.json({ username: req.session.nickname2 });
  } else {
    res.json({ username: null });
  }
});


app.get('/getMyReservations', async (req, res) => {
  if (!req.session.is_logined || !req.session.nickname) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    const [rows] = await db.query(
      'SELECT DATE_FORMAT(date, "%Y-%m-%d") as date, time FROM reservations WHERE username = ? ORDER BY date, time',
      [req.session.nickname]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'DB 조회 오류' });
  }
});


app.post('/cancelReservation', async (req, res) => {
  const { date, time } = req.body;
  const username = req.session.nickname;

  if (!username) {
    return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
  }

  try {
    const cancelDeadline = dayjs(`${date}T00:00:00Z`).subtract(1, 'day').hour(31).minute(0).second(0); // 전날 22시로하려면 hour31로 설정해야됨(이유는모름)
    const now = dayjs().add(9, 'hour');

    if (now.isAfter(cancelDeadline)) {
      return res.status(400).json({ success: false, message: 'キャンセル可能な時間が過ぎました。 受講日前日の22時までキャンセル可能です。' });
    }

    const [[ticketRow]] = await db.query(
      'SELECT cancel_tickets FROM userTickets WHERE username = ?',
      [username]
    );

    if (!ticketRow || ticketRow.cancel_tickets < 1) {
      return res.status(400).json({ success: false, message: 'キャンセル券が不足しています。' });
    }    

    const [result] = await db.query(
      'DELETE FROM reservations WHERE username = ? AND date = ? AND time = ?',
      [username, date, time]
    );



    if (result.affectedRows > 0) {
        await db.query(
        'UPDATE userTickets SET cancel_tickets = cancel_tickets - 1, lesson_tickets = lesson_tickets +1 WHERE username = ?',
        [username]
      );
      res.json({ success: true });
    } else {
      res.json({ success: false, message: '該当する予約が存在しないか、既にキャンセルされました。' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'DB 오류가 발생했습니다.' });
  }
});


app.get('/getMyReservations', async (req, res) => {
  const username = req.session.nickname;
  if (!username) return res.status(401).json([]);

  try {
    const [rows] = await db.query(
      'SELECT * FROM reservations WHERE username = ? AND CONCAT(date, " ", time) >= NOW() ORDER BY date, time',
      [username]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

app.get('/getMyPastReservations', async (req, res) => {
  const username = req.session.nickname;
  if (!username) return res.status(401).json([]);

  try {
    const [rows] = await db.query(
      `SELECT * FROM reservations WHERE username = ? AND DATE_ADD(STR_TO_DATE(CONCAT(date, ' ', time), '%Y-%m-%d %H:%i:%s'), INTERVAL 25 MINUTE) < NOW() ORDER BY date DESC, time DESC`,
      [username]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

app.get('/userTickets', async (req, res) => {
  const username = req.session.nickname;

  if (!username) {
    return res.status(401).json({ success: false, message: '로그인이 필요합니다.' });
  }

  try {
    const [[userTickets]] = await db.query(
      'SELECT lesson_tickets, cancel_tickets FROM userTickets WHERE username = ?',
      [username]
    );

    if (!userTickets) {
      return res.status(404).json({ success: false, message: '사용자 티켓 정보가 없습니다.' });
    }

    res.json({ 
      success: true, 
      lessonTickets: userTickets.lesson_tickets, 
      cancelTickets: userTickets.cancel_tickets 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
  }
});

app.post('/addTestTickets', async (req, res) => {
  const username = req.session.nickname;

  if (!username) {
    return res.status(401).json({ success: false, message: '로그인이 필요합니다。' });
  }

  try {
    await db.query(
      'UPDATE userTickets SET lesson_tickets = lesson_tickets + 1, cancel_tickets = cancel_tickets + 1 WHERE username = ?',
      [username]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'DB 오류가 발생했습니다。' });
  }
});

app.get('/sessioninfo', (req, res) => {
  console.log(req.session); // 서버 콘솔에 출력
  res.json(req.session);    // 클라이언트에 응답
});


app.post('/verify-password', async (req, res) => {
  const user = req.session.nickname;
  const { password } = req.body;

  const [rows] = await db.query('SELECT password FROM userTable WHERE username = ?', [user]);

  if (rows.length === 0) return res.sendStatus(401);

  const match = await bcrypt.compare(password, rows[0].password);
  if (match) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

app.get('/get-profile', async (req, res) => {
  const user = req.session.nickname;

  const [rows] = await db.query(
    'SELECT lastnameKanji, firstnameKanji, lastnameKana, firstnameKana, phoneNumber FROM userTable WHERE username = ?',
    [user]
  );

  if (rows.length === 0) return res.sendStatus(404);

  res.json(rows[0]);
});

app.post("/update-password", async (req, res) => {  
  const password = req.body.userPassword;
  const password2 = req.body.userPassword2;
  const pwavailable = req.body.pwavailable;
  const sendData = { isSuccess: "" };

  if (!password) {
    sendData.isSuccess = "パスワードを入力してください。"
    return res.send(sendData);
  } 

  try {
    const [results] = await db.query('SELECT * FROM userTable WHERE username = ?', [req.session.nickname]);

    if (pwavailable) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query(
        'UPDATE userTable SET password = ? WHERE username = ?', 
        [hashedPassword, req.session.nickname]
      );
      await new Promise((resolve) => req.session.save(resolve)); // 세션 저장 대기
      sendData.isSuccess = "True";
      res.send(sendData);

    } else {
      sendData.isSuccess = "パスワードを確認してください。"
      res.send(sendData);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: '서버 오류' });
  }
});

app.post('/update-profile-info', async (req, res) => {
  const user = req.session.nickname;
  const { lastnameKanji, firstnameKanji, lastnameKana, firstnameKana, phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'あっちいけ' })
  }  
  if (!lastnameKanji || !firstnameKanji || !lastnameKana || !firstnameKana) {
    return res.status(400).json({ message: '이름을 입력해주세요' })
  }  

  await db.query(
    'UPDATE userTable SET phoneNumber = ?, lastnameKanji = ?, firstnameKanji = ?, lastnameKana = ?, firstnameKana = ? WHERE username = ?',
    [phoneNumber, lastnameKanji, firstnameKanji, lastnameKana, firstnameKana, user]
  );

  res.sendStatus(200);
});



const PAYPAY = require('@paypayopa/paypayopa-sdk-node');

const API_KEY = 'a_yVvl6BiDOn_C6AC';
const API_SECRET = 'BkcwQiveG52X4icJUVTl4QtAxxHX4CHNpD3kgm4Uz8k=';
const MERCHANT_ID = '921806514829295616';

PAYPAY.Configure({
  clientId: API_KEY,
  clientSecret: API_SECRET,
  merchantId: MERCHANT_ID,
  productionMode: false
});

app.post('/create-payment', (req, res) => {
  const merchantPaymentId = `${req.session.nickname}_${Date.now()}`;

  let payload = {
    merchantPaymentId,
    amount: { amount:1500, currency: "JPY" },
    codeType: "ORDER_QR",
    orderDescription: "回数券",
    isAuthorization: false
  };

  PAYPAY.QRCodeCreate(payload, (response) => {
    if (response.BODY.resultInfo.code === "SUCCESS") {
      res.json({
        success: true,
        qrUrl: response.BODY.data.url,
        merchantPaymentId
      });
    } else {
      res.status(500).json({
        success: false,
        error: response.BODY.resultInfo.message
      });
    }
  });
});


//임시

app.use(express.json());
app.post('/paypay-webhook', async (req, res) => {
  console.log(req.body);
  const { state, merchant_order_id} = req.body;
  console.log('state:',state);
  console.log(merchant_order_id);

  
  if (state !== 'COMPLETED') {
    return res.status(400).json({ message: '결제 미완료 상태입니다.' });
  }

 
  try {
    db.query('UPDATE usertickets SET lesson_tickets = lesson_tickets + 1, cancel_tickets = cancel_tickets + 1 WHERE username = ?',[merchant_order_id.split('_')[0]]);

    return res.status(200).json({ message: '수강권 업데이트 완료' });
  } catch (err) {
    console.error('DB 처리 오류:', err);
    return res.status(500).json({ message: '서버 내부 오류' });
  }
});










app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

