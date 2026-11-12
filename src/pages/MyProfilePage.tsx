import { useNavigate } from "react-router-dom";
import "./MyProfilePage.css";
import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import axios from "axios";

const MyProfilePage = () => {

  const [nicknameMessage, setNicknameMessage] = useState("");
  const [nicknameAvailable, setNicknameAvailalbe] = useState<boolean | null>(null);
  const years = [];
  const regions = ["서울", "부산", "대구", "인천", "광주", "대전", "울산",
    "세종","경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
  ]
  const [originalNickname, setOriginalNickname] = useState("");

  // 기존 데이터
  useEffect(() => {

    const getCurrentUser = async () => {

      try{
        const reponse = await api.get("/users/me");

        const data = reponse.data.data;

        setForm({
          nickname: data.nickname,
          gender: data.gender,
          birthYear: String(data.birthYear),
          region: data.region
        })

        setOriginalNickname(data.nickname);

      } catch(error: unknown) {
        if(axios.isAxiosError(error)) {
          toast.error(error.response?.data.message);
        } else {
          toast.error("알 수 없는 오류가 발생하였습니다.");
        }
      }
    }

    getCurrentUser();
  }, [])

  const navigate = useNavigate();

  const [form, setForm] = useState({
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

    if(name === "nickname") {
      setNicknameAvailalbe(null);
      setNicknameMessage("");
    }

  }

  for(let year = new Date().getFullYear(); year >= 1900; year--) {
    years.push(year);
  }

  // 수정하기 버튼 누를 시
  const Edit = async(e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(Object.values(form).some(value => !value.trim())) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if(originalNickname !== form.nickname) {
      if(nicknameAvailable === null) {
        alert("닉네임 중복을 확인해주세요.");
        return;
      }

      if(!nicknameAvailable) {
        alert("이미 사용중인 닉네임 입니다.");
        return;
      }
    }

    try{

      const response = await api.patch("/users/me", form);

      const data = response.data;

      toast.success(data.message);

      navigate("/mypage", { replace: true });
    } catch(error: unknown) {
      if(axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("알 수 없는 오류가 발생하였습니다.");
      }
    }
    
  }

  // 닉네임 확인
  const checkNickname = async() => {
    const response = await api.get(`users/me/nickname-exists`, {
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
    <div className="Edit">
      <div className="Edit-container">
        <h3 className="Edit-logo">프로필</h3>
        <form onSubmit={Edit} className="Edit-form">
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
          <div className="myprofile-buttons">
            <button type="button" className="myprofile-prev-button" onClick={() => navigate(-1)}>뒤로가기</button>
            <button type="submit" className="edit-button">수정하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfilePage;
