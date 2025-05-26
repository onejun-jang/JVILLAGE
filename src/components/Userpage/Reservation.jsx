// 기존 import 유지
import styles from './Reservation.module.css';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';

function Reservation() {
  const [reserved, setReserved] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [availabilityTable, setAvailabilityTable] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]); // 배열로 변경

  // 다음날부터 +14일까지로 일단 설정
  const getNext14Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i < 15; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d.toISOString().split('T')[0]); // YYYY-MM-DD, 나중에 dayjs로 변경하기
    }
    return dates;
  };

  const timeSlots = [
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30',
    '20:00', '20:30'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reservedRes = await fetch('/getMyReservations', { credentials: 'include' });
        const reservedData = await reservedRes.json();
        setReserved(reservedData);

        const pastRes = await fetch('/getMyPastReservations', { credentials: 'include' });
        const pastData = await pastRes.json();
        setPastReservations(pastData);

        const availRes = await fetch('/getAvailabilityTable', { credentials: 'include' });
        const availData = await availRes.json();
        setAvailabilityTable(availData);
      } catch (error) {
        console.error('데이터 불러오기 오류:', error);
      }
    };

    fetchData();
  }, []);

  const handleCellClick = (date, time) => {
    const alreadySelected = selectedSlots.find(s => s.date === date && s.time === time);

    if (alreadySelected) {
      setSelectedSlots(prev => prev.filter(s => !(s.date === date && s.time === time)));
    } else {
      setSelectedSlots(prev => [...prev, { date, time }]);
    }
  };

  const handleReserve = async () => {
    if (selectedSlots.length === 0) return;

    if (!window.confirm(`選択した${selectedSlots.length}件の予約を確定しますか？`)) return;

    try {
      const res = await fetch('/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots: selectedSlots }),
        credentials: 'include'
      });

      const data = await res.json();

      if (data.success) {
        alert('予約が成功しました。キャンセルは前日の22時までです。');

        const reservedRes = await fetch('/getMyReservations', { credentials: 'include' });
        const reservedData = await reservedRes.json();
        setReserved(reservedData);

        const availRes = await fetch('/getAvailabilityTable', { credentials: 'include' });
        const availData = await availRes.json();
        setAvailabilityTable(availData);

        setSelectedSlots([]);
      } else {
        alert('選択した時間の一部が既予約されています。');
      }
    } catch (error) {
      console.error(error);
      alert('예약 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = async (date, time) => {
    if (!window.confirm(`${date} ${time} の予約をキャンセルしますか？`)) return;

    try {
      const res = await fetch('/cancelReservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, time }),
        credentials: 'include'
      });

      const data = await res.json();
      if (data.success) {
        alert('予約がキャンセルされました。');

        const reservedRes = await fetch('/getMyReservations', { credentials: 'include' });
        const reservedData = await reservedRes.json();
        setReserved(reservedData);

        const availRes = await fetch('/getAvailabilityTable', { credentials: 'include' });
        const availData = await availRes.json();
        setAvailabilityTable(availData);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert('서버 오류로 예약 취소에 실패했습니다.');
    }
  };

  const dateHeaders = getNext14Days();

  return (
    <div className={styles.reservationContainer}>
      <div className={styles.statusWrapper}>
        <div className={styles.reservedSection}>
          <h2>予約状況</h2>
          <ul>
            {reserved.filter(item => {
              const now = new Date();
              const reservationDateTime = new Date(`${item.date}T${item.time}:00`);
              return reservationDateTime > now;
            }).length === 0 ? (
              <li>登録済みの受講予定はありません。</li>
            ) : (
              reserved
                .filter(item => {
                  const now = new Date();
                  const reservationDateTime = new Date(`${item.date}T${item.time}:00`);
                  return reservationDateTime > now;
                })
                .map((item, idx) => {
                  const now = new Date();
                  const cancelDeadline = new Date(`${item.date}T22:00:00`);
                  cancelDeadline.setDate(cancelDeadline.getDate() - 1);
                  const isPastCancelDeadline = now > cancelDeadline;

                  return (
                    <li key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{item.date} - {item.time}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!isPastCancelDeadline && (
                          <button
                            onClick={() => handleCancel(item.date, item.time)}
                            style={{ cursor: 'pointer' }}
                          >
                            取消
                          </button>
                        )}
                        {isPastCancelDeadline && (
                          <span style={{ fontSize: '0.85em', color: '#888' }}>*前日の22時過ぎてキャンセル不可</span>
                        )}
                      </div>
                    </li>
                  );
                })
            )}
          </ul>
        </div>

      <div className={styles.pastSection}>
        <h2>受講履歴</h2>
        <ul>
          {pastReservations.length === 0 ? (
            <li>受講履歴がありません。</li>
          ) : (
            pastReservations.map((item, idx) => {
              const localDate = dayjs(item.date).add(9, 'hour').format('YYYY-MM-DD');
              return (
                <li key={idx}>
                  {localDate} - {item.time}
                </li>
              );
            })
          )}
        </ul>
      </div>
      </div>

      <h2>スケジュール表</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.reservationTable}>
          <thead>
            <tr>
              <th>時</th>
              {dateHeaders.map(date => (
                <th key={date}>{date.slice(5)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map(time => (
              <tr key={time}>
                <td>{time}</td>
                {dateHeaders.map(date => {
                  const cell = availabilityTable.find(c => c.date === date && c.time === time);
                  const isAvailable = cell ? cell.isAvailable : false;
                  const isSelected = selectedSlots.some(s => s.date === date && s.time === time);

                  return (
                    <td
                      key={date + time}
                      className={`${styles.cell} 
                        ${isAvailable ? styles.available : styles.unavailable} 
                        ${isSelected ? styles.selected : ''}`}
                      onClick={() => isAvailable && handleCellClick(date, time)}
                    >
                      {isAvailable ? '○' : '×'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlots.length > 0 && (
        <div className={styles.reserveConfirm}>
          選択された時間:
          <ul>
            {selectedSlots.map((slot, idx) => (
              <li key={idx}>{slot.date} {slot.time}</li>
            ))}
          </ul>
          <button onClick={handleReserve}>予約</button>
        </div>
      )}
    </div>
  );
}

export default Reservation;
