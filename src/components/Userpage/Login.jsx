import styles from './Login.module.css';
import loginimage from '../assets/images/JVILLAGE.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberId, setRememberId] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/auth/authcheck', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.isLogin === 'True') {
          navigate('/mypage');  // 또는 '/mypage?tab=reservation'도 가능
        }
      });
  }, []);

  //아이디 저장 기능용용
  useEffect(() => {
    const savedId = localStorage.getItem('rememberedId');
    if (savedId) {
      setId(savedId);
      setRememberId(true);
    }
  }, []);

const handleLogin = (e) => {
  e.preventDefault(); // Enter나 버튼 클릭 시 새로고침 방지

  if (rememberId) {
    localStorage.setItem('rememberedId', id);
  } else {
    localStorage.removeItem('rememberedId');
  }

  const userData = {
    userId: id,
    userPassword: password,
  };

  fetch("/api/auth/login", {
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
      if (json.isLogin === "True") {
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
      
          <form className={styles.form} onSubmit={handleLogin}>
            <p>
              <input
                className={styles.login}
                type="text"
                name="username"
                placeholder="Example @ jvillage.com"
                value={id}
                onChange={(e) => setId(e.target.value)}
              />
            </p>
            <p>
              <input
                className={styles.login}
                type="password"
                name="pwd"
                placeholder="パスワード"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </p>
            <p className={styles.rememberCheckBox}>
              <input
                type="checkbox"
                id="rememberId"
                checked={rememberId}
                onChange={(e) => setRememberId(e.target.checked)}
              />
              <label htmlFor="rememberId">IDを保存する</label>
            </p>
            <p>
              <button className={styles.btn} type="submit">
                ログイン
              </button>
            </p>
          </form>
      
          <p>アカウントがまだですか？  <button style={{cursor : 'pointer'}} onClick={() => {
            navigate('/signin');
          }}>会員登録</button></p>
        </div>
      </div>
    </div>
  </> 
  }

  export default Login;