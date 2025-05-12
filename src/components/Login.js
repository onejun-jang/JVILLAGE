import styles from './Login.module.css';
import { useState } from 'react';

function Login(props) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    
    return <>
      <div className={styles.container}>
        <div className={styles.background}>
          <h2>로그인</h2>
      
          <div className={styles.form}>
            <p><input className={styles.login} type="text" name="username" placeholder="아이디" onChange={event => {
              setId(event.target.value);
            }} /></p>
            <p><input className={styles.login} type="password" name="pwd" placeholder="비밀번호" onChange={event => {
              setPassword(event.target.value);
            }} /></p>
      
            <p><input className={styles.btn} type="submit" value="로그인" onClick={() => {
              const userData = {
                userId: id,
                userPassword: password,
              };
              fetch("/login", { //auth 주소에서 받을 예정
                method: "post", // method :통신방법
                headers: {      // headers: API 응답에 대한 정보를 담음
                  "content-type": "application/json",
                },
                body: JSON.stringify(userData), //userData라는 객체를 보냄
              })
                .then((res) => res.json())
                .then((json) => {            
                  if(json.isLogin==="True"){
                    props.setMode("WELCOME");
                  }
                  else {
                    alert(json.isLogin)
                  }
                });
            }} /></p>
          </div>
      
          <p>계정이 없으신가요?  <button onClick={() => {
            props.setMode("SIGNIN");
          }}>회원가입</button></p>
        </div>
       </div>
    </> 
  }

  export default Login;