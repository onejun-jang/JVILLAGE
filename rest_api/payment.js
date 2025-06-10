const express = require('express');
const router = express.Router();
const db = require('../lib/db');     
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

router.post('/create-payment', (req, res) => {
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


//페이페이 결제 후 웹훅(ngrok, 결제트랜잭션통지 웹훅 url 확인할것것)
router.use(express.json());
router.post('/paypay-webhook', async (req, res) => {
  console.log(req.body);
  const { state, merchant_order_id} = req.body;
  console.log('state:',state);
  console.log(merchant_order_id);

  
  if (state !== 'COMPLETED') {
    return res.status(400).json({ message: '支払いが完了していません。' });
  }

 
  try {
    db.query('UPDATE usertickets SET lesson_tickets = lesson_tickets + 1, cancel_tickets = cancel_tickets + 1 WHERE username = ?',[merchant_order_id.split('_')[0]]);

    return res.status(200).json({ message: 'チケットアップデート完了' });
  } catch (err) {
    console.error('DBエラー:', err);
    return res.status(500).json({ message: '支払いサーバーエラー' });
  }
});


module.exports = router;