import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./slices/weatherSlice";
import favouritesReducer from "./slices/favouritesSlice";
import settingsReducer from "./slices/settingsSlice";

// ─────────────────────────────────────────────
// REDUX STORE
//   state.weather      → fetched weather data per city
//   state.favourites   → user's favourited city names
//   state.settings     → unit preference (metric / imperial)
// ─────────────────────────────────────────────
const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favourites: favouritesReducer,
    settings: settingsReducer,
  },
});

export default store;
