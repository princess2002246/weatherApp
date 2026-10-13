
import { Droplets, Wind, Gauge, CloudRain } from "lucide-react";
import type { WeatherData } from "../services/weatherApi";

type WeatherDetailsProps = {
  unit: "C" | "F";
  weather: WeatherData;
};

export default function WeatherDetails({ unit, weather }: WeatherDetailsProps) {
  const current = weather.current;

  const details = [
    {
      label: "Humidity",
      value: `${current.relative_humidity_2m}%`,
      description: "Relative humidity",
      Icon: Droplets,
    },
    {
      label: "Wind speed",
      value: `${Math.round(current.wind_speed_10m)} km/h`,
      description: "At 10 metres above ground",
      Icon: Wind,
    },
    {
      label: "Precipitation",
      value: `${current.precipitation} mm`,
      description: "Current precipitation",
      Icon: CloudRain,
    },
    {
      label: "Feels like",
      value: `${Math.round(
        unit === "C"
          ? current.apparent_temperature
          : (current.apparent_temperature * 9) / 5 + 32,
      )}°${unit}`,
      description: "Apparent temperature",
      Icon: Gauge,
    },
  ];

  return (
    <section className="details-grid">
      {details.map(({ label, value, description, Icon }) => (
        <article className="detail-card" key={label}>
          <div className="detail-top">
            <span>{label}</span>
            <span className="detail-icon"><Icon size={19} /></span>
          </div>
          <strong>{value}</strong>
          <p>{description}</p>
        </article>
      ))}
    </section>
  );
}
