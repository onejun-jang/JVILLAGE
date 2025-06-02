import styles from './Login.module.css';
import loginimage from '../assets/images/loginimage.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false); 
  const navigate = useNavigate();

  //아이디 저장 기능용용
  useEffect(() => {
    const savedId = localStorage.getItem('rememberedId');
    if (savedId) {
      setId(savedId);
      setRememberId(true);
    }
  }, []);

  const handleLogin = () => {
    // ID 기억 체크 상태에 따라 저장 또는 삭제
    if (rememberId) {
      localStorage.setItem('rememberedId', id);
    } else {
      localStorage.removeItem('rememberedId');
    }

    const userData = {
      userId: id,
      userPassword: password,
    };

    fetch("/login", { 
      method: "post", 
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(userData), 
      credentials: 'include'
    })
    .then((res) => res.json())
    .then((json) => {           
      console.log("ログインサーバー応答:", json);  
      if(json.isLogin==="True"){
        props.setIsLogin(true);
        navigate('/mypage');
      } else {
        alert(json.isLogin);
      }
    });
  };
  
  return <>
    <div className={styles.layout}>
      <div className={styles.content}>
        <img src={loginimage} alt="LOGINIMAGE" className={styles.loginImage}/>
        <div className={styles.loginForm}>
          <h1>ログイン</h1>
      
          <div className={styles.form}>
            <p><input className={styles.login} type="text" name="username" placeholder="Example @ jvillage.com" value={id} onChange={event => {
              setId(event.target.value);
            }} /></p>
            <p><input className={styles.login} type="password" name="pwd" placeholder="パスワード" onChange={event => {
              setPassword(event.target.value);
            }} /></p>
            <p style={{ textAlign: 'left', padding: '0 0 0 11%' }}>
              <input
                type="checkbox"
                id="rememberId"
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
              />
              <label htmlFor="rememberId">IDを保存する</label>
            </p>              
      
            <p><input className={styles.btn} type="submit" value="ログイン" onClick={handleLogin} /></p>
          </div>
      
          <p>アカウントがまだですか？  <button onClick={() => {
            navigate('/signin');
          }}>会員登録</button></p>
        </div>
      </div>
    </div>
  </> 
  }

  export default Login;