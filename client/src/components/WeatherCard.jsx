const WeatherCard = ({ city, isActive, onSelect }) => {
  const weatherData = {
    London: { temp: 15, condition: 'Cloudy', icon: '02d' },
    Paris: { temp: 18, condition: 'Clear', icon: '01d' },
    Tokyo: { temp: 22, condition: 'Sunny', icon: '01d' },
    'New York': { temp: 12, condition: 'Rainy', icon: '10d' },
    Sydney: { temp: 25, condition: 'Sunny', icon: '01d' }
  };

  const data = weatherData[city];

  return (
    <div 
      onClick={onSelect}
      className={`
        card cursor-pointer transition-all duration-300
        ${isActive 
          ? 'bg-gradient-to-br from-primary-500/20 to-purple-600/20 border-primary-500 shadow-lg shadow-primary-500/30 scale-105' 
          : 'hover:scale-105'
        }
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-xl font-semibold text-slate-100">{city}</h4>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <img 
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.condition}
          className="w-20 h-20"
        />
        <div className="text-4xl font-bold bg-gradient-to-br from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          {data.temp}°C
        </div>
      </div>
      
      <p className="text-slate-400 capitalize text-center">{data.condition}</p>
    </div>
  );
};

export default WeatherCard;