import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import type React from "react";
import { useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import axios from "axios";

const LoginPage = () => {

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // 로그인 누를 시
  const login = async(e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await api.post("/users/login", {
        loginId,
        password
      },
      {
        withCredentials: true
      });

      navigate("/home");

    } catch(error: unknown) {
      if(axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("알 수 없는 오류가 발생하였습니다.");
      }
    }

  }

  // 전화번호
  const phoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");

    value = value.slice(0, 11);

    setLoginId(value);
  };


  return (
    <div className="login">
      <div className="login-container">
        <h3 className="login-logo">코디로그</h3>
        <form onSubmit={login} method="post" className="login-form">
          <div>
            <input className="login-input" type="tel" inputMode="numeric" maxLength={13} name="loginId" placeholder="전화번호(01012345678)" value={loginId} onChange={phoneChange} />
            <input className="login-input" type="password" name="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">로그인</button>
        </form>
        <div>
          <button onClick={() => navigate("/signup")}>회원가입</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;