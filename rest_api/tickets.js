const express = require('express');
const router = express.Router();
const db = require('../lib/db');     

router.get('/userTickets', async (req, res) => {
  const username = req.session.nickname;

  if (!username) {
    return res.status(401).json({ success: false, message: 'ログインしてください。' });
  }

  try {
    const [[userTickets]] = await db.query(
      'SELECT lesson_tickets, cancel_tickets FROM userTickets WHERE username = ?',
      [username]
    );

    if (!userTickets) {
      return res.status(404).json({ success: false, message: 'チケットの情報がございません。' });
    }

    res.json({ 
      success: true, 
      lessonTickets: userTickets.lesson_tickets, 
      cancelTickets: userTickets.cancel_tickets 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'チケットサーバーエラーエラー' });
  }
});

router.post('/addTestTickets', async (req, res) => {
  const username = req.session.nickname;

  if (!username) {
    return res.status(401).json({ success: false, message: 'ログインしてください。' });
  }

  try {
    await db.query(
      'UPDATE userTickets SET lesson_tickets = lesson_tickets + 1, cancel_tickets = cancel_tickets + 1 WHERE username = ?',
      [username]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'チケット回数エラー' });
  }
});




module.exports = router;