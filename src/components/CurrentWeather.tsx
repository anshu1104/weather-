import { motion } from 'framer-motion';
import {
  MapPin, Thermometer, Droplets, Wind, Eye, Gauge,
  Sunrise, Sunset, ArrowUp, ArrowDown, Sun, Waves,
  Star, WindArrowDown
} from 'lucide-react';
import { WeatherData, WeatherCondition, OneCallData, AirPollutionData } from '../types';
import { useFavorites } from '../context/FavoritesContext';
import WeatherIcon from './WeatherIcon';

interface Props {
  weather: WeatherData;
  oneCall?: OneCallData | null;
  airPollution?: AirPollutionData | null;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function getAQILabel(aqi: number): { label: string; color: string } {
  switch (aqi) {
    case 1: return { label: 'Good', color: 'text-green-400' };
    case 2: return { label: 'Fair', color: 'text-yellow-400' };
    case 3: return { label: 'Moderate', color: 'text-orange-400' };
    case 4: return { label: 'Poor', color: 'text-red-400' };
    case 5: return { label: 'Very Poor', color: 'text-purple-400' };
    default: return { label: 'Unknown', color: 'text-white/50' };
  }
}

function getUVLabel(uvi: number): { label: string; color: string } {
  if (uvi <= 2) return { label: 'Low', color: 'text-green-400' };
  if (uvi <= 5) return { label: 'Moderate', color: 'text-yellow-400' };
  if (uvi <= 7) return { label: 'High', color: 'text-orange-400' };
  if (uvi <= 10) return { label: 'Very High', color: 'text-red-400' };
  return { label: 'Extreme', color: 'text-purple-400' };
}

export default function CurrentWeather({ weather, oneCall, airPollution }: Props) {
  const isDay = weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset;
  const condition = weather.weather[0].main as WeatherCondition;
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const fav = isFavorite(weather.name);

  const uvi = oneCall?.current?.uvi;
  const dewPoint = oneCall?.current?.dew_point;
  const aqi = airPollution?.list?.[0]?.main?.aqi;

  const details = [
    { icon: Droplets, label: 'Humidity', value: `${weather.main.humidity}%` },
    { icon: Wind, label: 'Wind', value: `${weather.wind.speed} m/s` },
    { icon: Eye, label: 'Visibility', value: `${(weather.visibility / 1000).toFixed(1)} km` },
    { icon: Gauge, label: 'Pressure', value: `${weather.main.pressure} hPa` },
    ...(uvi !== undefined ? [{ icon: Sun, label: 'UV Index', value: `${uvi} ${getUVLabel(uvi).label}`, valueColor: getUVLabel(uvi).color }] : []),
    ...(dewPoint !== undefined ? [{ icon: Waves, label: 'Dew Point', value: `${Math.round(dewPoint)}°C` }] : []),
    ...(aqi !== undefined ? [{ icon: WindArrowDown, label: 'Air Quality', value: getAQILabel(aqi).label, valueColor: getAQILabel(aqi).color }] : []),
    { icon: Sunrise, label: 'Sunrise', value: formatTime(weather.sys.sunrise) },
    { icon: Sunset, label: 'Sunset', value: formatTime(weather.sys.sunset) },
  ];

  const handleFavorite = () => {
    if (fav) {
      removeFavorite(weather.name);
    } else {
      addFavorite({
        name: weather.name,
        country: weather.sys.country,
        lat: weather.coord.lat,
        lon: weather.coord.lon,
        pinnedAt: Date.now(),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="glass-strong rounded-3xl p-6 md:p-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-white/80"
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">
              {weather.name}, {weather.sys.country}
            </span>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
              onClick={handleFavorite}
              className="ml-1"
              title={fav ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Star
                className={`w-4 h-4 transition-colors ${
                  fav ? 'text-yellow-400 fill-yellow-400' : 'text-white/30 hover:text-yellow-400/70'
                }`}
              />
            </motion.button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/50 text-xs mt-1"
          >
            {formatDate(weather.dt)}
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs font-medium"
        >
          {isDay ? 'Day' : 'Night'}
        </motion.div>
      </div>

      {/* Main weather */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full" />
          <WeatherIcon
            condition={condition}
            size={120}
            isDay={isDay}
            className="relative text-white drop-shadow-lg"
          />
        </motion.div>

        <div className="text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-start justify-center md:justify-start"
          >
            <span className="text-7xl md:text-8xl font-light text-white tracking-tighter">
              {Math.round(weather.main.temp)}
            </span>
            <span className="text-3xl text-white/70 mt-2">°C</span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/80 text-lg capitalize mt-1"
          >
            {weather.weather[0].description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mt-2 text-white/50 text-sm"
          >
            <span className="flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5" />
              Feels like {Math.round(weather.main.feels_like)}°
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center gap-3 mt-2 text-white/50 text-xs"
          >
            <span className="flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              {Math.round(weather.main.temp_max)}°
            </span>
            <span className="flex items-center gap-1">
              <ArrowDown className="w-3 h-3" />
              {Math.round(weather.main.temp_min)}°
            </span>
          </motion.div>
        </div>
      </div>

      {/* Details grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-3 gap-3"
      >
        {details.map((detail, i) => (
          <motion.div
            key={detail.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
          >
            <detail.icon className="w-5 h-5 text-white/60 shrink-0" />
            <div>
              <p className="text-white/40 text-xs">{detail.label}</p>
              <p className={`text-sm font-medium ${(detail as any).valueColor || 'text-white/90'}`}>
                {detail.value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
