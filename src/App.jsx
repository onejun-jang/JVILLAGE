import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AdPage from './components/Adpage/IndexAdPage';
import Login from './components/Userpage/Login';
import Signin from './components/Userpage/Signin';
import { Navigate } from 'react-router-dom';
import Mypage from './components/Userpage/Mypage'; 
import SigninVerified from './components/Userpage/SigninVerified';



function App() {
  const [isLogin, setIsLogin] = useState(null);


  useEffect(() => {
    fetch('/api/auth/authcheck', {
    credentials: 'include'
    })
      .then((res) => res.json())
      .then((json) => {        
        setIsLogin(json.isLogin === "True");
      });
  }, []); 

    if (isLogin === null) {
    return <div style={{fontSize : '300px', textAlign : 'center'}}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdPage />} />
        <Route path="/login" element={<Login setIsLogin={setIsLogin} />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/SigninVerified" element={<SigninVerified />} />
        <Route 
          path="/mypage"
          element={isLogin ? <Mypage setIsLogin={setIsLogin} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}


export default App;