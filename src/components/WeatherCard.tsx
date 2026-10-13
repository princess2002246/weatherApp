
import { MapPin, Sunrise, Sunset } from "lucide-react";
import {
  describeWeather,
  weatherEmoji,
  type WeatherData,
} from "../services/weatherApi";

type WeatherCardProps = {
  city: string;
  weather: WeatherData;
  unit: "C" | "F";
  onToggleUnit: () => void;
};

function convertTemperature(value: number, unit: "C" | "F") {
  return unit === "C" ? Math.round(value) : Math.round((value * 9) / 5 + 32);
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function WeatherCard({
  city,
  weather,
  unit,
  onToggleUnit,
}: WeatherCardProps) {
  const current = weather.current;
  const today = weather.daily;

  return (
    <section className="current-weather">
      <div className="weather-card-top">
        <div>
          <span className="eyebrow">CURRENT WEATHER</span>
          <h2><MapPin size={17} /> {city}</h2>
          <p className="weather-date">
            {new Date(current.time).toLocaleString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <button className="unit-toggle" onClick={onToggleUnit}>
          °{unit} <span>/</span> °{unit === "C" ? "F" : "C"}
        </button>
      </div>

      <div className="weather-main">
        <div>
          <p className="temperature">
            {convertTemperature(current.temperature_2m, unit)}°
          </p>
          <h3>{describeWeather(current.weather_code)}</h3>
          <p className="feels-like">
            Feels like {convertTemperature(current.apparent_temperature, unit)}°
          </p>
        </div>
        <div className="main-weather-icon" role="img" aria-label={describeWeather(current.weather_code)}>
          <span style={{ fontSize: "86px" }}>
            {weatherEmoji(current.weather_code, current.is_day === 1)}
          </span>
        </div>
      </div>

      <div className="sun-times">
        <div>
          <Sunrise size={20} />
          <span>Sunrise</span>
          <strong>{today.sunrise[0] ? formatTime(today.sunrise[0]) : "--:--"}</strong>
        </div>
        <div>
          <Sunset size={20} />
          <span>Sunset</span>
          <strong>{today.sunset[0] ? formatTime(today.sunset[0]) : "--:--"}</strong>
        </div>
      </div>
    </section>
  );
}
