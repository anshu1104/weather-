import { useMemo } from 'react';
import { WeatherCondition } from '../types';
import { useTheme } from '../context/ThemeContext';

interface Props {
  condition: WeatherCondition;
}

const weatherGradients: Record<string, { light: string; dark: string }> = {
  Clear: { light: 'from-amber-400 via-orange-400 to-rose-400', dark: 'from-indigo-950 via-purple-950 to-slate-950' },
  Clouds: { light: 'from-slate-400 via-gray-400 to-zinc-500', dark: 'from-slate-900 via-gray-900 to-zinc-950' },
  Rain: { light: 'from-slate-700 via-blue-800 to-indigo-900', dark: 'from-slate-950 via-blue-950 to-indigo-950' },
  Drizzle: { light: 'from-slate-500 via-blue-600 to-indigo-700', dark: 'from-slate-900 via-blue-950 to-indigo-950' },
  Thunderstorm: { light: 'from-purple-900 via-indigo-900 to-slate-900', dark: 'from-purple-950 via-indigo-950 to-slate-950' },
  Snow: { light: 'from-sky-200 via-blue-200 to-indigo-200', dark: 'from-slate-800 via-blue-900 to-indigo-950' },
  Mist: { light: 'from-gray-400 via-slate-400 to-zinc-500', dark: 'from-gray-900 via-slate-900 to-zinc-950' },
  Fog: { light: 'from-gray-400 via-slate-400 to-zinc-500', dark: 'from-gray-900 via-slate-900 to-zinc-950' },
  Haze: { light: 'from-amber-300 via-orange-300 to-yellow-400', dark: 'from-amber-950 via-orange-950 to-yellow-950' },
  Smoke: { light: 'from-stone-500 via-gray-500 to-zinc-600', dark: 'from-stone-950 via-gray-950 to-zinc-950' },
  Dust: { light: 'from-amber-600 via-orange-500 to-yellow-600', dark: 'from-amber-950 via-orange-950 to-yellow-950' },
  Sand: { light: 'from-amber-500 via-orange-400 to-yellow-500', dark: 'from-amber-950 via-orange-950 to-yellow-950' },
  Ash: { light: 'from-gray-600 via-stone-600 to-zinc-700', dark: 'from-gray-950 via-stone-950 to-zinc-950' },
  Squall: { light: 'from-slate-600 via-blue-700 to-indigo-800', dark: 'from-slate-950 via-blue-950 to-indigo-950' },
  Tornado: { light: 'from-gray-800 via-slate-800 to-zinc-900', dark: 'from-gray-950 via-slate-950 to-zinc-950' },
};

export default function WeatherBackground({ condition }: Props) {
  const { isDark } = useTheme();

  const gradient = useMemo(() => {
    const entry = weatherGradients[condition] || weatherGradients.Clear;
    return isDark ? entry.dark : entry.light;
  }, [condition, isDark]);

  const orbOpacity = isDark ? '0.05' : '0.1';
  const orbOpacity2 = isDark ? '0.03' : '0.05';

  return (
    <div className="fixed inset-0 -z-10">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} animate-gradient transition-all duration-1000`}
      />
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl animate-float"
          style={{ background: `rgba(255,255,255,${orbOpacity})` }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1.5s', background: `rgba(255,255,255,${orbOpacity2})` }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '3s', background: `rgba(255,255,255,${orbOpacity})` }}
        />
      </div>
      {/* Rain effect for rain/thunderstorm */}
      {(condition === 'Rain' || condition === 'Drizzle' || condition === 'Thunderstorm') && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 bg-white/10 animate-rain"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * -20}%`,
                height: `${15 + Math.random() * 25}px`,
                animationDuration: `${0.5 + Math.random() * 0.8}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
