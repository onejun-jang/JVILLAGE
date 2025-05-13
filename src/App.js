
import styles from './App.module.css';
import { useState } from 'react';
import { useEffect } from 'react';
import Login from './components/Login';
import Signin from './components/Signin';
import Main from './components/Main';


function App() {
  const [mode, setMode] = useState("");

  useEffect(() => {
    fetch("/authcheck")
      .then((res) => res.json())
      .then((json) => {        
        if (json.isLogin === "True") {
          setMode("WELCOME");
        }
        else {
          // setMode("LOGIN"); 잠깐 보류류
          setMode("MAIN");
        }
      });
  }, []); 

  let content = null;  

  if(mode==='MAIN'){
    content = <Main setMode={setMode}></Main> 
  } else if (mode === 'LOGIN') {
    content = <Login setMode={setMode}></Login> 
  } else if (mode === 'SIGNIN') {
    content = <Signin setMode={setMode}></Signin> 
  } else if (mode === 'WELCOME') {
    content = 
    <>
      <div className={styles.container}>
        <div className={styles.background}>
          <h2>메인 페이지에 오신 것을 환영합니다</h2>
          <p>로그인에 성공하셨습니다.</p> 
          <button onClick={() => {
            fetch("/logout")
              .then(() => {
                setMode("LOGIN"); // 상태 업데이트
              });
          }}>로그아웃</button>
        </div>
      </div>
    </>
  }

  return (
    <>
      {content}
   </>
  );
}

export default App;