const express = require('express');
const router = express.Router();
const db = require('../lib/db');     
const bcrypt = require('bcrypt');    


router.get('/authcheck', (req, res) => {      
  const sendData = { isLogin: "" };
  if (req.session.is_logined) {
    sendData.isLogin = "True"
  } else {
    sendData.isLogin = "False"
  }
  res.send(sendData);
})

router.get('/logout', function (req, res) {
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});

router.post("/login", async (req, res) => { 
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
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.is_logined = true;
        req.session.nickname = user.username;
        req.session.nickname2 = user.firstnameKana;
        req.session.save(() => {
          sendData.isLogin = "True";
          res.send(sendData);
        });

        // 로그 기록은 에러 무시하고 비동기 실행
        db.query(
          `INSERT INTO logtable (created, username, action, command, actiondetail) VALUES (NOW(), ?, 'login', ?, ?)`,
          [username, '-', 'テスト']
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
    res.status(500).send({ error: 'ログインエラー' });
  }
});


router.post("/signin/check", async (req, res) => {
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



const crypto = require('crypto');
const nodemailer = require('nodemailer');


async function sendVerificationEmail(toEmail, token) {
  const transporter = nodemailer.createTransport({
    // SMTP 설정 예시 (Gmail 등)
    service: 'gmail',
    auth: {
      user: 'jjjwjpower@gmail.com',
      pass: 'rwbs wdzi ebzn szty'
    }
  });

  // const verificationUrl = `https://1755-180-60-37-129.ngrok-free.app/api/auth/verify-email?token=${token}`;
  const verificationUrl = `http://localhost:3001/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: '"Your App" <your_email@gmail.com>',
    to: toEmail,
    subject: 'JVILLAGEのメール認証を完了してください。',
    html: `<p>こちらのリンクをクリックして会員登録を完了してください：</p>
           <a href="${verificationUrl}">${verificationUrl}</a>`
  };

  await transporter.sendMail(mailOptions);
}


router.post("/signin", async (req, res) => {
  const { userId, userPassword, lastnameKanji, firstnameKanji, lastnameKana, firstnameKana, phoneNumber, idavailable, pwavailable } = req.body;
  const sendData = { isSuccess: "" };

  if (!userId || !userPassword || !phoneNumber || !lastnameKanji || !firstnameKanji || !lastnameKana || !firstnameKana) {
    sendData.isSuccess = "必須項目を入力してください。";
    return res.send(sendData);
  }

  if (!idavailable) {
    sendData.isSuccess = "IDチェックをしてください。";
    return res.send(sendData);
  }
  if (!pwavailable) {
    sendData.isSuccess = "パスワードを確認してください。";
    return res.send(sendData);
  }

  try {
    // 중복 방지: 기존 emailverifications, userTable 확인 가능

    // 토큰 생성
    const token = crypto.randomBytes(32).toString('hex');
    const hashedPassword = await bcrypt.hash(userPassword, 10);

    // 기존 동일 username이 emailverifications에 있으면 삭제 (중복 방지)
    await db.query('DELETE FROM emailverifications WHERE username = ?', [userId]);

    // emailverifications 테이블에 임시 저장
    await db.query(
      `INSERT INTO emailverifications 
      (username, password, phoneNumber, lastnameKanji, firstnameKanji, lastnameKana, firstnameKana, token) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, hashedPassword, phoneNumber, lastnameKanji, firstnameKanji, lastnameKana, firstnameKana, token]
    );

    // 인증 메일 발송
    await sendVerificationEmail(userId, token);

    sendData.isSuccess = "True";
    res.send(sendData);

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: '会員登録エラー' });
  }
});


router.get('/sessioninfo', (req, res) => {
  console.log(req.session); // 서버 콘솔에 출력
  res.json(req.session);    
});



router.get('/verify-email', async (req, res) => {
  const token = req.query.token;
  if (!token) return res.status(400).send('トークンがありません。');

  try {
    const [rows] = await db.query('SELECT * FROM emailverifications WHERE token = ?', [token]);
    if (rows.length === 0) {
      return res.status(400).send('無効なトークンか期限が切れています。');
    }

    const user = rows[0];
    await db.query(
      'INSERT INTO userTable (username, password, phoneNumber, lastnameKanji, firstnameKanji, lastnameKana, firstnameKana) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user.username, user.password, user.phoneNumber, user.lastnameKanji, user.firstnameKanji, user.lastnameKana, user.firstnameKana]
    );

    await db.query(
      'INSERT INTO userTickets (username, lesson_tickets, cancel_tickets) VALUES (?, ?, ?)',
      [user.username, 1, 0]
    );

    // 인증 레코드 삭제
    await db.query('DELETE FROM emailverifications WHERE username = ?', [user.username]);

    return res.redirect('http://localhost:3000/Signinverified');
  } catch (error) {
    console.error(error);
    res.status(500).send('サーバーエラー');
  }
});



module.exports = router;