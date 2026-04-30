import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import { useTheme } from './context/ThemeContext';
import WeatherBackground from './components/WeatherBackground';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherMap from './components/WeatherMap';
import FavoriteCities from './components/FavoriteCities';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const {
    weather,
    forecast,
    oneCall,
    airPollution,
    loading,
    error,
    condition,
    recentSearches,
    fetchWeather,
    fetchByCoords,
    getCurrentLocation,
    clearError,
  } = useWeather();

  const { isDark } = useTheme();

  const handleFavoriteSelect = (lat: number, lon: number, _name: string) => {
    fetchByCoords(lat, lon);
  };

  return (
    <div className={`min-h-screen relative ${isDark ? 'dark' : ''}`}>
      <WeatherBackground condition={condition} />
      <ThemeToggle />

      <div className="relative z-10 min-h-screen px-4 py-6 md:py-10">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Weather
            </h1>
            <p className="text-white/50 text-sm mt-1">Real-time weather updates</p>
          </motion.div>

          {/* Search */}
          <SearchBar
            onSearch={fetchWeather}
            onLocation={getCurrentLocation}
            loading={loading}
            recentSearches={recentSearches}
          />

          {/* Favorite Cities */}
          <FavoriteCities
            onSelect={handleFavoriteSelect}
            currentCity={weather?.name}
          />

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="glass-strong rounded-2xl p-4 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />
                <p className="text-white/80 text-sm flex-1">{error}</p>
                <button
                  onClick={clearError}
                  className="text-white/50 hover:text-white text-sm transition-colors"
                >
                  Dismiss
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading */}
          <AnimatePresence>
            {loading && !weather && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-strong rounded-3xl p-12 flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 border-3 border-white/20 border-t-white/80 rounded-full animate-spin" />
                <p className="text-white/60 text-sm">Fetching weather data...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Weather Content */}
          <AnimatePresence mode="wait">
            {weather && !loading && (
              <motion.div
                key={weather.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {/* Severe Weather Alerts */}
                {oneCall?.alerts && oneCall.alerts.length > 0 && (
                  <WeatherAlerts alerts={oneCall.alerts} />
                )}

                <CurrentWeather
                  weather={weather}
                  oneCall={oneCall}
                  airPollution={airPollution}
                />

                {forecast && <Forecast forecast={forecast} />}

                {/* Weather Map */}
                <WeatherMap lat={weather.coord.lat} lon={weather.coord.lon} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center text-white/30 text-xs pt-4 pb-8"
          >
            Data provided by OpenWeatherMap
          </motion.p>
        </div>
      </div>
    </div>
  );
}
