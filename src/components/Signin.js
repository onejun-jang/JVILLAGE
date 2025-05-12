import styles from './Signin.module.css';
import { useState, useEffect } from 'react';

function Signin(props) {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [lastnamekanji, setLastnameKanji] = useState("");
    const [firstnamekanji, setFirstnameKanji] = useState("");
    const [lastnamekana, setLastnameKana] = useState("");
    const [firstnamekana, setFirstnameKana] = useState("");
    const [idCheckMessage, setIdCheckMessage] = useState("");
    const [isIdAvailable, setIsIdAvailable] = useState(null);  
    const [PWCheckMessage, setPWCheckMessage] = useState("");
    const [isPWAvailable, setPWAvailable] = useState(null);  
    const IDcheck = () => {
      const userData = {
        userId: id
      };

      fetch("/signin/check", { 
        method: "post", 
        headers: {     
          "content-type": "application/json",
        },
        body: JSON.stringify(userData), //userData라는 객체를 보냄
      })
        .then((res) => res.json())
        .then((json) => {
          if(json.isIDcheck==="True"){
            setIdCheckMessage("使用可能なIDです。");
            setIsIdAvailable(true);
          } else {
            setIdCheckMessage(json.isIDcheck);
            setIsIdAvailable(false);
          }
        });        

    };



    useEffect(() => {
      setIdCheckMessage("");
      setIsIdAvailable(null);
    }, [id]);

    useEffect(() => {
      if (!password2) {
        setPWCheckMessage("");
        setPWAvailable(null);
      } else if (password === password2) {
        setPWCheckMessage("パスワードが一致します。");
        setPWAvailable(true);
      } else {
        setPWCheckMessage("パスワードが一致しません。");
        setPWAvailable(false);
      }
    }, [password, password2]);





    return <>
      <div className={styles.container}>
        <div className={styles.background}>
          <h2>会員登録</h2>
      
          <div className={styles.form}>
            <p><input className={styles.loginID} type="text" placeholder="ID" onChange={event => {
              setId(event.target.value);
            }} />
            <button className={styles.IDchk} type="button" onClick={IDcheck} disabled={!id}>IDチェック</button></p>
            <p className={isIdAvailable ? styles.success : styles.warning}>
              {idCheckMessage}
            </p>
            <p><input className={styles.loginPW} type="password" placeholder="パスワード" onChange={event => {
              setPassword(event.target.value);
            }} /></p>
            <p><input className={styles.loginPW} type="password" placeholder="パスワード確認" onChange={event => {
              setPassword2(event.target.value);
            }} /></p>
            <p className={isPWAvailable ? styles.success : styles.warning}>
              {PWCheckMessage}
            </p>            


            <div className={styles.nameWrapper}>
              <p><input className={styles.name} type="text" placeholder="氏" onChange={event => {
                setLastnameKanji(event.target.value);
              }} /></p>
                <p><input className={styles.name} type="text" placeholder="名" onChange={event => {
                setFirstnameKanji(event.target.value);
              }} /></p>
            </div>
            <div className={styles.nameWrapper}>
              <p><input className={styles.name} type="text" placeholder="シ" onChange={event => {
                setLastnameKana(event.target.value);
              }} /></p>
                <p><input className={styles.name} type="text" placeholder="メイ" onChange={event => {
                setFirstnameKana(event.target.value);
              }} /></p>
            </div>            

            
      
            <p><input className={styles.btn} type="submit" value="会員登録" onClick={() => {
              const userData = {
                userId: id,
                userPassword: password,
                userPassword2: password2,
                lastnameKanji: lastnamekanji,
                firstnameKanji: firstnamekanji,
                lastnameKana: lastnamekana,
                firstnameKana: firstnamekana,
                idavailable: isIdAvailable,
                pwavailable: isPWAvailable
              };
              fetch("/signin", { //signin 주소에서 받을 예정
                method: "post", // method :통신방법
                headers: {      // headers: API 응답에 대한 정보를 담음
                  "content-type": "application/json",
                },
                body: JSON.stringify(userData), //userData라는 객체를 보냄
              })
                .then((res) => res.json())
                .then((json) => {
                  if(json.isSuccess==="True"){
                    alert('会員登録に成功しました。')
                    props.setMode("LOGIN");
                  }
                  else{
                    alert(json.isSuccess)
                  }
                });
            }} /></p>
          </div>
      
          <p><button onClick={() => {
            props.setMode("LOGIN");
          }}>ログイン</button>に戻る</p>
        </div>
      </div>
    </> 
  }

  export default Signin;