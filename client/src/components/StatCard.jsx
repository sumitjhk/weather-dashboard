const StatCard = ({ icon, label, value, trend, trendType }) => {
  return (
    <div className="card cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 flex items-center justify-center text-3xl bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        
        <div className="flex-1">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-slate-100 mb-1">
            {value}
          </p>
          {trend && (
            <p className={`text-sm font-semibold flex items-center gap-1 ${
              trendType === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{trendType === 'up' ? '↗' : '↘'}</span>
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;