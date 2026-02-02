import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAllCities } from '../store/slices/weatherSlice';
import { selectUnitSymbol } from '../store/slices/settingsSlice';
import { selectFavourites } from '../store/slices/favouritesSlice';

// ── Day-name helper ──
function getDayLabel(epoch, index) {
  if (index === 0) return 'Today';
  const date = new Date(epoch * 1000);
  return date.toLocaleDateString('en', { weekday: 'long' });
}

// ── Date helper ──
function getDateLabel(epoch) {
  const date = new Date(epoch * 1000);
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric', weekday: 'short' });
}

const Forecast = () => {
  const cities = useSelector(selectAllCities);
  const favourites = useSelector(selectFavourites);
  const [selectedCity, setSelectedCity] = useState('');
  const unitSymbol = useSelector(selectUnitSymbol);

  // Set initial selected city
  useEffect(() => {
    if (favourites.length > 0 && !selectedCity) {
      setSelectedCity(favourites[0]);
    }
  }, [favourites, selectedCity]);

  // ── Empty state ──
  if (cities.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">
            Weather Forecast
          </h2>
          <p className="text-slate-400">Plan your week ahead</p>
        </div>
        <p className="text-slate-500 text-center mt-16">
          Search for a city on the Dashboard to see its forecast here.
        </p>
      </div>
    );
  }

  // Find selected city or fallback to first city
  const activeCityData = cities.find(c => 
    c.city.toLowerCase() === selectedCity.toLowerCase()
  ) || cities[0];

  const forecast = activeCityData.daily || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          Weather Forecast
        </h2>
        <p className="text-slate-400">
          {activeCityData.city}, {activeCityData.country} &middot; Next {forecast.length} days
        </p>
      </div>

      {/* ── City Selector ── */}
      {favourites.length > 1 && (
        <div className="card">
          <label className="block text-slate-400 text-sm font-semibold mb-3">
            📍 Select City for Forecast:
          </label>
          <select 
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full md:w-auto px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white font-medium focus:outline-none focus:border-primary-500 transition-all"
          >
            {favourites.map(favCity => {
              const cityData = cities.find(c => c.city.toLowerCase() === favCity.toLowerCase());
              return (
                <option key={favCity} value={favCity}>
                  {favCity} {cityData ? `(${cityData.country})` : ''}
                </option>
              );
            })}
          </select>
          <p className="text-slate-500 text-sm mt-3">
            You can see list of cities which are marked as favorites
          </p>
        </div>
      )}

      {cities.length > 1 && (
        <p className="text-slate-600 text-sm">
          Showing forecast for <span className="text-slate-400 font-semibold">{activeCityData.city}</span>.
          Search additional cities on the Dashboard to compare.
        </p>
      )}

      <div className="space-y-4">
        {forecast.map((day, index) => {
          const iconSrc = day.icon.startsWith('//')
            ? `https:${day.icon}`
            : day.icon;

          return (
            <div
              key={day.dt}
              className="card hover:translate-x-2 transition-all duration-300 hover:bg-gradient-to-r hover:from-slate-800 hover:to-primary-900/20"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">

                {/* ── Day Info ── */}
                <div className="flex-shrink-0 pb-4 md:pb-0 md:pr-6 md:border-r border-slate-700">
                  <h3 className="text-2xl font-bold text-slate-100 mb-1">
                    {getDayLabel(day.dt, index)}
                  </h3>
                  <p className="text-slate-400">{getDateLabel(day.dt)}</p>
                </div>

                {/* ── Weather Icon ── */}
                <div className="flex-shrink-0">
                  <img
                    src={iconSrc}
                    alt={day.description}
                    className="w-20 h-20 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                  />
                </div>

                {/* ── Temperature Range ── */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-bold bg-gradient-to-br from-yellow-400 to-orange-500 bg-clip-text text-transparent min-w-[80px]">
                      {Math.round(day.tempMax)}{unitSymbol}
                    </span>
                    <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: '70%' }}
                      ></div>
                    </div>
                    <span className="text-4xl font-semibold text-slate-400 min-w-[80px] text-right">
                      {Math.round(day.tempMin)}{unitSymbol}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 text-center">High / Low</p>
                </div>

                {/* ── Condition Badge ── */}
                <div className="flex-shrink-0">
                  <span className="inline-block px-6 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white font-semibold rounded-full shadow-lg shadow-primary-500/30">
                    {day.description}
                  </span>
                </div>

                {/* ── Rain Chance ── */}
                <div className="flex gap-6 flex-shrink-0">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="text-2xl">🌧️</span>
                    <span className="font-semibold">{day.pop}%</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forecast;