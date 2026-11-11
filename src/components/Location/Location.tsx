import "./Location.css";
import { useEffect, useState } from "react";
import type { Weather, ForecastDay, CacheWeather } from "../../types/weather";
import { useWeatherStore } from "../../store/weatherStore";
import TimeCards from "../TimeCards/TimeCards";
import { getWeatherIcon } from "../../utils/weather";
import Modal from "../Modal/Modal";
import api from "../../api/api";
import toast from "react-hot-toast";

const Location = () => {
  // 시간데이터
  const [now, setNow] = useState<Date>(new Date());
  const format = (n: number): string => String(n).padStart(2, "0");

  // 날씨데이터
  const [weather, setWeather] = useState<Weather | null>(null);

  const setGlobalWeather = useWeatherStore((state) => state.setWeather);

  const formatDate = (date: string): string => {
    const d = new Date(
      `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`,
    );
    return `${d.getFullYear()}년 ${format(d.getMonth() + 1)}월 ${format(d.getDate())}일`;
  };

  const [showInfo, setShowInfo] = useState<boolean>(false);

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 날씨 로직
  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number): Promise<void> => {
      try{
        const res = await api.post<Weather>("/weather", {lat, lon})

        const data = res.data;

        setWeather(data);

        setGlobalWeather((Object.values(Object.values(data.forecastWeather ?? {})[0]?.hourWeatherMap ?? {})[0] ?? "").replace(/\uFE0F/g, ""));

        localStorage.setItem(
          "weather",
          JSON.stringify({
            data,
            time: Date.now(),
          }),
        );
      } catch(error) {
        toast.error("날씨를 불러오는데 실패하였습니다.");
      }
    }
      
    // localStorage에 저장 weather 사용
    const savedWeather = localStorage.getItem("weather");

    if (savedWeather) {
      const parsed: CacheWeather = JSON.parse(savedWeather);

      // 10분 이내면 재사용
      if (Date.now() - parsed.time < 10 * 60 * 1000) {
        setWeather(parsed.data);
        setGlobalWeather(parsed.data.currentWeather.weather);
      }
    }

    // GPS로 최신 위치 갱신
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          // 최신 날씨 다시 요청
          fetchWeather(lat, lon);
        },
        (error) => {
          console.error("위치 가져오기 실패", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    }
  }, []);

  return (
    <>
      <div>
        <div className="current-time">
          <div>
            {now.getFullYear()}년 {format(now.getMonth() + 1)}월{" "}
            {format(now.getDate())}일
          </div>
          <div>
            {format(now.getHours())} : {format(now.getMinutes())}
          </div>
        </div>
        {!weather ? (
          <div>날씨 불러오는 중...</div>
        ) : (
          <div className="weather-container">
            <div className="current-container">
              <div className="current-information">
                <div>
                  {weather?.address?.city} {weather?.address?.district}
                </div>
                <div className="current-weather">
                  {getWeatherIcon(Object.values(Object.values(weather?.forecastWeather ?? {})[0]?.hourWeatherMap ?? {})[0])}
                </div>
                <div>
                  온도 : {weather?.currentWeather?.temp}°C <br></br>
                  최고 : {weather?.currentWeather?.maxTemp}°C <br></br>
                  최저 : {weather?.currentWeather?.minTemp}°C
                </div>
                <div>습도 : {weather?.currentWeather?.reh}%</div>
              </div>
              <div className="information">
                <div className="weather-information">
                  <button
                    className="weather-button"
                    onClick={() => setShowInfo(true)}
                  >
                    날씨 정보
                  </button>
                </div>
                <div className="coordi-information">
                  <div>오늘의 추천코디</div>
                  <div>Top : {weather?.coordi?.top}</div>
                  <div>Bottom : {weather?.coordi?.bottom}</div>
                  <div>Shoes : {weather?.coordi?.shoes}</div>
                </div>
              </div>
            </div>
            <div className="forecast-container">
              {Object.entries(
                weather?.forecastWeather as Record<string, ForecastDay>,
              ).map(([date, day]) => (
                <div className="day-card" key={date}>
                  <h3>{formatDate(date)}</h3>
                  <TimeCards day={day} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal open={showInfo} onClose={() => setShowInfo(false)}>
        <div className="weather-modal">
          <div className="weather-modal-title">
            <div>날씨 정보</div>
            <button onClick={() => setShowInfo(false)}>x</button>
          </div>
          <div>☀️ : 맑음</div>
          <div>🌥️ : 구름많음</div>
          <div>☁️ : 흐림</div>
          <div>🌧️ : 비</div>
          <div>🌨️ : 눈</div>
          <div>🌧️/🌨️ : 비/눈</div>
          <div>🌦️ : 소나기</div>
        </div>
      </Modal>
    </>
  );
}

export default Location;
