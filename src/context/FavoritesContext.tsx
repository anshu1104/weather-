import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { FavoriteCity } from '../types';

interface FavoritesContextType {
  favorites: FavoriteCity[];
  addFavorite: (city: FavoriteCity) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

function loadFavorites(): FavoriteCity[] {
  try {
    const saved = localStorage.getItem('weatherFavorites');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites: FavoriteCity[]) {
  localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteCity[]>(loadFavorites);

  const addFavorite = useCallback((city: FavoriteCity) => {
    setFavorites(prev => {
      if (prev.some(f => f.name.toLowerCase() === city.name.toLowerCase())) return prev;
      const updated = [...prev, city];
      saveFavorites(updated);
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((name: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.name.toLowerCase() !== name.toLowerCase());
      saveFavorites(updated);
      return updated;
    });
  }, []);

  const isFavorite = useCallback((name: string) => {
    return favorites.some(f => f.name.toLowerCase() === name.toLowerCase());
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
