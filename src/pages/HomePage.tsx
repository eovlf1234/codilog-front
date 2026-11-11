import "./HomePage.css";
import Location from "../components/Location/Location";

const HomePage = () => {
  return (
    <div>
      <div className="weather">
        <Location />
      </div>
    </div>
  );
};

export default HomePage;
