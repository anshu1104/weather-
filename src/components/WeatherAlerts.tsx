import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, Bell, Clock } from 'lucide-react';
import type { OneCallData } from '../types';

interface Props {
  alerts: NonNullable<OneCallData['alerts']>;
}

function formatAlertTime(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export default function WeatherAlerts({ alerts }: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const severityColor = (tags: string[]) => {
    if (tags.some(t => t.toLowerCase().includes('red') || t.toLowerCase().includes('extreme')))
      return 'border-red-500/50 bg-red-500/10';
    if (tags.some(t => t.toLowerCase().includes('orange') || t.toLowerCase().includes('severe')))
      return 'border-orange-500/50 bg-orange-500/10';
    return 'border-yellow-500/50 bg-yellow-500/10';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-strong rounded-3xl p-5 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-4">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Bell className="w-5 h-5 text-yellow-400" />
        </motion.div>
        <h3 className="text-white/80 text-sm font-semibold uppercase tracking-wider">
          {alerts.length} Weather Alert{alerts.length > 1 ? 's' : ''}
        </h3>
      </div>

      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <motion.div
            key={`${alert.event}-${alert.start}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className={`rounded-2xl border p-4 cursor-pointer transition-all ${severityColor(alert.tags)}`}
            onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm leading-tight">{alert.event}</p>
                  <p className="text-white/50 text-xs mt-0.5">{alert.sender_name}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-white/40 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatAlertTime(alert.start)}
                    </span>
                    <span>→</span>
                    <span>{formatAlertTime(alert.end)}</span>
                  </div>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expandedIndex === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-white/60 shrink-0" />
              </motion.div>
            </div>

            <AnimatePresence>
              {expandedIndex === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-white/60 text-xs leading-relaxed mt-3 pt-3 border-t border-white/10">
                    {alert.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
