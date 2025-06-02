import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdPage from './components/Adpage/IndexAdPage';
import Login from './components/Userpage/Login';
import Signin from './components/Userpage/Signin';
import { Navigate } from 'react-router-dom';
import Mypage from './components/Userpage/Mypage'; // 실제 파일 경로에 맞게 수정



function App() {
  const [isLogin, setIsLogin] = useState(null);


  useEffect(() => {
    fetch('/authcheck', {
    credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {        
        setIsLogin(json.isLogin === "True");
      });
  }, []); 

    if (isLogin === null) {
    // 인증 확인 중이니 로딩 UI 표시 혹은 null 반환
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdPage />} />
        <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
        <Route path="/signin" element={<Signin />} />
        <Route 
          path="/mypage"
          element={isLogin ? <Mypage setIsLogin={setIsLogin} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}


//   let content = null;  

//   if(mode==='AdPage'){
//     content = <AdPage setMode={setMode}></AdPage> 
//   } else if (mode === 'LOGIN') {
//     content = <Login setMode={setMode}></Login> 
//   } else if (mode === 'SIGNIN') {
//     content = <Signin setMode={setMode}></Signin> 
//   } else if (mode === 'WELCOME') {
//     content = 
//     <>
//       <div className={styles.container}>
//         <div className={styles.background}>
//           <h2>메인 페이지에 오신 것을 환영합니다</h2>
//           <p>로그인에 성공하셨습니다.</p> 
//           <button onClick={() => {
//             fetch("/logout")
//               .then(() => {
//                 setMode("LOGIN"); 
//           }}>로그아웃</button>
//         </div>
//       </div>
//     </>
//   }

//   return (
//     <>
//       {content}
//    </>
//   );
// }




export default App;