import styles from './Signin.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Signin() {
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
    const [phonenumber, setPhonenumber] = useState("");
    const navigate = useNavigate();

    const IDcheck = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(id)) {
        setIdCheckMessage("メール形式で入力してください。");
        setIsIdAvailable(false);
        return; // 꼭 필요함, 안하면 밑에 fetch까지 진행되버림림
      }
      const userData = {
        userId: id
      };

      fetch("/api/auth/signin/check", { 
        method: "post", 
        headers: {     
          "content-type": "application/json",
        },
        body: JSON.stringify(userData), 
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
      <div className={styles.layout}>
        <div className={styles.content}>
          <h1>会員登録</h1>
      
          <div className={styles.form}>
            <p><input className={styles.loginID} type="text" placeholder="メールアドレス" onChange={event => {
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
            <p><input className={styles.phone} type="text" placeholder="電話番号" onChange={event => {
              setPhonenumber(event.target.value);
            }} /></p>                    


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
                pwavailable: isPWAvailable,
                phoneNumber: phonenumber
              };
              fetch("/api/auth/signin", { 
                method: "post", 
                headers: {     
                  "content-type": "application/json",
                },
                body: JSON.stringify(userData), 
              })
                .then((res) => res.json())
                .then((json) => {
                  if(json.isSuccess==="True"){
                    alert('メールを送信しました。メールのリンクをクリックして登録を完了してください。')
                    navigate('/login');
                  }
                  else{
                    alert(json.isSuccess)
                    
                  }
                });
            }} /></p>
          </div>
      
          <p><button style={{cursor : 'pointer'}} onClick={() => {
            navigate('/login');
          }}>ログイン</button>に戻る</p>
        </div>
      </div>
    </> 
  }

  export default Signin;