# 🌤️ Weather Analytics Dashboard

A modern, feature-rich weather dashboard built with React and Redux Toolkit. Track weather conditions, analyze trends, and manage your favorite cities all in one place.

![Weather Dashboard](https://img.shields.io/badge/React-19.2.0-61dafb?logo=react)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764abc?logo=redux)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff?logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38bdf8?logo=tailwindcss)

## 🚀 Live Demo

🔗 **[View Live Demo](#)** *[https://agent-697f10ef404c65937820--shiny-maamoul-40e35b.netlify.app/]*

## ✨ Features

### 🌍 Weather Tracking
- **Real-time Weather Data**: Get current weather conditions for any city worldwide
- **5-Day Forecast**: Plan ahead with detailed daily forecasts
- **Multiple Cities**: Search and track weather for multiple locations simultaneously
- **Auto-refresh**: Update all cities' weather data with one click

### ⭐ Favorites Management
- **Save Favorite Cities**: Mark cities as favorites for quick access
- **Persistent Storage**: Your favorites are saved locally and persist across sessions
- **Automatic Loading**: Favorited cities load automatically when you open the app

### 📊 Analytics & Insights
- **24-Hour Temperature Trends**: Visualize temperature changes throughout the day
- **Humidity Analysis**: Track humidity levels with interactive charts
- **Wind Speed Monitoring**: Monitor wind patterns with detailed graphs
- **Combined Overview**: See temperature and humidity trends together
- **Detailed Data Tables**: Access comprehensive hourly weather data
- **City Selector**: Switch between different cities' analytics

### ⚙️ Customization
- **Temperature Units**: Toggle between Celsius (°C) and Fahrenheit (°F)
- **Wind Speed Units**: Choose from km/h, m/s, or mph
- **Theme Support**: Switch between Dark Mode, Light Mode, or Auto (system preference)
- **Persistent Preferences**: All settings are saved to localStorage

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Gradient Backgrounds**: Beautiful gradient-themed cards and backgrounds
- **Interactive Charts**: Powered by Recharts for smooth, interactive visualizations
- **Loading States**: Skeleton loaders for better user experience
- **Smooth Animations**: CSS transitions and hover effects throughout

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI library
- **Redux Toolkit 2.11.2** - State management
- **React Redux 9.2.0** - React bindings for Redux
- **Vite 7.2.4** - Build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework

### Data Visualization
- **Recharts 3.7.0** - Chart library for React

### API
- **WeatherAPI.com** - Weather data provider

## 📁 Project Structure
```
weather-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Main dashboard with city cards
│   │   ├── Forecast.jsx        # 5-day forecast view
│   │   ├── Analytics.jsx       # Charts and analytics
│   │   ├── Settings.jsx        # User preferences
│   │   └── ThemeProvider.jsx   # Theme management
│   ├── store/
│   │   ├── store.js            # Redux store configuration
│   │   └── slices/
│   │       ├── weatherSlice.js     # Weather data & API calls
│   │       ├── favouritesSlice.js  # Favorites management
│   │       └── settingsSlice.js    # User settings
│   ├── services/
│   │   └── weatherService.js   # API integration layer
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **WeatherAPI.com API Key** (free tier available)

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/sumitjhk/weather-dashboard.git
   cd weather-dashboard
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
```env
   VITE_WEATHER_API_KEY=your_api_key_here
```

   **Get your API key:**
   - Go to [WeatherAPI.com](https://www.weatherapi.com/)
   - Sign up for a free account
   - Copy your API key from the dashboard
   - Paste it in the `.env` file

4. **Start the development server**
```bash
   npm run dev
```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🌐 Deployment

This project is deployed on **Vercel**.

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sumitjhk/weather-dashboard)

**Manual Deployment:**

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variable: `VITE_WEATHER_API_KEY`
6. Click "Deploy"

## 📊 Redux State Management

### Store Structure
```javascript
{
  weather: {
    cities: [],      // Array of city weather data
    status: 'idle',  // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  favourites: {
    list: []         // Array of favorite city names
  },
  settings: {
    unit: 'metric',           // 'metric' | 'imperial'
    windSpeedUnit: 'kph',     // 'kph' | 'ms' | 'mph'
    theme: 'dark'             // 'dark' | 'light' | 'auto'
  }
}
```

### Key Redux Features

- **Async Thunks**: Handle API calls with loading/error states
- **Immer Integration**: Simplified immutable state updates
- **LocalStorage Persistence**: Settings and favorites persist across sessions
- **Selectors**: Optimized data retrieval from store

## 🎨 Features in Detail

### Weather Data
Each city card displays:
- Current temperature with feels-like temperature
- Weather condition with icon
- Humidity percentage
- Wind speed
- Visibility range
- Atmospheric pressure
- Cloud coverage
- UV index
- 5-day mini forecast

### Analytics Charts
- **Temperature Trends**: Area chart showing 24-hour temperature variation
- **Humidity Levels**: Area chart tracking humidity changes
- **Wind Speed**: Line chart displaying wind patterns
- **Combined Overview**: Dual-axis chart comparing temperature and humidity
- **Data Table**: Detailed hourly breakdown

### Settings Options
- Temperature unit toggle (°C/°F)
- Wind speed unit selector (km/h, m/s, mph)
- Theme switcher (Dark/Light/Auto)
- Weather alerts toggle *(UI ready, functionality pending)*
- Daily forecast notifications *(UI ready, functionality pending)*

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_WEATHER_API_KEY` | Your WeatherAPI.com API key | Yes |

## 🐛 Known Issues

- Notification toggles are UI-only (functionality not implemented yet)
- Theme switching requires page refresh in some cases
- Wind speed unit conversion not fully implemented in all views

## 🚧 Roadmap

- [ ] Implement weather alerts notifications
- [ ] Add hourly forecast view
- [ ] Weather maps integration
- [ ] Historical weather data
- [ ] Export data to CSV/PDF
- [ ] Multi-language support
- [ ] Geolocation for automatic city detection
- [ ] Weather widgets for embedding

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sumit Jhk**
- GitHub: [@sumitjhk](https://github.com/sumitjhk)
- Repository: [weather-dashboard](https://github.com/sumitjhk/weather-dashboard)

## 🙏 Acknowledgments

- Weather data provided by [WeatherAPI.com](https://www.weatherapi.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Icons and design inspiration from various open-source projects

## 📞 Support

If you have any questions or run into issues:
- Open an issue on [GitHub](https://github.com/sumitjhk/weather-dashboard/issues)
- Check the [WeatherAPI documentation](https://www.weatherapi.com/docs/)

---

⭐ If you found this project helpful, please give it a star on GitHub!

Made with ❤️ and React
