import { useState } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Forecast from './components/Forecast';
import Settings from './components/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { selectedCity, currentWeather } = useSelector((state) => state.weather);

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 transition-all duration-300">
        {/* Top Header */}
        <header className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700 shadow-lg">
          <div className="px-8 py-6 flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
                {activeTab === 'dashboard' && '☀️ Dashboard'}
                {activeTab === 'analytics' && '📊 Analytics'}
                {activeTab === 'forecast' && '🌤️ Forecast'}
                {activeTab === 'settings' && '⚙️ Settings'}
              </h1>
              <p className="text-slate-400 text-sm">📍 {selectedCity}</p>
            </div>
            
            <div className="flex items-center gap-6">
              {currentWeather && (
                <div className="flex items-center gap-4 bg-slate-700/50 px-6 py-3 rounded-xl border border-slate-600">
                  <span className="text-3xl font-bold text-primary-400">
                    {Math.round(currentWeather.temp)}°C
                  </span>
                  <span className="text-slate-300">{currentWeather.condition}</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-[1600px] mx-auto animate-fade-in">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'forecast' && <Forecast />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </main>
    </div>
  );
}

export default App;