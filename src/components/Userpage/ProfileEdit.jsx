import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileEdit.module.css';

function ProfileEdit({ setIsLogin, setUserName}) {
  const [step, setStep] = useState('verify'); // verify, edit같은게 있다고 함함
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');  
  const [PWCheckMessage, setPWCheckMessage] = useState("");
  const [isPWAvailable, setIsPWAvailable] = useState(null);   
  const [verifyError, setVerifyError] = useState('');
  const [userData, setUserData] = useState({
    lastnameKanji: '',
    firstnameKanji: '',
    lastnameKana: '',
    firstnameKana: '',
    phoneNumber: '',
  });
  const [infoMessage, setInfoMessage] = useState('');
  const navigate = useNavigate();

  //패스워드 확인용
    useEffect(() => {
    if (!password2) {
        setPWCheckMessage("");
        setIsPWAvailable(null);
    } else if (password === password2) {
        setPWCheckMessage("パスワードが一致しています。");
        setIsPWAvailable(true);
    } else {
        setPWCheckMessage("パスワードが一致していません。");
        setIsPWAvailable(false);
    }
    }, [password, password2]);

  const handleVerify = async () => {
    const res = await fetch('/api/profiles/verify-password', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setStep('edit');

      // 사용자 정보도 불러오기
      const res2 = await fetch('/api/profiles/get-profile', { credentials: 'include' });
      const data = await res2.json();
      setUserData(data);
    } else {
      setVerifyError('パスワードを確認してください。');
    }
  };



  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInfoSubmit = async () => {
    const res = await fetch('/api/profiles/update-profile-info', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

  if (res.ok) {
    const data = await res.json();  // ← 서버에서 newUsername 받아오기
    if (setUserName) {
      setUserName(data.newUsername);  // ← 상태 업데이트
    }
    setInfoMessage('個人情報変更が完了しました。');
  } else {
    const data = await res.json();  // 에러 메시지 읽기
    setInfoMessage(data.message);
  }
  };

  return (
    <div className={styles.profileEdit}>
      {step === 'verify' && (
        <>
          <h3>パスワード確認</h3>
          <input className={styles.form}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
          />
          <button onClick={handleVerify}>確認</button>
          {verifyError && <p className={styles.error}>{verifyError}</p>}
        </>
      )}

      {step === 'edit' && (
        <>
          <h3>パスワード変更</h3>
          <input className={styles.form}
            type="password"
            name="password"
            placeholder="新規パスワード"
            onChange={event => {
              setPassword(event.target.value);
            }}
          />
          <input className={styles.form}
            type="password"
            name="password2"
            placeholder="パスワード確認"
            onChange={event => {
              setPassword2(event.target.value);
            }}
          />
          <p className={isPWAvailable ? styles.success : styles.warning}>
             {PWCheckMessage}
          </p>         
           
          <button className={styles.btn} type="submit" onClick={() => {
              const userData = {
                userPassword: password,
                userPassword2: password2,
                pwavailable: isPWAvailable
              };
              fetch("/api/profiles/update-password", { 
                method: "post", 
                headers: {     
                  "content-type": "application/json",
                },
                body: JSON.stringify(userData),
              })
                .then((res) => res.json())
                .then((json) => {
                  if(json.isSuccess==="True"){
                    alert('会員登録に成功しました。再ログインしてください。')
                    fetch('/api/auth/logout', { credentials: 'include' }).then(() => {
                    setIsLogin(false);
                    navigate('/login');
                            })}
                  else{
                    alert(json.isSuccess)
                  }
                });
            }}>パスワード変更</button>
         
          <hr />

          <h3>個人情報変更</h3>
          <input className={styles.form}
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            placeholder="電話番号"
            onChange={handleUserChange}
          />          
          <input className={styles.form}
            type="text"
            name="lastnameKanji"
            value={userData.lastnameKanji}
            placeholder="氏(漢字)"
            onChange={handleUserChange}
          />
          <input className={styles.form}
            type="text"
            name="firstnameKanji"
            value={userData.firstnameKanji}
            placeholder="名(漢字)"
            onChange={handleUserChange}
          />
          <input className={styles.form}
            type="text"
            name="lastnameKana"
            value={userData.lastnameKana}
            placeholder="氏(カナ)"
            onChange={handleUserChange}
          />
          <input className={styles.form}
            type="text"
            name="firstnameKana"
            value={userData.firstnameKana}
            placeholder="名(カナ)"
            onChange={handleUserChange}
          />

          <button onClick={handleInfoSubmit}>変更</button>
          {infoMessage && <p style={{marginLeft : '7px'}} >{infoMessage}</p>}
        </>
      )}
    </div>
  );
}

export default ProfileEdit;
