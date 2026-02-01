import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { fetchWeatherByCity } from "../../services/weatherService";

// ─────────────────────────────────────────────
// STALENESS THRESHOLD — 60 seconds in ms
// ─────────────────────────────────────────────
export const STALENESS_THRESHOLD = 60 * 1000;

// ─────────────────────────────────────────────
// ASYNC THUNK — fetches weather for one city
//   Payload: { city, unit }
// ─────────────────────────────────────────────
export const fetchCityWeather = createAsyncThunk(
  "weather/fetchCityWeather",
  async ({ city, unit }, { rejectWithValue }) => {
    try {
      const data = await fetchWeatherByCity(city, unit);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────
const weatherSlice = createSlice({
  name: "weather",

  initialState: {
    // { "Delhi": { city, current, daily, lastUpdatedAt, ... } }
    cities: {},
    // { "Delhi": { status, error } }
    cityStatus: {},
  },

  reducers: {
    removeCityWeather: (state, action) => {
      const cityName = action.payload;
      delete state.cities[cityName];
      delete state.cityStatus[cityName];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCityWeather.pending, (state, action) => {
        const city = action.meta.arg.city;
        state.cityStatus[city] = { status: "loading", error: null };
      })

      .addCase(fetchCityWeather.fulfilled, (state, action) => {
        const cityData = action.payload;
        const key = cityData.city;

        state.cities[key] = cityData;
        state.cityStatus[key] = { status: "success", error: null };

        // Clean up if user typed different casing
        const originalInput = action.meta.arg.city;
        if (originalInput !== key && state.cityStatus[originalInput]) {
          delete state.cityStatus[originalInput];
        }
      })

      .addCase(fetchCityWeather.rejected, (state, action) => {
        const city = action.meta.arg.city;
        state.cityStatus[city] = {
          status: "error",
          error: action.payload || "Something went wrong",
        };
      });
  },
});

// ─────────────────────────────────────────────
// SELECTORS (memoized with createSelector)
// ─────────────────────────────────────────────

// Base selector — picks the cities object out of state
const selectCitiesRaw = (state) => state.weather.cities;

// Memoized — Object.values() only runs again if cities actually changed
// Fixes: "Selector returned a different result when called with same parameters"
export const selectAllCities = createSelector(
  selectCitiesRaw,
  (cities) => Object.values(cities)
);

// Raw cities map — stable reference, no memoization needed
export const selectCitiesMap = selectCitiesRaw;

// Per-city status — memoized so the fallback object doesn't recreate every render
export const selectCityStatus = (city) =>
  createSelector(
    (state) => state.weather.cityStatus[city],
    (status) => status || { status: "idle", error: null }
  );

export const { removeCityWeather } = weatherSlice.actions;
export default weatherSlice.reducer;
