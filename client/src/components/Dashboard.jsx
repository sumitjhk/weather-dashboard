import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchCityWeather, selectAllCities, selectCityStatus } from '../store/slices/weatherSlice';
import { toggleFavourite, selectFavourites, selectIsFavourite } from '../store/slices/favouritesSlice';
import { selectUnit, selectUnitSymbol } from '../store/slices/settingsSlice';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();

  const cities = useSelector(selectAllCities);
  const favourites = useSelector(selectFavourites);
  const unit = useSelector(selectUnit);
  const unitSymbol = useSelector(selectUnitSymbol);

  // ── Auto-fetch any favourited city that isn't already loaded ──
  // Runs once on mount and again if the favourites list changes.
  useEffect(() => {
    const loadedNames = cities.map((c) => c.city.toLowerCase());

    favourites.forEach((favCity) => {
      if (!loadedNames.includes(favCity.toLowerCase())) {
        dispatch(fetchCityWeather({ city: favCity, unit }));
      }
    });
  }, [favourites, cities, unit, dispatch]);

  // ── Search handler ──
  const handleSearch = (e) => {
    e.preventDefault();
    const city = searchQuery.trim();
    if (!city) return;
    dispatch(fetchCityWeather({ city, unit }));
    setSearchQuery('');
  };

  // ── Favourite toggle ──
  const handleToggleFavourite = (cityName) => {
    dispatch(toggleFavourite(cityName));
  };

  // ── Refresh ALL loaded cities at once ──
  const handleRefreshAll = async () => {
    if (cities.length === 0) return;
    setIsRefreshing(true);
    // Fire every fetch in parallel, wait for all to settle
    await Promise.allSettled(
      cities.map((c) => dispatch(fetchCityWeather({ city: c.city, unit })))
    );
    setIsRefreshing(false);
  };

  // ── AQI color helper ──
  const getAQIColor = (aqi) => {
    if (!aqi) return 'text-slate-400';
    if (aqi <= 50) return 'text-green-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    if (aqi <= 200) return 'text-red-400';
    return 'text-purple-400';
  };

  // ── Derive favourite cards from the cities already in the store ──
  const favouriteCities = favourites
    .map((favName) =>
      cities.find((c) => c.city.toLowerCase() === favName.toLowerCase())
    )
    .filter(Boolean); // drop any that haven't loaded yet

  // Cities that are favourited but not yet loaded (still fetching)
  const pendingFavourites = favourites.filter(
    (favName) =>
      !cities.some((c) => c.city.toLowerCase() === favName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">🌤️</div>
          <h1 className="text-5xl font-bold text-white mb-2">
            Weather Dashboard
          </h1>
          <p className="text-slate-400 text-lg">
            Search for a city to see current weather
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="max-w-2xl mx-auto mb-12">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pl-14 bg-slate-800/50 border-2 border-slate-700 rounded-2xl text-white text-lg placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all"
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {/* ── Centralized Refresh Button ── */}
        {cities.length > 0 && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleRefreshAll}
              disabled={isRefreshing}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl border transition-all text-sm font-medium ${
                isRefreshing
                  ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-800/60 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-500 hover:text-white'
              }`}
              title="Refresh all cities"
            >
              <span className={isRefreshing ? 'animate-spin inline-block' : 'inline-block'}>↻</span>
              {isRefreshing ? 'Refreshing…' : `Refresh All (${cities.length})`}
            </button>
          </div>
        )}

        {/* ── Empty State ── */}
        {cities.length === 0 && favourites.length === 0 && (
          <p className="text-center text-slate-500 text-lg mt-16">
            No cities yet. Search above to add one.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((cityData) => (
            <CityCard
              key={cityData.city}
              cityData={cityData}
              unitSymbol={unitSymbol}
              isFavourite={favourites.some(
                (f) => f.toLowerCase() === cityData.city.toLowerCase()
              )}
              onToggleFavourite={() => handleToggleFavourite(cityData.city)}
              getAQIColor={getAQIColor}
            />
          ))}
        </div>

        {/* ── Favourites Section ── */}
        {(favouriteCities.length > 0 || pendingFavourites.length > 0) && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
              ⭐ Favourite Cities
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Live weather for your favourited cities
            </p>

            {/* Full cards for favourites that have data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favouriteCities.map((cityData) => (
                <CityCard
                  key={`fav-${cityData.city}`}
                  cityData={cityData}
                  unitSymbol={unitSymbol}
                  isFavourite={true}
                  onToggleFavourite={() => handleToggleFavourite(cityData.city)}
                  getAQIColor={getAQIColor}
                  isFavouriteSection={true}
                />
              ))}

              {/* Skeleton placeholders for favourites still loading */}
              {pendingFavourites.map((favName) => (
                <div
                  key={`pending-${favName}`}
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white">{favName}</h2>
                      <p className="text-slate-500 text-sm">Fetching weather…</p>
                    </div>
                    <div className="animate-spin text-2xl">⟳</div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
                    <div className="h-4 w-20 bg-slate-700 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// CityCard — reused in both search results AND favourites
// ─────────────────────────────────────────────
const CityCard = ({
  cityData,
  unitSymbol,
  isFavourite,
  onToggleFavourite,
  getAQIColor,
  isFavouriteSection = false,
}) => {

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700 relative">

      {/* ── Favourite star ── */}
      <button
        onClick={onToggleFavourite}
        className="absolute top-4 right-4 text-2xl transition-all hover:scale-110"
        title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
      >
        {isFavourite ? '⭐' : '☆'}
      </button>

      {/* ── City Name + Country ── */}
      <div className="mb-4 pr-16">
        <h2 className="text-2xl font-bold text-white">{cityData.city}</h2>
        <p className="text-slate-400 text-sm">{cityData.country}</p>
      </div>

      {/* ── Main Temp + Icon ── */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-6xl font-bold text-white">
          {Math.round(cityData.current.temp)}{unitSymbol}
        </span>
        <div>
          <img
            src={
              cityData.current.icon.startsWith('//')
                ? `https:${cityData.current.icon}`
                : cityData.current.icon
            }
            alt={cityData.current.description}
            className="w-16 h-16"
          />
          <p className="text-slate-400 capitalize text-sm">
            {cityData.current.description}
          </p>
        </div>
      </div>

      {/* ── Feels Like ── */}
      <p className="text-slate-500 text-sm mb-4">
        Feels like {Math.round(cityData.current.feelsLike)}{unitSymbol}
      </p>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 gap-3">

        <div className="bg-slate-700/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">💧</span>
            <span className="text-slate-400 text-xs">Humidity</span>
          </div>
          <p className="text-white font-semibold">{cityData.current.humidity}%</p>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">💨</span>
            <span className="text-slate-400 text-xs">Wind</span>
          </div>
          <p className="text-white font-semibold">{cityData.current.windSpeed} km/h</p>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">👁️</span>
            <span className="text-slate-400 text-xs">Visibility</span>
          </div>
          <p className="text-white font-semibold">
            {(cityData.current.visibility / 1000).toFixed(1)} km
          </p>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🌫️</span>
            <span className="text-slate-400 text-xs">Pressure</span>
          </div>
          <p className="text-white font-semibold">{cityData.current.pressure} hPa</p>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">☁️</span>
            <span className="text-slate-400 text-xs">Clouds</span>
          </div>
          <p className="text-white font-semibold">{cityData.current.clouds}%</p>
        </div>

        <div className="bg-slate-700/30 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🌞</span>
            <span className="text-slate-400 text-xs">UV Index</span>
          </div>
          <p className="text-white font-semibold">{cityData.current.uvi}</p>
        </div>
      </div>

      {/* ── 5-Day Forecast Strip ── */}
      {cityData.daily && cityData.daily.length > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-700">
          <p className="text-slate-500 text-xs uppercase tracking-wider mb-3">5-Day Forecast</p>
          <div className="grid grid-cols-5 gap-1">
            {cityData.daily.map((day, i) => {
              const date = new Date(day.dt * 1000);
              const dayLabel =
                i === 0
                  ? 'Today'
                  : date.toLocaleDateString('en', { weekday: 'short' });

              return (
                <div
                  key={day.dt}
                  className="flex flex-col items-center gap-1 bg-slate-700/20 rounded-lg p-1.5"
                >
                  <span className="text-slate-400 text-xs">{dayLabel}</span>
                  <img
                    src={
                      day.icon.startsWith('//')
                        ? `https:${day.icon}`
                        : day.icon
                    }
                    alt={day.description}
                    className="w-8 h-8"
                  />
                  <span className="text-white text-xs font-semibold">
                    {Math.round(day.tempMax)}°
                  </span>
                  <span className="text-slate-500 text-xs">
                    {Math.round(day.tempMin)}°
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;