import { motion, AnimatePresence } from 'framer-motion';
import { Star, X } from 'lucide-react';
import { useFavorites } from '../context/FavoritesContext';

interface Props {
  onSelect: (lat: number, lon: number, name: string) => void;
  currentCity?: string;
}

export default function FavoriteCities({ onSelect, currentCity }: Props) {
  const { favorites, removeFavorite } = useFavorites();

  if (favorites.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 justify-center"
    >
      <AnimatePresence mode="popLayout">
        {favorites.map((city) => (
          <motion.button
            key={city.name}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(city.lat, city.lon, city.name)}
            className={`group flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              currentCity?.toLowerCase() === city.name.toLowerCase()
                ? 'glass-strong text-white'
                : 'glass text-white/70 hover:text-white hover:bg-white/15'
            }`}
          >
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span>{city.name}</span>
            <span className="text-white/40 text-xs">{city.country}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeFavorite(city.name);
              }}
              className="ml-0.5 p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/20 transition-all"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.button>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
