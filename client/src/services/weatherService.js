// ─────────────────────────────────────────────
// weatherService.js  —  Centralised API layer
// All network calls live here. Components never
// fetch directly; they call these functions via
// Redux async thunks.
// ─────────────────────────────────────────────

// 1. API key read from Vite environment variable
//    Create a .env file in your project root with:
//    VITE_WEATHER_API_KEY=your_key_here
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// 2. Base URL — WeatherAPI.com
const BASE_URL = "https://api.weatherapi.com/v1";

// ─────────────────────────────────────────────
// HELPER: shared error handler
// ─────────────────────────────────────────────
function handleResponse(response) {
  if (!response.ok) {
    return response.json().then((err) => {
      // WeatherAPI errors look like: { error: { code: 1003, message: "..." } }
      throw new Error(
        err?.error?.message || `HTTP error ${response.status}`
      );
    });
  }
  return response.json();
}

// ─────────────────────────────────────────────
// COMBINED — the single function weatherSlice calls
//
//   WeatherAPI accepts city names directly in the
//   `q` parameter — no separate geocoding step needed.
//
//   We hit /forecast.json with days=5 which returns
//   BOTH current weather AND the daily forecast in
//   one request.
//
//   Usage: const data = await fetchWeatherByCity("Delhi", "metric");
// ─────────────────────────────────────────────
export async function fetchWeatherByCity(cityName, unit = "metric") {
  // WeatherAPI uses "metric" or "imperial" via the `units` param,
  // but temp fields are always present as both _c and _f.
  // We just pick the right one after the fact.
  const url =
    `${BASE_URL}/forecast.json` +
    `?key=${API_KEY}` +
    `&q=${encodeURIComponent(cityName)}` +
    `&days=5` +
    `&aqi=no` +
    `&alerts=no`;

  const response = await fetch(url);
  const data = await handleResponse(response);

  // ── Pick temperature fields based on unit preference ──
  const useCelsius = unit === "metric";

  // ── Map location fields ──
  const location = data.location;

  // ── Map current weather ──
  // WeatherAPI shape: data.current.condition.text / .icon
  const current = data.current;

  // ── Map 5-day forecast ──
  // WeatherAPI shape: data.forecast.forecastday[] → each has .day and .astro
  const daily = data.forecast.forecastday.map((day) => ({
    dt: day.date_epoch,
    tempMax: useCelsius ? day.day.maxtemp_c : day.day.maxtemp_f,
    tempMin: useCelsius ? day.day.mintemp_c : day.day.mintemp_f,
    description: day.day.condition.text,
    icon: day.day.condition.icon,          // full URL, e.g. "//cdn.weatherapi.com/weather/64x64/day/116.png"
    pop: day.day.daily_chance_of_rain,     // chance of rain as percentage (0-100)
  }));

  // ── Return shape that weatherSlice + Dashboard already expect ──
  return {
    city: location.name,
    country: location.country,
    lat: location.lat,
    lon: location.lon,
    current: {
      temp: useCelsius ? current.temp_c : current.temp_f,
      feelsLike: useCelsius ? current.feelslike_c : current.feelslike_f,
      humidity: current.humidity,                        // percentage
      windSpeed: current.wind_kph,                       // km/h (consistent unit regardless of metric/imperial)
      description: current.condition.text,               // e.g. "Partly cloudy"
      icon: current.condition.icon,                      // full URL from WeatherAPI CDN
      clouds: current.cloud,                             // percentage
      uvi: current.uv,                                   // UV index
      visibility: current.vis_km * 1000,                 // Dashboard divides by 1000 to show km — keep it in meters for compatibility
      pressure: current.pressure_mb,                     // hPa (millibars)
    },
    daily,
    lastUpdatedAt: Date.now(),
  };
}