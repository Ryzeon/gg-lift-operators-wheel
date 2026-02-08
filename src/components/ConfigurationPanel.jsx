import { motion } from 'framer-motion';
import { Settings, Users, Unlock, Lock, Check } from 'lucide-react';
import { LIFTS } from '../constants/positions';

export const ConfigurationPanel = ({
  participants,
  setParticipants,
  participantsList,
  onLoadParticipants,
  enabledLifts,
  onToggleLift,
  rentalsEnabled,
  setRentalsEnabled,
  rentalCount,
  setRentalCount,
  showSettings,
}) => {
  if (!showSettings) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-[#1e293b] rounded-2xl border border-slate-600/50 shadow-xl p-6"
    >
      <div className="flex items-center gap-2 mb-6">
        <Settings className="text-slate-400" size={24} />
        <h2 className="text-xl font-semibold text-slate-100">Settings</h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-slate-300 font-medium mb-2 text-sm">
            <Users className="inline mr-2" size={18} />
            Participants (one per line)
          </label>
          <textarea
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            placeholder="John Doe&#10;Jane Smith&#10;Carlos Lopez&#10;Maria..."
            rows="6"
            className="w-full p-3.5 rounded-xl bg-slate-800/80 text-slate-100 placeholder-slate-500 border border-slate-600/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition-all resize-none text-sm"
          />
          <button
            onClick={onLoadParticipants}
            className="mt-3 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Check size={18} />
            Load Participants ({participants.split('\n').filter((n) => n.trim()).length})
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-slate-300 font-medium mb-2 text-sm">
              Active Lifts
            </label>
            <div className="flex flex-wrap gap-2">
              {LIFTS.map((lift) => (
                <button
                  key={lift}
                  onClick={() => onToggleLift(lift)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    enabledLifts[lift]
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'bg-slate-700/80 text-slate-400 hover:bg-slate-600/80'
                  }`}
                >
                  {enabledLifts[lift] ? (
                    <Unlock size={14} className="inline mr-1.5 -mt-0.5" />
                  ) : (
                    <Lock size={14} className="inline mr-1.5 -mt-0.5" />
                  )}
                  {lift}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center text-slate-300 font-medium mb-2 text-sm cursor-pointer gap-2">
              <input
                type="checkbox"
                checked={rentalsEnabled}
                onChange={(e) => setRentalsEnabled(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              Rentals
            </label>
            {rentalsEnabled && (
              <input
                type="number"
                min="1"
                max="10"
                value={rentalCount}
                onChange={(e) => setRentalCount(parseInt(e.target.value) || 1)}
                className="w-full p-3 rounded-xl bg-slate-800/80 text-slate-100 border border-slate-600/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none text-sm"
                placeholder="Count"
              />
            )}
          </div>
        </div>
      </div>

    </motion.div>
  );
};
