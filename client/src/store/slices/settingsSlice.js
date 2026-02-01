import { createSlice } from "@reduxjs/toolkit";

// ─────────────────────────────────────────────
// PERSISTENCE HELPERS
// ─────────────────────────────────────────────
const STORAGE_KEY_UNIT = "weather-dashboard-unit";
const STORAGE_KEY_WIND = "weather-dashboard-wind";
const STORAGE_KEY_THEME = "weather-dashboard-theme";

function loadUnit() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_UNIT);
    return saved === "imperial" ? "imperial" : "metric";
  } catch {
    return "metric";
  }
}

function saveUnit(unit) {
  try {
    localStorage.setItem(STORAGE_KEY_UNIT, unit);
  } catch (e) {
    console.error("Could not save unit preference:", e);
  }
}

function loadWindSpeedUnit() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_WIND);
    return ["kph", "ms", "mph"].includes(saved) ? saved : "kph";
  } catch {
    return "kph";
  }
}

function saveWindSpeedUnit(windUnit) {
  try {
    localStorage.setItem(STORAGE_KEY_WIND, windUnit);
  } catch (e) {
    console.error("Could not save wind speed preference:", e);
  }
}

function loadTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    return ["dark", "light", "auto"].includes(saved) ? saved : "dark";
  } catch {
    return "dark";
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY_THEME, theme);
  } catch (e) {
    console.error("Could not save theme preference:", e);
  }
}

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────
const settingsSlice = createSlice({
  name: "settings",

  initialState: {
    // "metric" → °C  |  "imperial" → °F
    unit: loadUnit(),
    // "kph" | "ms" | "mph"
    windSpeedUnit: loadWindSpeedUnit(),
    // "dark" | "light" | "auto"
    theme: loadTheme(),
  },

  reducers: {
    // Flips between metric and imperial
    toggleUnit: (state) => {
      state.unit = state.unit === "metric" ? "imperial" : "metric";
      saveUnit(state.unit);
    },

    // Set explicitly (e.g. from a dropdown)
    setUnit: (state, action) => {
      const newUnit = action.payload;
      if (newUnit === "metric" || newUnit === "imperial") {
        state.unit = newUnit;
        saveUnit(state.unit);
      }
    },

    // Set wind speed unit
    setWindSpeedUnit: (state, action) => {
      const newWindUnit = action.payload;
      if (["kph", "ms", "mph"].includes(newWindUnit)) {
        state.windSpeedUnit = newWindUnit;
        saveWindSpeedUnit(state.windSpeedUnit);
      }
    },

    // Set theme
    setTheme: (state, action) => {
      const newTheme = action.payload;
      if (["dark", "light", "auto"].includes(newTheme)) {
        state.theme = newTheme;
        saveTheme(state.theme);
      }
    },
  },
});

// ─────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────
export const selectUnit = (state) => state.settings.unit;

export const selectUnitSymbol = (state) =>
  state.settings.unit === "metric" ? "°C" : "°F";

export const selectWindSpeedUnit = (state) => state.settings.windSpeedUnit;

export const selectTheme = (state) => state.settings.theme;

export const { toggleUnit, setUnit, setWindSpeedUnit, setTheme } = settingsSlice.actions;
export default settingsSlice.reducer;