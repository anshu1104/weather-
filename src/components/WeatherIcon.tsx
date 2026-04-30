import {
  Sun, CloudRain, CloudDrizzle, CloudLightning,
  Snowflake, CloudFog, Wind, CloudSun, CloudMoon,
  Moon
} from 'lucide-react';
import { WeatherCondition } from '../types';

interface Props {
  condition: WeatherCondition;
  size?: number;
  className?: string;
  isDay?: boolean;
}

export default function WeatherIcon({ condition, size = 48, className = '', isDay = true }: Props) {
  const iconProps = { size, className };

  switch (condition) {
    case 'Clear':
      return isDay ? <Sun {...iconProps} /> : <Moon {...iconProps} />;
    case 'Clouds':
      return isDay ? <CloudSun {...iconProps} /> : <CloudMoon {...iconProps} />;
    case 'Rain':
      return <CloudRain {...iconProps} />;
    case 'Drizzle':
      return <CloudDrizzle {...iconProps} />;
    case 'Thunderstorm':
      return <CloudLightning {...iconProps} />;
    case 'Snow':
      return <Snowflake {...iconProps} />;
    case 'Mist':
    case 'Fog':
    case 'Haze':
      return <CloudFog {...iconProps} />;
    case 'Smoke':
    case 'Dust':
    case 'Sand':
    case 'Ash':
      return <Wind {...iconProps} />;
    case 'Squall':
    case 'Tornado':
      return <Wind {...iconProps} />;
    default:
      return isDay ? <Sun {...iconProps} /> : <Moon {...iconProps} />;
  }
}

export function getWeatherEmoji(condition: WeatherCondition): string {
  const emojiMap: Record<string, string> = {
    Clear: '☀️',
    Clouds: '☁️',
    Rain: '🌧️',
    Drizzle: '🌦️',
    Thunderstorm: '⛈️',
    Snow: '❄️',
    Mist: '🌫️',
    Fog: '🌫️',
    Haze: '🌫️',
    Smoke: '💨',
    Dust: '💨',
    Sand: '💨',
    Ash: '💨',
    Squall: '💨',
    Tornado: '🌪️',
  };
  return emojiMap[condition] || '☀️';
}
