import { createSlice } from "@reduxjs/toolkit";

// ─────────────────────────────────────────────
// PERSISTENCE HELPERS
// ─────────────────────────────────────────────
const STORAGE_KEY = "weather-dashboard-favourites";

function loadFavourites() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    return serialized ? JSON.parse(serialized) : [];
  } catch {
    return [];
  }
}

function saveFavourites(favourites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
  } catch (e) {
    console.error("Could not save favourites to localStorage:", e);
  }
}

// ─────────────────────────────────────────────
// SLICE
// ─────────────────────────────────────────────
const favouritesSlice = createSlice({
  name: "favourites",

  initialState: {
    // e.g. ["Delhi", "London", "New York"]
    cities: loadFavourites(),
  },

  reducers: {
    addFavourite: (state, action) => {
      const cityName = action.payload;
      const alreadyExists = state.cities.some(
        (c) => c.toLowerCase() === cityName.toLowerCase()
      );
      if (alreadyExists) return;

      state.cities.push(cityName);
      saveFavourites(state.cities);
    },

    removeFavourite: (state, action) => {
      const cityName = action.payload;
      state.cities = state.cities.filter(
        (c) => c.toLowerCase() !== cityName.toLowerCase()
      );
      saveFavourites(state.cities);
    },

    // Star icon dispatches this — handles both add & remove
    toggleFavourite: (state, action) => {
      const cityName = action.payload;
      const index = state.cities.findIndex(
        (c) => c.toLowerCase() === cityName.toLowerCase()
      );

      if (index === -1) {
        state.cities.push(cityName);
      } else {
        state.cities.splice(index, 1);
      }
      saveFavourites(state.cities);
    },
  },
});

// ─────────────────────────────────────────────
// SELECTORS
// ─────────────────────────────────────────────
export const selectFavourites = (state) => state.favourites.cities;

export const selectIsFavourite = (cityName) => (state) =>
  state.favourites.cities.some(
    (c) => c.toLowerCase() === cityName.toLowerCase()
  );

export const { addFavourite, removeFavourite, toggleFavourite } =
  favouritesSlice.actions;
export default favouritesSlice.reducer;