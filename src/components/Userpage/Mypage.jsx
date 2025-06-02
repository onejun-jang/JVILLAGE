import styles from './Mypage.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Reservation from './Reservation';
import TicketManager from './TicketManager';
import ProfileEdit from './ProfileEdit';

function Mypage({ setIsLogin }) {
  const [userName, setUserName] = useState('NAME');
  const [activeTab, setActiveTab] = useState('reservation'); 
  const navigate = useNavigate();


//인삿말
  useEffect(() => {
    fetch('/getUsername',{
        credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setUserName(data.username || '？？？');
      });
  }, []);

  const handleLogout = () => {
    fetch('/logout', {
        credentials: 'include'
    })
      .then(() => {
        setIsLogin(false);
        navigate('/login');
      });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.welcome}>
          {userName}様, 안녕하세요!
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          ログアウト
        </button>
      </div>

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <button onClick={() => setActiveTab('reservation')}>予約管理</button>
          <button onClick={() => setActiveTab('ticket')}>回数券管理</button>
          <button onClick={() => setActiveTab('profile')}>個人情報修正</button>
        </div>

        <div className={styles.content}>
          {activeTab === 'reservation' && <Reservation />}
          {activeTab === 'ticket' && <TicketManager />}
          {activeTab === 'profile' && <ProfileEdit setIsLogin={setIsLogin} />}
        </div>
      </div>
    </div>
  );
}

export default Mypage;
