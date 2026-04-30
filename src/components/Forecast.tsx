import { motion } from 'framer-motion';
import { ForecastData } from '../types';
import WeatherIcon from './WeatherIcon';

interface Props {
  forecast: ForecastData;
}

function getDayName(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
}

export default function Forecast({ forecast }: Props) {
  // Group by day and get one entry per day (around noon)
  const dailyForecast = forecast.list.reduce<typeof forecast.list>((acc, item) => {
    const date = item.dt_txt.split(' ')[0];
    const existing = acc.find(a => a.dt_txt.split(' ')[0] === date);
    if (!existing) {
      acc.push(item);
    }
    return acc;
  }, []).slice(0, 5);

  // Get next 8 items for hourly (24 hours)
  const hourlyForecast = forecast.list.slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Hourly forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-strong rounded-3xl p-5"
      >
        <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4">Hourly Forecast</h3>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {hourlyForecast.map((item, i) => (
            <motion.div
              key={item.dt}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + i * 0.05 }}
              className="flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-white/50 text-xs">{formatTime(item.dt_txt)}</span>
              <WeatherIcon
                condition={item.weather[0].main as import('../types').WeatherCondition}
                size={28}
                className="text-white/80"
              />
              <span className="text-white font-medium text-sm">{Math.round(item.main.temp)}°</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Daily forecast */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="glass-strong rounded-3xl p-5"
      >
        <h3 className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4">5-Day Forecast</h3>
        <div className="space-y-2">
          {dailyForecast.map((item, i) => (
            <motion.div
              key={item.dt}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + i * 0.08 }}
              className="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3 w-24">
                <span className="text-white/70 text-sm font-medium">{getDayName(item.dt_txt)}</span>
              </div>
              <div className="flex items-center gap-2 flex-1 justify-center">
                <WeatherIcon
                  condition={item.weather[0].main as import('../types').WeatherCondition}
                  size={24}
                  className="text-white/70"
                />
                <span className="text-white/50 text-xs hidden sm:inline capitalize">
                  {item.weather[0].description}
                </span>
              </div>
              <div className="flex items-center gap-3 w-24 justify-end">
                <span className="text-white/40 text-sm">{Math.round(item.main.temp_min)}°</span>
                <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden hidden sm:block">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((item.main.temp_max - item.main.temp_min) / 20) * 100}%` }}
                    transition={{ delay: 1.2 + i * 0.1, duration: 0.8 }}
                    className="h-full rounded-full bg-gradient-to-r from-white/40 to-white/70"
                  />
                </div>
                <span className="text-white font-medium text-sm">{Math.round(item.main.temp_max)}°</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
