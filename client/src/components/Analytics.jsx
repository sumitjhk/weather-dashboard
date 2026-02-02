import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  AreaChart, Area,
  LineChart, Line,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { selectAllCities } from '../store/slices/weatherSlice';
import { selectUnitSymbol } from '../store/slices/settingsSlice';
import { selectFavourites } from '../store/slices/favouritesSlice';

// ─────────────────────────────────────────────
// DATA DERIVATION
// Generates 12 two-hour time slots (6am → 4am) with temperature
// interpolated along a sine curve between today's min and max.
// ─────────────────────────────────────────────
function buildAnalyticsData(cityData) {
  const { current, daily } = cityData;
  const today = daily[0];
  const minTemp = today.tempMin;
  const maxTemp = today.tempMax;
  const baseHumidity = current.humidity;
  const baseWind = current.windSpeed;

  const slots = [];
  for (let i = 0; i < 12; i++) {
    const hour = (6 + i * 2) % 24;
    const radians = ((hour - 14) / 24) * 2 * Math.PI;
    const sinValue = Math.sin(radians);
    const normalised = (sinValue + 1) / 2;
    const temp = minTemp + normalised * (maxTemp - minTemp);
    const humidityOffset = -((normalised - 0.5) * 20) + (((i * 7) % 11) - 5);
    const humidity = Math.min(100, Math.max(10, Math.round(baseHumidity + humidityOffset)));
    const windOffset = (((i * 13) % 9) - 4) * 0.8;
    const windSpeed = Math.max(0, Math.round((baseWind + windOffset) * 10) / 10);
    const ampm = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
    slots.push({ time: ampm, temp: Math.round(temp * 10) / 10, humidity, windSpeed });
  }
  return slots;
}

function buildStats(analyticsData, today) {
  const temps = analyticsData.map((d) => d.temp);
  const humidities = analyticsData.map((d) => d.humidity);
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  return {
    avgTemp: Math.round(avg(temps) * 10) / 10,
    maxTemp: Math.round(today.tempMax * 10) / 10,
    minTemp: Math.round(today.tempMin * 10) / 10,
    avgHumidity: Math.round(avg(humidities)),
  };
}

// ─────────────────────────────────────────────
// CUSTOM TOOLTIP — dark-themed to match dashboard
// ─────────────────────────────────────────────
const DarkTooltip = ({ active, payload, label, unitSymbol }) => {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-xl shadow-xl px-4 py-3 min-w-[150px]">
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className="text-slate-400 text-sm">{entry.name}</span>
          </div>
          <span className="text-white font-semibold text-sm">
            {entry.value}
            {entry.name === 'Temp' ? unitSymbol : entry.name === 'Humidity' ? '%' : ' km/h'}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// GRADIENT DEFS — injected inside each chart's <defs>
// ─────────────────────────────────────────────
const GradientDefs = () => (
  <defs>
    <linearGradient id="gradTemp" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.4} />
      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="gradHumidity" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%"  stopColor="#34d399" stopOpacity={0.4} />
      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="gradWind" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.35} />
      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="gradCombinedTemp" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.35} />
      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
    </linearGradient>
    <linearGradient id="gradCombinedHum" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%"  stopColor="#8b5cf6" stopOpacity={0.3} />
      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
    </linearGradient>
  </defs>
);

// Shared axis + grid styling
const axisStyle = { tick: { fill: '#64748b', fontSize: 11 }, axisLine: { stroke: '#334155' }, tickLine: false };
const gridStyle = { stroke: '#1e293b', strokeDasharray: '4 4' };

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const Analytics = () => {
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

  const { analyticsData, stats, cityName, cityCountry } = useMemo(() => {
    if (cities.length === 0) return { analyticsData: [], stats: null, cityName: null, cityCountry: null };
    
    // Find selected city or fallback to first city
    const city = cities.find(c => 
      c.city.toLowerCase() === selectedCity.toLowerCase()
    ) || cities[0];
    
    const data = buildAnalyticsData(city);
    const derived = buildStats(data, city.daily[0]);
    return { analyticsData: data, stats: derived, cityName: city.city, cityCountry: city.country };
  }, [cities, selectedCity]);

  // ── Empty state ──
  if (analyticsData.length === 0 || !stats) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Weather Analytics & Trends</h2>
          <p className="text-slate-400">24-hour data analysis and insights</p>
        </div>
        <p className="text-slate-500 text-center mt-16">
          Search for a city on the Dashboard to see analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">

      {/* ── Header ── */}
      <div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Weather Analytics & Trends</h2>
        <p className="text-slate-400">24-hour data analysis for {cityName}, {cityCountry}</p>
      </div>

      {/* ── City Selector ── */}
      {favourites.length > 1 && (
        <div className="card">
          <label className="block text-slate-400 text-sm font-semibold mb-3">
            📍 Select City for Analytics:
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

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-4 pb-4 mb-4 border-b border-slate-700">
            <span className="text-4xl">🌡️</span>
            <h3 className="text-xl font-semibold text-slate-100">Temperature</h3>
          </div>
          <div className="flex justify-between gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Average</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
                {stats.avgTemp}{unitSymbol}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">High</p>
              <p className="text-xl font-semibold text-slate-100">{stats.maxTemp}{unitSymbol}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Low</p>
              <p className="text-xl font-semibold text-slate-100">{stats.minTemp}{unitSymbol}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4 pb-4 mb-4 border-b border-slate-700">
            <span className="text-4xl">💧</span>
            <h3 className="text-xl font-semibold text-slate-100">Humidity</h3>
          </div>
          <div className="flex justify-between gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Average</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
                {stats.avgHumidity}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Status</p>
              <p className="text-xl font-semibold text-slate-100">
                {stats.avgHumidity < 40 ? 'Dry' : stats.avgHumidity < 70 ? 'Normal' : 'Humid'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4 pb-4 mb-4 border-b border-slate-700">
            <span className="text-4xl">💨</span>
            <h3 className="text-xl font-semibold text-slate-100">Wind Speed</h3>
          </div>
          <div className="flex justify-between gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Current</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
                {analyticsData.find((d) => d.time === '12 PM')?.windSpeed ?? analyticsData[0].windSpeed} km/h
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Max today</p>
              <p className="text-xl font-semibold text-slate-100">
                {Math.max(...analyticsData.map((d) => d.windSpeed))} km/h
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* CHART 1 — Temperature (AreaChart)           */}
      {/* ═══════════════════════════════════════════ */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-slate-100">🌡️ Temperature Trends</h3>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50"></span>
            <span className="text-sm text-slate-400">Temperature</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <GradientDefs />
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="time" {...axisStyle} />
            <YAxis {...axisStyle} domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(v) => `${v}°`} />
            <Tooltip content={<DarkTooltip unitSymbol={unitSymbol} />} />
            <Area
              type="monotone" dataKey="temp" name="Temp"
              stroke="#60a5fa" strokeWidth={2.5} fill="url(#gradTemp)"
              dot={false}
              activeDot={{ r: 5, fill: '#60a5fa', stroke: '#1e293b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* CHART 2 — Humidity (AreaChart)              */}
      {/* ═══════════════════════════════════════════ */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-slate-100">💧 Humidity Levels</h3>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-emerald-400 rounded-full shadow-sm shadow-emerald-400/50"></span>
            <span className="text-sm text-slate-400">Humidity</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <GradientDefs />
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="time" {...axisStyle} />
            <YAxis {...axisStyle} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<DarkTooltip unitSymbol={unitSymbol} />} />
            <Area
              type="monotone" dataKey="humidity" name="Humidity"
              stroke="#34d399" strokeWidth={2.5} fill="url(#gradHumidity)"
              dot={false}
              activeDot={{ r: 5, fill: '#34d399', stroke: '#1e293b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* CHART 3 — Wind Speed (LineChart)            */}
      {/* ═══════════════════════════════════════════ */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-slate-100">💨 Wind Speed Trends</h3>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400/50"></span>
            <span className="text-sm text-slate-400">Wind Speed</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={analyticsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <GradientDefs />
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="time" {...axisStyle} />
            <YAxis {...axisStyle} tickFormatter={(v) => `${v}`} unit=" km/h" />
            <Tooltip content={<DarkTooltip unitSymbol={unitSymbol} />} />
            <Line
              type="monotone" dataKey="windSpeed" name="Wind"
              stroke="#22d3ee" strokeWidth={2.5}
              dot={{ r: 3.5, fill: '#22d3ee', stroke: '#1e293b', strokeWidth: 1.5 }}
              activeDot={{ r: 5.5, fill: '#22d3ee', stroke: '#1e293b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* CHART 4 — Combined Overview (dual Y-axis)   */}
      {/* ═══════════════════════════════════════════ */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold text-slate-100">📊 Combined Overview</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-400 rounded-full shadow-sm shadow-amber-400/50"></span>
              <span className="text-sm text-slate-400">Temp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-violet-400 rounded-full shadow-sm shadow-violet-400/50"></span>
              <span className="text-sm text-slate-400">Humidity</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analyticsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <GradientDefs />
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="time" {...axisStyle} />
            <YAxis yAxisId="temp" {...axisStyle} domain={['dataMin - 2', 'dataMax + 2']} tickFormatter={(v) => `${v}°`} />
            <YAxis yAxisId="hum" orientation="right" {...axisStyle} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip content={<DarkTooltip unitSymbol={unitSymbol} />} />
            <Area
              yAxisId="temp" type="monotone" dataKey="temp" name="Temp"
              stroke="#f59e0b" strokeWidth={2.5} fill="url(#gradCombinedTemp)"
              dot={false}
              activeDot={{ r: 5, fill: '#f59e0b', stroke: '#1e293b', strokeWidth: 2 }}
            />
            <Area
              yAxisId="hum" type="monotone" dataKey="humidity" name="Humidity"
              stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gradCombinedHum)"
              dot={false}
              activeDot={{ r: 5, fill: '#8b5cf6', stroke: '#1e293b', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* DATA TABLE                                  */}
      {/* ═══════════════════════════════════════════ */}
      <div className="card">
        <h3 className="text-2xl font-semibold text-slate-100 mb-6">📋 Detailed Data Table</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-700">
                <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Temperature</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Humidity</th>
                <th className="text-left py-4 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Wind Speed</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.map((data, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/20 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-100">{data.time}</td>
                  <td className="py-4 px-4 font-semibold text-blue-400">{data.temp}{unitSymbol}</td>
                  <td className="py-4 px-4 font-semibold text-green-400">{data.humidity}%</td>
                  <td className="py-4 px-4 text-slate-300">{data.windSpeed} km/h</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Analytics;