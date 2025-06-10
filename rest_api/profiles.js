const express = require('express');
const router = express.Router();
const db = require('../lib/db');     
const bcrypt = require('bcrypt');    


router.get('/getUsername', (req, res) => {
  if (req.session.is_logined && req.session.nickname) {
    res.json({ username: req.session.nickname2 });
  } else {
    res.json({ username: null });
  }
});

router.post('/verify-password', async (req, res) => {
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

router.get('/get-profile', async (req, res) => {
  const user = req.session.nickname;

  const [rows] = await db.query(
    'SELECT lastnameKanji, firstnameKanji, lastnameKana, firstnameKana, phoneNumber FROM userTable WHERE username = ?',
    [user]
  );

  if (rows.length === 0) return res.sendStatus(404);

  res.json(rows[0]);
});

router.post("/update-password", async (req, res) => {  
  const password = req.body.userPassword;
  const pwavailable = req.body.pwavailable;
  const sendData = { isSuccess: "" };

  if (!password) {
    sendData.isSuccess = "パスワードを入力してください。"
    return res.send(sendData);
  } 

  try {

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
    res.status(500).send({ error: 'パスワード変更エラー' });
  }
});

router.post('/update-profile-info', async (req, res) => {
  const user = req.session.nickname;
  const { lastnameKanji, firstnameKanji, lastnameKana, firstnameKana, phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: '電話番号を入力してください' })
  }  
  if (!lastnameKanji || !firstnameKanji || !lastnameKana || !firstnameKana) {
    return res.status(400).json({ message: '氏名を入力してください' })
  }  

  await db.query(
    'UPDATE userTable SET phoneNumber = ?, lastnameKanji = ?, firstnameKanji = ?, lastnameKana = ?, firstnameKana = ? WHERE username = ?',
    [phoneNumber, lastnameKanji, firstnameKanji, lastnameKana, firstnameKana, user]
  );

  req.session.nickname2 = firstnameKana;
    req.session.save(() => {
    res.status(200).json({ newUsername: req.session.nickname2 });
  });

});


module.exports = router;