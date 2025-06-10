import styles from './SigninVerified.module.css';
import loginimage from '../assets/images/JVILLAGE.png';
import { useNavigate } from 'react-router-dom';

export default function SigninVerified(props){

  const navigate = useNavigate();

  return (
    <div className={styles.layout}>
        <div className={styles.content}>
            <img src={loginimage} alt="LOGINIMAGE" className={styles.loginImage}/>
            <h1>会員登録が完了しました！</h1>
            {/* <div style={{ height: '1vh' }}></div> */}
            <p>ログインして無料体験から楽しみましょう😆</p>
            <div style={{ height: '5vh' }}></div>
            <button className={styles.btn} onClick={() => {
            navigate('/login');
          }}>ログイン</button>
        </div>
    </div>
  );
};

