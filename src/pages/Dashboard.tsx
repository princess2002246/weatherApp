
import { useEffect, useState, type FormEvent } from "react";
import { Search, Bell, MapPin, LocateFixed } from "lucide-react";

import Sidebar from "../components/Sidebar";
import WeatherCard from "../components/WeatherCard";
import WeatherDetails from "../components/WeatherDetails";
import HourlyForecast from "../components/HourlyForecast";
import WeeklyForecast from "../components/WeeklyForecast";
import useWeather from "../hooks/useWeather";

import {
  searchCities,
  type Coordinates,
  type CityResult,
} from "../services/weatherApi";

const DEFAULT_LOCATION = {
  city: "Kimberley",
  latitude: -28.7282,
  longitude: 24.7499,
};

type SavedLocation = {
  name: string;
  latitude?: number;
  longitude?: number;
};

export default function Dashboard() {
  const [city, setCity] = useState(DEFAULT_LOCATION.city);

  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: DEFAULT_LOCATION.latitude,
    longitude: DEFAULT_LOCATION.longitude,
  });

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<CityResult[]>([]);

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>(() => {
    try {
      const stored = localStorage.getItem("weatherly-locations");

      if (!stored) {
        return [
          {
            name: DEFAULT_LOCATION.city,
            latitude: DEFAULT_LOCATION.latitude,
            longitude: DEFAULT_LOCATION.longitude,
          },
        ];
      }

      const parsed = JSON.parse(stored) as Array<string | SavedLocation>;

      // Support locations saved by the previous version.
      return parsed.map((item) => {
        if (typeof item === "string") {
          if (item === DEFAULT_LOCATION.city) {
            return {
              name: item,
              latitude: DEFAULT_LOCATION.latitude,
              longitude: DEFAULT_LOCATION.longitude,
            };
          }

          return { name: item };
        }

        return item;
      });
    } catch {
      return [
        {
          name: DEFAULT_LOCATION.city,
          latitude: DEFAULT_LOCATION.latitude,
          longitude: DEFAULT_LOCATION.longitude,
        },
      ];
    }
  });

  const savedCities = savedLocations.map((location) => location.name);

  const [unit, setUnit] = useState<"C" | "F">("C");
  
const [theme, setTheme] = useState<"light" | "dark">(() => {
  return localStorage.getItem("weatherly-theme") === "dark"
    ? "dark"
    : "light";
});

useEffect(() => {
  localStorage.setItem("weatherly-theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]);

  const [activePage, setActivePage] = useState("dashboard");
  const [message, setMessage] = useState("");
  const [searching, setSearching] = useState(false);
  const [locating, setLocating] = useState(false);

const {
  weather,
  loading,
  error,
  isOffline,
  isCached,
  lastUpdated,
} = useWeather(coordinates);
  useEffect(() => {
    localStorage.setItem(
      "weatherly-locations",
      JSON.stringify(savedLocations),
    );
  }, [savedLocations]);

  function showMessage(text: string) {
    setMessage(text);
  }

  async function searchCity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!search.trim()) {
      showMessage("Please enter a city name.");
      return;
    }

    setSearching(true);
    setResults([]);
    setMessage("");

    try {
      const cities = await searchCities(search.trim());

      setResults(cities);

      if (cities.length === 0) {
        showMessage("No matching cities found. Try another spelling.");
      }
    } catch (err) {
      showMessage(
        err instanceof Error
          ? err.message
          : "City search failed.",
      );
    } finally {
      setSearching(false);
    }
  }

  function selectCity(result: CityResult) {
    const locationName = result.admin1
      ? `${result.name}, ${result.admin1}`
      : result.name;

    setCity(locationName);

    setCoordinates({
      latitude: result.latitude,
      longitude: result.longitude,
    });

    setSearch("");
    setResults([]);
    setActivePage("dashboard");
    setMessage(`Loading weather for ${locationName}...`);
  }

  function addCity() {
    setActivePage("dashboard");
    setSearch("");
    showMessage("Enter a city name in the search bar and select Go.");
  }

  function saveCurrentCity() {
    const currentLocation: SavedLocation = {
      name: city,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };

    const alreadySaved = savedLocations.some(
      (location) => location.name === city,
    );

    if (alreadySaved) {
      // Refresh the saved coordinates if this location already exists.
      setSavedLocations((previous) =>
        previous.map((location) =>
          location.name === city ? currentLocation : location,
        ),
      );

      showMessage(`${city} is already saved.`);
      return;
    }

    setSavedLocations((previous) => [
      ...previous,
      currentLocation,
    ]);

    showMessage(`${city} saved to your locations.`);
  }

  function selectSavedCity(savedCity: string) {
    const location = savedLocations.find(
      (item) => item.name === savedCity,
    );

    if (
      location &&
      typeof location.latitude === "number" &&
      typeof location.longitude === "number"
    ) {
      setCity(location.name);

      setCoordinates({
        latitude: location.latitude,
        longitude: location.longitude,
      });

      setActivePage("dashboard");
      setMessage(`Loading weather for ${location.name}...`);
      return;
    }

    // Older saved city names without coordinates can still be searched.
    setSearch(savedCity);
    setResults([]);
    setActivePage("dashboard");
    showMessage(
      `Search for ${savedCity} and select the matching result.`,
    );
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) {
      showMessage(
        "Your browser does not support location services.",
      );
      return;
    }

    setLocating(true);
    setMessage("Requesting location permission...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setCity("My current location");
        setActivePage("dashboard");
        setLocating(false);
        showMessage("Current-location weather loaded.");
      },
      (locationError) => {
        setLocating(false);

        const errorMessage =
          locationError.code === locationError.PERMISSION_DENIED
            ? "Location permission was denied. You can still search for a city."
            : "Could not detect your location. Please search for a city.";

        showMessage(errorMessage);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  function removeSavedCity(savedCity: string) {
    setSavedLocations((previous) =>
      previous.filter((location) => location.name !== savedCity),
    );

    showMessage(`${savedCity} removed from your saved locations.`);
  }

  return (
    <div className="app-shell">
      <Sidebar
        city={city}
        savedCities={savedCities}
        onSelectCity={selectSavedCity}
        onAddCity={addCity}
        onNavigate={setActivePage}
        activePage={activePage}
      />

      <main className="main-content">
        <header className="topbar">
          <div className="page-intro">
            <span className="eyebrow">WEATHER AT A GLANCE</span>

            <h1>
              {activePage === "dashboard"
                ? "Good day!"
                : activePage === "locations"
                  ? "My locations"
                  : "Settings"}
            </h1>

            <p>Here's what's happening with the weather.</p>
          </div>

          <div className="topbar-actions">
            <form className="search-form" onSubmit={searchCity}>
              <Search size={18} />

              <input
                aria-label="Search for a city"
                placeholder="Search a city..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setResults([]);
                }}
              />

              <button type="submit" disabled={searching}>
                {searching ? "..." : "Go"}
              </button>
            </form>

            <button
              className="notification-button"
              aria-label="Use my current location"
              title="Use my current location"
              onClick={useCurrentLocation}
              disabled={locating}
            >
              <LocateFixed size={19} />
            </button>

            <button
              className="notification-button"
              aria-label="Weather notification information"
              onClick={() =>
                showMessage(
                  "Live weather is connected. Severe-weather alerts will be added separately.",
                )
              }
            >
              <Bell size={19} />
            </button>
          </div>
        </header>

        {message && (
          <div className="toast" role="status">
            {message}

            <button
              className="text-button"
              onClick={() => setMessage("")}
              aria-label="Dismiss message"
            >
              Dismiss
            </button>
          </div>
        )}

        {results.length > 0 && (
          <section
            className="panel search-results"
            aria-label="City search results"
          >
            <h2>Choose a location</h2>

            {results.map((result) => (
              <button
                className="location-row search-result"
                key={`${result.id}-${result.latitude}-${result.longitude}`}
                onClick={() => selectCity(result)}
              >
                <MapPin size={18} />

                <strong>{result.name}</strong>

                <span>
                  {[result.admin1, result.country]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </button>
            ))}
          </section>
        )}

        {activePage === "dashboard" && (
          <>
            <div className="location-caption">
  <span>
    <MapPin size={15} /> Weather in {city}
  </span>

  <span>
    {isCached ? "Saved weather data" : "Live API data"}
  </span>
</div>

{isCached && (
  <div className="cache-notice" role="status">
    <strong>
      {isOffline
        ? "You're offline"
        : "Showing saved weather"}
    </strong>

    <p>
      {isOffline
        ? "This is the last forecast saved for this location. It may be out of date."
        : "A saved forecast is displayed while we refresh the latest weather."}
    </p>

    {lastUpdated && (
      <small>
        Last updated:{" "}
        {new Date(lastUpdated).toLocaleString()}
      </small>
    )}
  </div>
)}

            {loading && (
              <div className="panel status-panel" role="status">
                Loading current weather and forecast...
              </div>
            )}

            {error && !loading && (
              <div className="panel error-panel" role="alert">
                <h2>Unable to load weather</h2>
                <p>{error}</p>
                <p>Check your internet connection and try again.</p>
              </div>
            )}

            {weather && !loading && !error && (
              <div className="dashboard-grid">
                <div className="dashboard-primary">
                  <WeatherCard
                    city={city}
                    weather={weather}
                    unit={unit}
                    onToggleUnit={() =>
                      setUnit((previous) =>
                        previous === "C" ? "F" : "C",
                      )
                    }
                  />

                  <HourlyForecast
                    unit={unit}
                    weather={weather}
                  />

                  <WeeklyForecast
                    unit={unit}
                    weather={weather}
                  />
                </div>

                <aside className="dashboard-secondary">
                  <div className="section-heading detail-heading">
                    <div>
                      <span className="eyebrow">AT A GLANCE</span>
                      <h2>Weather details</h2>
                    </div>
                  </div>

                  <WeatherDetails
                    unit={unit}
                    weather={weather}
                  />

                  <div className="tip-card">
                    <span className="tip-emoji">☀</span>

                    <h3>Save this location</h3>

                    <p>
                      Keep your favourite places close so you can
                      check their weather again.
                    </p>

                    <button
                      className="primary-button"
                      onClick={saveCurrentCity}
                    >
                      Save location
                    </button>
                  </div>
                </aside>
              </div>
            )}
          </>
        )}

        {activePage === "locations" && (
          <section className="panel page-panel">
            <div className="section-heading">
              <div>
                <span className="eyebrow">YOUR PLACES</span>
                <h2>Saved locations</h2>
              </div>

              <button
                className="primary-button"
                onClick={addCity}
              >
                + Add city
              </button>
            </div>

            <div className="location-list">
              {savedLocations.map((location) => (
                <div className="location-row" key={location.name}>
                  <MapPin size={20} />

                  <strong>{location.name}</strong>

                  <button
                    className="text-button"
                    onClick={() => selectSavedCity(location.name)}
                  >
                    View weather
                  </button>

                  <button
                    className="text-button remove-button"
                    onClick={() => removeSavedCity(location.name)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {savedLocations.length === 0 && (
                <p>
                  No saved locations yet. Search for a city and
                  save it.
                </p>
              )}
            </div>
          </section>
        )}

        {activePage === "settings" && (
          <section className="panel page-panel">
            <span className="eyebrow">
              PERSONALISE YOUR EXPERIENCE
            </span>

            <h2>Settings</h2>

            <div className="setting-row">
              <div>
                <strong>Temperature units</strong>
                <p>Choose how temperatures are displayed.</p>
              </div>

              
<div className="setting-row">
  <div>
    <strong>Appearance</strong>
    <p>Switch between light and dark mode.</p>
  </div>

  <button
    className="unit-toggle"
    onClick={() =>
      setTheme((previous) =>
        previous === "light" ? "dark" : "light",
      )
    }
    aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
  >
    {theme === "light" ? "Dark mode" : "Light mode"}
  </button>
</div>


              <button
                className="unit-toggle"
                onClick={() =>
                  setUnit((previous) =>
                    previous === "C" ? "F" : "C",
                  )
                }
              >
                °{unit} / °{unit === "C" ? "F" : "C"}
              </button>
            </div>

            <p className="settings-note">
              Theme preferences and weather notifications will
              be added in later steps.
            </p>
          </section>
        )}

        <footer className="app-footer">
          <span>Weatherly © 2026</span>

          <span>
            Weather data by{" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
            >
              Open-Meteo
            </a>
          </span>
        </footer>
      </main>
    </div>
  );
}
