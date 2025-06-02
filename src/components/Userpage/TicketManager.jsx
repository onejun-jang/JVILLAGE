import React, { useState, useEffect } from 'react';
import styles from './TicketManager.module.css';


const TicketManager = () => {
  const [lessonTickets, setLessonTickets] = useState(0);
  const [cancelTickets, setCancelTickets] = useState(0);


  useEffect(() => {
    fetch('/userTickets')
      .then(res => res.json())
      .then(data => {
        if(data.success) {
          setLessonTickets(data.lessonTickets);
          setCancelTickets(data.cancelTickets);
        } else {
          alert('수강권 정보를 불러오는데 실패했습니다.');
        }
      })
      .catch(() => alert('서버 연결 실패'));
  }, []);

  



const handleBuyTicket = async () => {
  try {
    const res = await fetch('/create-payment', { method: 'POST' });
    const data = await res.json();

    if (data.success) {
      // 새 창에 QR 코드 페이지 열기
      window.open(data.qrUrl, '_blank');

      // 결제 완료 후 사용자가 직접 완료 버튼 누르면 호출
      if (window.confirm('결제가 완료되었습니까? 완료하셨다면 확인을 눌러주세요.')) {
        const confirmRes = await fetch('/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ merchantPaymentId: data.merchantPaymentId })
        });

        const confirmData = await confirmRes.json();

        if (confirmData.success) {
          alert('수강권이 추가되었습니다!');
          // UI 즉시 반영
          setLessonTickets(prev => prev + 1);
        } else {
          alert('결제 확인 실패: ' + (confirmData.error || '알 수 없는 오류'));
        }
      }
    } else {
      alert(data.error || '결제 QR코드 생성 실패');
    }
  } catch (err) {
    alert('결제 생성 중 오류가 발생했습니다.');
    console.error(err);
  }
};


 
  const handleTestAdd = async () => {
  try {
    const res = await fetch('/addTestTickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await res.json();
    if (data.success) {
      // UI도 즉시 반영되게 state 업데이트
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
