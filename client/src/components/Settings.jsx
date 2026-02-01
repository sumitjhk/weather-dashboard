import { useDispatch, useSelector } from 'react-redux';
import { 
  setUnit, 
  selectUnit,
  setWindSpeedUnit,
  selectWindSpeedUnit,
  setTheme,
  selectTheme
} from '../store/slices/settingsSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const currentUnit = useSelector(selectUnit);
  const windSpeedUnit = useSelector(selectWindSpeedUnit);
  const theme = useSelector(selectTheme);

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          Settings & Preferences
        </h2>
        <p className="text-slate-400">Customize your weather dashboard experience</p>
      </div>

      {/* Temperature Unit */}
      <div className="card">
        <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
          🌡️ Temperature Unit
        </h3>
        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={() => dispatch(setUnit('metric'))}
            className={currentUnit === 'metric' ? 'btn-primary' : 'btn-secondary'}
          >
            Celsius (°C)
          </button>
          <button 
            onClick={() => dispatch(setUnit('imperial'))}
            className={currentUnit === 'imperial' ? 'btn-primary' : 'btn-secondary'}
          >
            Fahrenheit (°F)
          </button>
        </div>
      </div>

      {/* Wind Speed Unit */}
      <div className="card">
        <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
          💨 Wind Speed Unit
        </h3>
        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={() => dispatch(setWindSpeedUnit('kph'))}
            className={windSpeedUnit === 'kph' ? 'btn-primary' : 'btn-secondary'}
          >
            km/h
          </button>
          <button 
            onClick={() => dispatch(setWindSpeedUnit('ms'))}
            className={windSpeedUnit === 'ms' ? 'btn-primary' : 'btn-secondary'}
          >
            m/s
          </button>
          <button 
            onClick={() => dispatch(setWindSpeedUnit('mph'))}
            className={windSpeedUnit === 'mph' ? 'btn-primary' : 'btn-secondary'}
          >
            mph
          </button>
        </div>
      </div>

      {/* Theme */}
      <div className="card">
        <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
          🎨 Theme
        </h3>
        <div className="flex gap-4 flex-wrap">
          <button 
            onClick={() => dispatch(setTheme('dark'))}
            className={theme === 'dark' ? 'btn-primary' : 'btn-secondary'}
          >
            Dark Mode
          </button>
          <button 
            onClick={() => dispatch(setTheme('light'))}
            className={theme === 'light' ? 'btn-primary' : 'btn-secondary'}
          >
            Light Mode
          </button>
          <button 
            onClick={() => dispatch(setTheme('auto'))}
            className={theme === 'auto' ? 'btn-primary' : 'btn-secondary'}
          >
            Auto
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card">
        <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
          🔔 Notifications
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-slate-700/20 rounded-xl">
            <span className="text-slate-100 font-medium">Weather Alerts</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-purple-600"></div>
            </label>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-slate-700/20 rounded-xl">
            <span className="text-slate-100 font-medium">Daily Forecast</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="card">
        <h3 className="text-xl font-semibold text-slate-100 mb-6 flex items-center gap-2">
          ℹ️ About
        </h3>
        <div className="space-y-3 p-6 bg-slate-700/20 rounded-xl">
          <p className="text-slate-100">
            <strong className="text-primary-400">Weather Analytics Dashboard</strong>
          </p>
          <p className="text-slate-300">Version 1.0.0</p>
          <p className="text-slate-400">Built with React, Redux Toolkit, Vite, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;