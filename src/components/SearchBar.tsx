import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, X, Clock } from 'lucide-react';

interface Props {
  onSearch: (city: string) => void;
  onLocation: () => void;
  loading: boolean;
  recentSearches: string[];
}

export default function SearchBar({ onSearch, onLocation, loading, recentSearches }: Props) {
  const [query, setQuery] = useState('');
  const [showRecent, setShowRecent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowRecent(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowRecent(false);
    }
  };

  const handleRecentClick = (city: string) => {
    setQuery(city);
    onSearch(city);
    setShowRecent(false);
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => recentSearches.length > 0 && setShowRecent(true)}
            placeholder="Search for a city..."
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl glass text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30 transition-all text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          )}
        </div>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading || !query.trim()}
          className="p-3.5 rounded-2xl glass text-white hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLocation}
          disabled={loading}
          className="p-3.5 rounded-2xl glass text-white hover:bg-white/20 transition-colors disabled:opacity-50"
          title="Use my location"
        >
          <MapPin className="w-5 h-5" />
        </motion.button>
      </form>

      {/* Recent searches dropdown */}
      <AnimatePresence>
        {showRecent && recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl glass-strong overflow-hidden z-50"
          >
            <div className="p-2">
              <p className="text-xs text-white/50 px-3 py-1.5 uppercase tracking-wider font-medium">Recent</p>
              {recentSearches.map((city, i) => (
                <motion.button
                  key={city}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleRecentClick(city)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/80 hover:bg-white/10 transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-white/40" />
                  <span className="text-sm">{city}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
