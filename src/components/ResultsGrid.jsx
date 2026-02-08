import { motion } from 'framer-motion';
import { POSITION_COLORS, POSITIONS } from '../constants/positions';

const getPositionType = (position) => {
  if (position.startsWith(POSITIONS.LIFT)) return POSITIONS.LIFT;
  if (position.startsWith(POSITIONS.SLEEDS)) return POSITIONS.SLEEDS;
  if (position.startsWith(POSITIONS.EXTRAS) || position === POSITIONS.EXTRAS_OVERFLOW) return POSITIONS.EXTRAS;
  if (position === POSITIONS.RENTALS || position.startsWith(POSITIONS.RENTAL)) return POSITIONS.RENTAL;
  return POSITIONS.LIFT;
};

const CARD_STYLES = {
  [POSITIONS.LIFT]: 'bg-slate-700/80 border-blue-500/30',
  [POSITIONS.SLEEDS]: 'bg-slate-700/80 border-emerald-500/30',
  [POSITIONS.EXTRAS]: 'bg-slate-700/80 border-violet-500/30',
  [POSITIONS.RENTAL]: 'bg-slate-700/80 border-amber-500/30',
};

export const PositionCard = ({ position, names, index }) => {
  const positionType = getPositionType(position);
  const colorConfig = POSITION_COLORS[positionType];
  const cardStyle = CARD_STYLES[positionType] || CARD_STYLES[POSITIONS.LIFT];

  return (
    <motion.div
      id={`position-${position}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className={`rounded-xl border p-4 ${cardStyle}`}
    >
      <h3 className="text-slate-200 font-semibold mb-3 flex items-center gap-2 text-sm">
        <span className="text-lg">{colorConfig.icon}</span>
        {position}
      </h3>

      <div className="space-y-2">
        {names.map((name, idx) => (
          <motion.div
            key={`${name}-${idx}`}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-slate-800/60 px-3 py-2 rounded-lg text-slate-200 text-sm font-medium border border-slate-600/40"
          >
            {name}
          </motion.div>
        ))}

        {names.length === 0 && (
          <div className="bg-slate-800/40 px-3 py-3 rounded-lg text-slate-500 text-sm italic text-center">
            Unassigned
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const ResultsGrid = ({ assignments }) => {
  const entries = Object.entries(assignments || {});
  if (entries.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {entries.map(([position, names], index) => (
        <PositionCard
          key={position}
          position={position}
          names={names}
          index={index}
        />
      ))}
    </div>
  );
};
