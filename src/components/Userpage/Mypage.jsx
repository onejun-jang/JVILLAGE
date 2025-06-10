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
    fetch('/api/profiles/getUsername',{
        credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setUserName(data.username || '？？？');
      });
  }, []);

  const handleLogout = () => {
    fetch('/api/auth/logout', {
        credentials: 'include'
    })
      .then(() => {
        setIsLogin(false);
        navigate('/login');
      });
  };

  useEffect(() => {
  const savedTab = localStorage.getItem('mypage-active-tab');
  if (savedTab) {
    setActiveTab(savedTab);
  }
  }, []);

  const handleTabChange = (tab) => {
  setActiveTab(tab);
  localStorage.setItem('mypage-active-tab', tab);
  };  

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.headerLeft}> 
          <span style={{ color: 'red', fontSize: '60px', fontWeight: 700, fontStyle: 'italic' }}>J   </span>
          <span style={{ color: 'black', fontSize: '45px' }}>Village</span>
        </div>
        <div className={styles.headerRight}> 
          <div className={styles.welcome}>
            {userName}様, 안녕하세요!
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            ログアウト
          </button>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <button onClick={() => handleTabChange('reservation')}>予約管理</button>
          <button onClick={() => handleTabChange('ticket')}>回数券管理</button>
          <button onClick={() => handleTabChange('profile')}>個人情報修正</button>
        </div>

        <div className={styles.content}>
          {activeTab === 'reservation' && <Reservation />}
          {activeTab === 'ticket' && <TicketManager />}
          {activeTab === 'profile' && <ProfileEdit setIsLogin={setIsLogin} setUserName={setUserName}/>}
        </div>
      </div>
    </div>
  );
}

export default Mypage;
