import "./Layout.css";
import { Outlet, useLocation } from "react-router-dom";
import BottomNav from "../components/BottomNav/BottomNav";
import { useWeatherStore } from "../store/weatherStore";

const Layout = () => {
  const weather = useWeatherStore((state) => state.weather);
  const location = useLocation();

  const isHome = location.pathname === "/home";

  const hideNav = location.pathname === "/" || location.pathname === "/signup";

  const getWeatherClass = (weather?: string | null) => {

    switch (weather) {
      case "맑음":
        return "sunny";
      case "구름많음":
        return "cloud";
      case "흐림":
        return "overcast";
      case "비":
        return "rain";
      case "눈":
        return "snow";
      case "비/눈":
        return "rainSnow";
      case "소나기":
        return "shower";
      default:
        return "sunny";
    }
  };

  return (
    <div className={`app ${isHome ? getWeatherClass(weather) : ""}`}>
      <main className="content">
        <Outlet />
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
};

export default Layout;
