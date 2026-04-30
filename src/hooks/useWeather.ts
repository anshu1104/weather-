import { useState, useCallback, useEffect } from 'react';
import { WeatherData, ForecastData, WeatherCondition, OneCallData, AirPollutionData } from '../types';

const API_KEY = 'd82843d763bec0d236a6127b64a24932';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [oneCall, setOneCall] = useState<OneCallData | null>(null);
  const [airPollution, setAirPollution] = useState<AirPollutionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('weatherRecentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const saveRecentSearch = useCallback((city: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== city.toLowerCase());
      const updated = [city, ...filtered].slice(0, 6);
      localStorage.setItem('weatherRecentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const fetchByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherRes, forecastRes, oneCallRes, airRes] = await Promise.allSettled([
        fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly`),
        fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
      ]);

      if (weatherRes.status === 'fulfilled') {
        const data = await weatherRes.value.json();
        if (data.cod === 200) {
          setWeather(data);
          saveRecentSearch(data.name);
        } else {
          setError(data.message || 'Location not found');
          setWeather(null);
        }
      } else {
        setError('Failed to fetch weather data');
        setWeather(null);
      }

      if (forecastRes.status === 'fulfilled') {
        const data = await forecastRes.value.json();
        if (data.cod === '200') setForecast(data);
      }

      if (oneCallRes.status === 'fulfilled') {
        const data = await oneCallRes.value.json();
        if (!data.cod) setOneCall(data);
      }

      if (airRes.status === 'fulfilled') {
        const data = await airRes.value.json();
        if (data.list) setAirPollution(data);
      }
    } catch (err) {
      setError('Failed to fetch weather data.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [saveRecentSearch]);

  const fetchWeather = useCallback(async (city: string) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    setOneCall(null);
    setAirPollution(null);

    try {
      const weatherRes = await fetch(`${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`);
      const weatherData = await weatherRes.json();

      if (weatherData.cod !== 200) {
        setError(weatherData.message || 'City not found');
        setWeather(null);
        setForecast(null);
        setLoading(false);
        return;
      }

      setWeather(weatherData);
      saveRecentSearch(weatherData.name);

      // Fetch forecast, onecall, and air pollution in parallel
      const { lat, lon } = weatherData.coord;
      const [forecastRes, oneCallRes, airRes] = await Promise.allSettled([
        fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly`),
        fetch(`${BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`),
      ]);

      if (forecastRes.status === 'fulfilled') {
        const data = await forecastRes.value.json();
        if (data.cod === '200') setForecast(data);
      }

      if (oneCallRes.status === 'fulfilled') {
        const data = await oneCallRes.value.json();
        if (!data.cod) setOneCall(data);
      }

      if (airRes.status === 'fulfilled') {
        const data = await airRes.value.json();
        if (data.list) setAirPollution(data);
      }
    } catch (err) {
      setError('Failed to fetch weather data. Please try again.');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, [saveRecentSearch]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          setError('Unable to get your location. Please search for a city.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, [fetchByCoords]);

  useEffect(() => {
    fetchWeather('London');
  }, []);

  const condition: WeatherCondition = (weather?.weather[0]?.main as WeatherCondition) || 'Clear';

  return {
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
    clearError: () => setError(null),
  };
}
