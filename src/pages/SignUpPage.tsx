import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";
import { useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

const SignUpPage = () => {

  const [nicknameMessage, setNicknameMessage] = useState("");
  const [nicknameAvailable, setNicknameAvailalbe] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    loginId: "",
    password: "",
    passwordCheck: "",
    nickname: "",
    gender: "",
    birthYear: "",
    region: ""
  });

  const Change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const isMatch = form.password === form.passwordCheck;
  
  const years = [];

  for(let year = new Date().getFullYear(); year >= 1900; year--) {
    years.push(year);
  }

  const regions = ["서울", "부산", "대구", "인천", "광주", "대전", "울산",
    "세종","경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
  ]

  const navigate = useNavigate();

  // 회원가입 버튼 누를 시
  const Signup = async(e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(Object.values(form).some(value => !value.trim())) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if(form.password != form.passwordCheck) {
      alert("비밀번호가 같지 않습니다. 다시 입력해주세요.");
      return;
    }

    if(!nicknameAvailable) {
      alert("중복된 닉네임입니다.");
      return;
    }

    try{
      const response = await api.post("/users", form)

      const data = response.data;

      navigate("/");

      toast.success(data.message);
    } catch(error) {
      toast.error("회원가입에 실패하였습니다.");
    }
  }

  // 전화번호 체크
  const phoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, "");

    value = value.slice(0, 11);

    setForm(prev => ({
      ...prev,
      loginId: value
    }))
  };

  // 닉네임 확인
  const checkNickname = async() => {
    const response = await api.get(`/users/nickname-exists`, {
      params: {
        nickname: form.nickname
      }
    });

    const data = response.data.data;
    
    if(data) {
      setNicknameMessage("이미 사용중인 닉네임입니다.");
      setNicknameAvailalbe(false);
    } else {
      setNicknameMessage("사용 가능한 닉네임입니다.");
      setNicknameAvailalbe(true);
    }
  }

  return (
    <div className="signUp">
      <div className="signUp-container">
        <h3 className="signUp-logo">코디로그</h3>
        <form onSubmit={Signup} className="signUp-form">
          <input type="tel" inputMode="numeric" maxLength={13} name="loginId" placeholder="전화번호(01012345678)" value={form.loginId} onChange={phoneChange} />
          <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={Change} />
          <div className="password-check">
            <input type="password" name="passwordCheck" placeholder="비밀번호 확인" value={form.passwordCheck} onChange={Change} />
            {
              form.passwordCheck && !isMatch && (
                <div className="password-error">비밀번호가 일치하지 않습니다.</div>
              )
            }
          </div>
          <div className="nickname-box">
            <input type="text" name="nickname" placeholder="닉네임(10자 이내)" maxLength={10} value={form.nickname} onChange={Change}/>
            <button type="button" onClick={checkNickname}>중복확인</button>
          </div>
          {
              nicknameMessage && (
                <div className={nicknameAvailable ? "nickName-ok" : "nickName-error"}>
                  {nicknameMessage}
                </div>
          )}
          <div className="gender-box">
            <label><input type="radio" name="gender" value="MALE" checked={form.gender === "MALE"} onChange={Change}></input>남</label>
            <label><input type="radio" name="gender" value="FEMALE" checked={form.gender === "FEMALE"} onChange={Change}></input>여</label>
          </div>
          <select name="birthYear" value={form.birthYear} onChange={Change}>
            <option value="">출생년도</option>
            {
              years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            }
          </select>
          <select name="region" value={form.region} onChange={Change}>
            <option value="">지역</option>
            {
              regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))
            }
          </select>
          <button type="submit">가입하기</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
