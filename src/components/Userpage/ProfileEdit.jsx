import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileEdit.module.css';

function ProfileEdit({ setIsLogin }) {
  const [step, setStep] = useState('verify'); // verify, edit
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

    useEffect(() => {
    if (!password2) {
        setPWCheckMessage("");
        setIsPWAvailable(null);
    } else if (password === password2) {
        setPWCheckMessage("パスワードが一致します。");
        setIsPWAvailable(true);
    } else {
        setPWCheckMessage("パスワードが一致しません。");
        setIsPWAvailable(false);
    }
    }, [password, password2]);

  const handleVerify = async () => {
    const res = await fetch('/verify-password', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setStep('edit');

      // 사용자 정보도 불러오기
      const res2 = await fetch('/get-profile', { credentials: 'include' });
      const data = await res2.json();
      setUserData(data);
    } else {
      setVerifyError('비밀번호가 일치하지 않습니다.');
    }
  };



  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInfoSubmit = async () => {
    const res = await fetch('/update-profile-info', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

  if (res.ok) {
    setInfoMessage('개인정보가 성공적으로 변경되었습니다.');
  } else {
    const data = await res.json();  // 에러 메시지 읽기
    setInfoMessage(data.message);
  }
  };

  return (
    <div className={styles.profileEdit}>
      {step === 'verify' && (
        <>
          <h3>비밀번호 확인</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="현재 비밀번호 입력"
          />
          <button onClick={handleVerify}>확인</button>
          {verifyError && <p className={styles.error}>{verifyError}</p>}
        </>
      )}

      {step === 'edit' && (
        <>
          <h3>비밀번호 변경</h3>
          <input
            type="password"
            name="password"
            placeholder="새 비밀번호"
            onChange={event => {
              setPassword(event.target.value);
            }}
          />
          <input
            type="password"
            name="password2"
            placeholder="새 비밀번호 확인"
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
              fetch("/update-password", { 
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
                    fetch('/logout', { credentials: 'include' }).then(() => {
                    setIsLogin(false);
                    navigate('/login');
                            })}
                  else{
                    alert(json.isSuccess)
                  }
                });
            }}>パスワード変更</button>
         
          <hr />

          <h3>개인정보 수정</h3>
          <input
            type="text"
            name="phoneNumber"
            value={userData.phoneNumber}
            placeholder="핸드폰 번호"
            onChange={handleUserChange}
          />          
          <input
            type="text"
            name="lastnameKanji"
            value={userData.lastnameKanji}
            placeholder="성"
            onChange={handleUserChange}
          />
          <input
            type="text"
            name="firstnameKanji"
            value={userData.firstnameKanji}
            placeholder="이름"
            onChange={handleUserChange}
          />
          <input
            type="text"
            name="lastnameKana"
            value={userData.lastnameKana}
            placeholder="성(가타카나)"
            onChange={handleUserChange}
          />
          <input
            type="text"
            name="firstnameKana"
            value={userData.firstnameKana}
            placeholder="이름(가타카나)"
            onChange={handleUserChange}
          />

          <button onClick={handleInfoSubmit}>개인정보 수정</button>
          {infoMessage && <p>{infoMessage}</p>}
        </>
      )}
    </div>
  );
}

export default ProfileEdit;
