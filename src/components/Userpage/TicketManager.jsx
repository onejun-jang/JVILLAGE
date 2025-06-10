import React, { useState, useEffect } from 'react';
import styles from './TicketManager.module.css';

const TicketManager = () => {
  const [lessonTickets, setLessonTickets] = useState(0);
  const [cancelTickets, setCancelTickets] = useState(0);

  useEffect(() => {
    fetch('/api/tickets/userTickets')
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setLessonTickets(data.lessonTickets);
          setCancelTickets(data.cancelTickets);
        } else {
          alert('受講券読み込みエラー');
        }
      })
      .catch(() => alert('サーバ―エラー'));
  }, []);

  const handleBuyTicket = async () => {
    try {
      const res = await fetch('/api/payment/create-payment', { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        // 페이페이 결제창 열기기
        window.open(data.qrUrl, '_blank');

      } else {
        alert(data.error || 'PAYPAY 管理コードエラー');
      }
    } catch (err) {
      alert('PAYPAY QRコード情報読み込みエラー');
      console.error(err);
    }
  };

  const handleTestAdd = async () => {
    try {
      const res = await fetch('/api/tickets/addTestTickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      const data = await res.json();
      if (data.success) {
        setLessonTickets(prev => prev + 1);
        setCancelTickets(prev => prev + 1);
      } else {
        alert(data.message || 'チケット追加に失敗しました。');
      }
    } catch (err) {
      alert('エラーが発生しました。');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🎫 回数券管理</h2>

      <div className={styles.ticketInfo}>
        <p>
          現在の <span className={styles.highlightLesson}>受講券</span> : {lessonTickets} 枚
        </p>
        <p>
          現在の <span className={styles.highlightCancel}>キャンセル券</span> : {cancelTickets} 枚
        </p>
      </div>

      <div className={styles.buttonGroup}>
        <button onClick={handleBuyTicket} className={styles.buyButton}>
          💳 PayPayで購入
        </button>
        <button onClick={handleTestAdd} className={styles.testButton}>
          [テスト用] 枚数 +1
        </button>
      </div>
    </div>
  );
};

export default TicketManager;
