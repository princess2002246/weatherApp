
import { useEffect, useState } from "react";
import {
  fetchWeather,
  type Coordinates,
  type WeatherData,
} from "../services/weatherApi";

type CachedWeather = {
  weather: WeatherData;
  savedAt: number;
  latitude: number;
  longitude: number;
};

type WeatherState = {
  weather: WeatherData | null;
  loading: boolean;
  error: string;
  isOffline: boolean;
  isCached: boolean;
  lastUpdated: number | null;
};

const CACHE_PREFIX = "weatherly-cache-";

function getCacheKey(coordinates: Coordinates) {
  const latitude = coordinates.latitude.toFixed(3);
  const longitude = coordinates.longitude.toFixed(3);

  return `${CACHE_PREFIX}${latitude}-${longitude}`;
}

function readCachedWeather(
  coordinates: Coordinates,
): CachedWeather | null {
  try {
    const stored = localStorage.getItem(getCacheKey(coordinates));

    if (!stored) return null;

    const cached = JSON.parse(stored) as CachedWeather;

    if (
      !cached.weather ||
      typeof cached.savedAt !== "number" ||
      typeof cached.latitude !== "number" ||
      typeof cached.longitude !== "number"
    ) {
      return null;
    }

    return cached;
  } catch {
    return null;
  }
}

function saveCachedWeather(
  coordinates: Coordinates,
  weather: WeatherData,
) {
  const cached: CachedWeather = {
    weather,
    savedAt: Date.now(),
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  };

  try {
    localStorage.setItem(
      getCacheKey(coordinates),
      JSON.stringify(cached),
    );
  } catch {
    // Weather still works if browser storage is unavailable or full.
  }
}

export default function useWeather(coordinates: Coordinates): WeatherState {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isCached, setIsCached] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let isActive = true;

    async function loadWeather() {
      setLoading(true);
      setError("");

      const cached = readCachedWeather(coordinates);

      if (cached) {
        setWeather(cached.weather);
        setIsCached(true);
        setLastUpdated(cached.savedAt);
      } else {
        setWeather(null);
        setIsCached(false);
        setLastUpdated(null);
      }

      if (!navigator.onLine) {
        setIsOffline(true);
        setLoading(false);

        if (!cached) {
          setError(
            "You're offline and there's no saved weather for this location yet. Connect to the internet and try again.",
          );
        }

        return;
      }

      setIsOffline(false);

      try {
        const freshWeather = await fetchWeather(
          coordinates,
          controller.signal,
        );

        if (!isActive) return;

        setWeather(freshWeather);
        setIsCached(false);
        setLastUpdated(Date.now());
        saveCachedWeather(coordinates, freshWeather);
      } catch (err) {
        if (
          err instanceof Error &&
          err.name === "AbortError"
        ) {
          return;
        }

        if (!isActive) return;

        // Keep the cached forecast visible if the network request fails.
        if (!cached) {
          setWeather(null);
          setError(
            "Unable to load weather. Check your internet connection and try again.",
          );
        } else {
          setWeather(cached.weather);
          setIsCached(true);
          setLastUpdated(cached.savedAt);
          setError("");
        }

        setIsOffline(true);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadWeather();

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [coordinates.latitude, coordinates.longitude]);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
    }

    function handleOffline() {
      setIsOffline(true);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    weather,
    loading,
    error,
    isOffline,
    isCached,
    lastUpdated,
  };
}
