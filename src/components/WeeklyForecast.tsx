
import type { WeatherData } from "../services/weatherApi";
import {
  describeWeather,
  weatherEmoji,
} from "../services/weatherApi";

type WeeklyForecastProps = {
  unit: "C" | "F";
  weather: WeatherData;
};

function convertTemperature(value: number, unit: "C" | "F") {
  return Math.round(unit === "C" ? value : (value * 9) / 5 + 32);
}

export default function WeeklyForecast({
  unit,
  weather,
}: WeeklyForecastProps) {
  const daily = weather.daily;

  return (
    <section className="panel weekly-panel">
      <div className="section-heading">
        <div>
          <span className="eyebrow">PLAN AHEAD</span>
          <h2>7-day forecast</h2>
        </div>
      </div>

      <div className="weekly-list">
        {daily.time.map((date, index) => {
          const code = daily.weather_code[index];

          return (
            <article className="week-row" key={date}>
              <strong>
                {index === 0
                  ? "Today"
                  : new Date(`${date}T12:00:00`).toLocaleDateString(
                      undefined,
                      { weekday: "long" },
                    )}
              </strong>

              <span
                className="forecast-emoji"
                role="img"
                aria-label={describeWeather(code)}
              >
                {weatherEmoji(code)}
              </span>

              <span className="week-condition">
                {describeWeather(code)}
              </span>

              <div className="week-temperatures">
                <strong>
                  {convertTemperature(daily.temperature_2m_max[index], unit)}°
                </strong>
                <span>
                  {convertTemperature(daily.temperature_2m_min[index], unit)}°
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
