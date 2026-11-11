import { useDragScroll } from "../../hooks/useDragScroll";
import type { ForecastDay } from "../../types/weather";
import { getWeatherIcon } from "../../utils/weather";


type Props = {
  day: ForecastDay;
};

const TimeCards = ({ day }: Props) => {
  const { scrollRef, dragEvents } = useDragScroll();

  return (
    <div className="time-cards" ref={scrollRef} {...dragEvents}>
      {Object.keys(day.hourTempMap)
        .sort()
        .map((time) => (
          <div className="time-card" key={time}>
            <div>{time}시</div>
            <div className="forecast-weather">
              {getWeatherIcon(day.hourWeatherMap[time] ?? "")}{" "}
            </div>
            <div>{day.hourTempMap[time]}°C</div>
          </div>
        ))}
    </div>
  );
};

export default TimeCards;
