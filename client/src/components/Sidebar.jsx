const Sidebar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'analytics', icon: '📊', label: 'Analytics' },
    { id: 'forecast', icon: '🌤️', label: 'Forecast' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  return (
    <aside className="w-64 h-screen bg-slate-800 border-r border-slate-700 fixed left-0 top-0 flex flex-col shadow-2xl z-50">
      {/* Logo Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <span className="text-4xl drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">⛅</span>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-400 to-purple-500 bg-clip-text text-transparent">
            WeatherDash
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              w-full flex items-center gap-4 px-4 py-3 mb-2 rounded-xl
              transition-all duration-300 text-left font-medium
              ${activeTab === item.id 
                ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg shadow-primary-500/30 transform translate-x-1' 
                : 'text-slate-400 hover:bg-slate-700 hover:text-slate-200 hover:translate-x-1'
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info Footer */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-xl shadow-lg">
            👤
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-200 truncate">Guest User</p>
            <p className="text-xs text-slate-400 truncate">guest@weather.app</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;