
import { CloudSun } from "lucide-react";
import {
  describeWeather,
  weatherEmoji,
  type WeatherData,
} from "../services/weatherApi";

type HourlyForecastProps = {
  unit: "C" | "F";
  weather: WeatherData;
};

function toDisplayTemperature(value: number, unit: "C" | "F") {
  return Math.round(unit === "C" ? value : (value * 9) / 5 + 32);
}

export default function HourlyForecast({ unit, weather }: HourlyForecastProps) {
  const hourly = weather.hourly;
  const currentTime = new Date(weather.current.time).getTime();

  let startIndex = hourly.time.findIndex(
    (time) => new Date(time).getTime() >= currentTime,
  );

  if (startIndex < 0) startIndex = 0;

  const hours = hourly.time.slice(startIndex, startIndex + 6);

  return (
    <section className="panel forecast-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR DAY</span>
          <h2>Hourly forecast</h2>
        </div>
        <span className="forecast-label">Next 6 hours</span>
      </div>

      <div className="hourly-list">
        {hours.map((time, index) => {
          const actualIndex = startIndex + index;
          const isNow = index === 0;
          const code = hourly.weather_code[actualIndex];

          return (
            <article className="hour-item" key={time}>
              <span>
                {isNow
                  ? "Now"
                  : new Date(time).toLocaleTimeString([], {
                      hour: "numeric",
                    })}
              </span>

              {code !== undefined ? (
                <span
                  className="forecast-emoji"
                  role="img"
                  aria-label={describeWeather(code)}
                >
                  {weatherEmoji(code)}
                </span>
              ) : (
                <CloudSun size={26} />
              )}

              <strong>
                {toDisplayTemperature(hourly.temperature_2m[actualIndex], unit)}°
              </strong>
            </article>
          );
        })}
      </div>
    </section>
  );
}
