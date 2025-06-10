const express = require('express');
const router = express.Router();
const db = require('../lib/db');     
const dayjs = require('dayjs');

router.get('/getAvailabilityTable', async (req, res) => {
  const today = new Date();
  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
    '19:00', '19:30', '20:00', '20:30'
  ];

 
  const dates = [];
  for (let i = 1; i < 29; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
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
    res.status(500).json({ error: 'DB照会エラー' });
  }
});

router.post('/reserve', async (req, res) => {
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
        throw new Error(`${slot.date} ${slot.time}は他のユーザーが既に予約しました。他の時間をお選びください。`);
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

router.get('/getMyReservations', async (req, res) => {
  if (!req.session.is_logined || !req.session.nickname) {
    return res.status(401).json({ error: 'ログインしてください。' });
  }

  try {
    const [rows] = await db.query(
      'SELECT DATE_FORMAT(date, "%Y-%m-%d") as date, time FROM reservations WHERE username = ? ORDER BY date, time',
      [req.session.nickname]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'DB照会エラー' });
  }
});

router.post('/cancelReservation', async (req, res) => {
  const { date, time } = req.body;
  const username = req.session.nickname;

  if (!username) {
    return res.status(401).json({ success: false, message: 'ログインしてください。' });
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
    res.status(500).json({ success: false, message: 'DBエラー' });
  }
});


router.get('/getMyReservations', async (req, res) => {
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

router.get('/getMyPastReservations', async (req, res) => {
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

module.exports = router;