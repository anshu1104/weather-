import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, X, Maximize2, Cloud, CloudRain, Thermometer, Wind } from 'lucide-react';

interface Props {
  lat: number;
  lon: number;
}

type MapLayer = 'clouds_new' | 'precipitation_new' | 'temp_new' | 'wind_new';

const LAYERS: { id: MapLayer; label: string; icon: typeof Cloud }[] = [
  { id: 'clouds_new', label: 'Clouds', icon: Cloud },
  { id: 'precipitation_new', label: 'Rain', icon: CloudRain },
  { id: 'temp_new', label: 'Temp', icon: Thermometer },
  { id: 'wind_new', label: 'Wind', icon: Wind },
];

//const API_KEY = 'd82843d763bec0d236a6127b64a24932';
const API_KEY = import.meta.env.VITE_API_KEY;

function getTileUrl(layer: MapLayer, z: number, x: number, y: number): string {
  return `https://tile.openweathermap.org/map/${layer}/${z}/${x}/${y}.png?appid=${API_KEY}`;
}

export default function WeatherMap({ lat, lon }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState<MapLayer>('clouds_new');
  const [zoom, setZoom] = useState(6);

  // Convert lat/lon to tile coordinates for center
  const centerTileX = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  const centerTileY = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) *
      Math.pow(2, zoom)
  );

  // Generate a 3x3 grid of tiles around center
  const tiles: { x: number; y: number }[] = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({ x: centerTileX + dx, y: centerTileY + dy });
    }
  }

  const zoomIn = () => setZoom(z => Math.min(z + 1, 10));
  const zoomOut = () => setZoom(z => Math.max(z - 1, 2));

  if (!isOpen) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={() => setIsOpen(true)}
        className="glass-strong rounded-2xl p-4 flex items-center gap-3 w-full hover:bg-white/15 transition-colors group"
      >
        <div className="p-2 rounded-xl bg-white/10">
          <Map className="w-5 h-5 text-white/80" />
        </div>
        <div className="text-left flex-1">
          <p className="text-white text-sm font-medium">Weather Map</p>
          <p className="text-white/40 text-xs">View live weather patterns</p>
        </div>
        <Maximize2 className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-strong rounded-3xl p-4 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4 text-white/70" />
          <h3 className="text-white/70 text-sm font-medium">Weather Map</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-lg glass hover:bg-white/15 text-white/70 text-sm font-bold"
          >
            −
          </button>
          <span className="text-white/40 text-xs w-8 text-center">{zoom}</span>
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-lg glass hover:bg-white/15 text-white/70 text-sm font-bold"
          >
            +
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg glass hover:bg-white/15 text-white/70 ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map container */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900/50">
        <div className="absolute inset-0" style={{ transform: `scale(${1 + (zoom - 6) * 0.5})`, transformOrigin: 'center' }}>
          {tiles.map((tile, i) => (
            <img
              key={`${tile.x}-${tile.y}-${i}`}
              src={getTileUrl(activeLayer, zoom, tile.x, tile.y)}
              alt=""
              className="absolute"
              style={{
                width: `${100 / 3}%`,
                height: `${100 / 3}%`,
                left: `${((tile.x - centerTileX + 1) / 3) * 100}%`,
                top: `${((tile.y - centerTileY + 1) / 3) * 100}%`,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ))}
        </div>
        {/* Center marker */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <div className="w-3 h-3 rounded-full bg-white shadow-lg border-2 border-blue-500 animate-pulse" />
        </div>
      </div>

      {/* Layer selector */}
      <div className="flex gap-1.5 mt-3">
        {LAYERS.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-all ${
              activeLayer === layer.id
                ? 'bg-white/20 text-white'
                : 'glass text-white/50 hover:text-white/70 hover:bg-white/10'
            }`}
          >
            <layer.icon className="w-3.5 h-3.5" />
            {layer.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
