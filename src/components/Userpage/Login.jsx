import styles from './Login.module.css';
import loginimage from '../assets/images/loginimage.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login(props) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    return <>
      <div className={styles.layout}>
        <div className={styles.content}>
          <img src={loginimage} alt="LOGINimage" className={styles.loginImage}/>
          <div className={styles.loginForm}>
            <h1>ログイン</h1>
        
            <div className={styles.form}>
              <p><input className={styles.login} type="text" name="username" placeholder="Example @ jvillage.com" onChange={event => {
                setId(event.target.value);
              }} /></p>
              <p><input className={styles.login} type="password" name="pwd" placeholder="パスワード" onChange={event => {
                setPassword(event.target.value);
              }} /></p>
        
              <p><input className={styles.btn} type="submit" value="ログイン" onClick={() => {
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
                    }
                    else {
                      alert(json.isLogin)
                    }
                  });
              }} /></p>
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