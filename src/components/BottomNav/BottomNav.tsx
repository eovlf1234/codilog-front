import { NavLink } from "react-router-dom";
import "./BottomNav.css";

const bottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/home">🏠홈</NavLink>
      <NavLink to="/coordi">🥼코디</NavLink>
      <NavLink to="/mypage">🙂마이페이지</NavLink>
    </nav>
  );
};

export default bottomNav;
