import "./Mypage.css";
import { useState } from "react";
import TopBar from "../components/TopBar/TopBar";
import { Link } from "react-router-dom";
import Modal from "../components/Modal/Modal";
import api from "../api/api";
import { IoClose } from "react-icons/io5";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";


const MyPage = () => {

  // 비밀번호 변경 모달
  const [showInfo, setShowInfo] = useState<boolean>(false);
  // 회원탈퇴 모달
  const [showWithdraw, setShowWithdraw] = useState<boolean>(false);

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const isMatch = password === passwordCheck;

  const navigate = useNavigate();

  // 모달 창 닫기
  const closeModal = () => {
    setShowInfo(false);
    setPassword("");
    setPasswordCheck("");
  }

  // 비밀번호 변경
  const passwordChange = async () => {
    try{
      await api.patch("users/me/password", password, {
        headers: {
          "Content-Type": "text/plain"
        }
      });
      toast.success("비밀번호가 변경되었습니다.");
      closeModal();
    } catch(error) {
      toast.error("비밀번호 변경에 실패했습니다.");
    }
  }

  // 회원탈퇴 버튼
  const withdraw = async () => {
    try {
      const data = await api.delete("users/me");

      navigate("/");

      toast.success(data.data.message);

    } catch (error) {
        toast.error("회원탈퇴에 실패하였습니다.");
    }
  }

  return (
    <>
    <TopBar logoutButton={true} />
    <div>
      <div className="info">
        <ul className="info-ul">
          <li><Link to="myprofile">프로필 수정</Link></li>
          <li><Link to="mycoordi">내 게시글</Link></li>
          <li><Link to="mylikecoordi">좋아요 게시글</Link></li>
          <li><button className="password-edit-button" onClick={() => setShowInfo(true)}>비밀번호 변경</button></li>
        </ul>
      </div>
      <div className="withdraw-area">
        <button className="withdraw-button" onClick={() => setShowWithdraw(true)}>회원탈퇴</button>
      </div>
    </div>

    {/* 비밀번호 변경 모달 */}
    <Modal open={showInfo} onClose={() => {}}>
        <div className="password-modal">
          <button className="close-button" onClick={closeModal}><IoClose /></button>
          <div className="password-modal-header">
            <h2>비밀번호 변경</h2>
            <p>새로운 비밀번호를 입력해 주세요.</p>
          </div>
          <div className="password-modal-form">
            <div className="password-input">
              <input type="password" name="password" placeholder="새 비밀번호" value={password} onChange={(e) => {setPassword(e.target.value)}}/>
            </div>
            <div className="password-input">
              <input type="password" name="passwordCheck" placeholder="비밀번호 확인" value={passwordCheck} onChange={(e) => {setPasswordCheck(e.target.value)}} />
            </div>
            {
              passwordCheck && !isMatch && (
                <div className="password-error">비밀번호가 일치하지 않습니다.</div>
              )
            }
            <button className="password-modal-submit" onClick={passwordChange}>비밀번호 변경</button>
          </div>
        </div>
      </Modal>

      {/* 회원탈퇴 모달 */}
      <Modal open={showWithdraw} onClose={() => {setShowWithdraw(false)}}>
            <div className="withdraw-modal">
              <h2>정말 탈퇴하시겠습니까?</h2>
              <p>탈퇴하면 계정 정보를 복구할 수 없습니다.</p>

              <div className="withdraw-modal-buttons">
                <button onClick={() => {setShowWithdraw(false)}}>취소</button>
                <button onClick={withdraw}>탈퇴</button>
              </div>
            </div>
      </Modal>
  </>
  )
};

export default MyPage;
