import { POSITION_COLORS, POSITIONS } from '../constants/positions';
import { getPositionSlotsStructure } from '../utils/distribution';

const getPositionType = (position) => {
  if (position.startsWith(POSITIONS.LIFT)) return POSITIONS.LIFT;
  if (position.startsWith(POSITIONS.SLEEDS)) return POSITIONS.SLEEDS;
  if (position.startsWith(POSITIONS.EXTRAS) || position === POSITIONS.EXTRAS_OVERFLOW) return POSITIONS.EXTRAS;
  if (position === POSITIONS.RENTALS || position.startsWith(POSITIONS.RENTAL)) return POSITIONS.RENTAL;
  return POSITIONS.LIFT;
};

const CARD_STYLES = {
  [POSITIONS.LIFT]: 'border-blue-500/30',
  [POSITIONS.SLEEDS]: 'border-emerald-500/30',
  [POSITIONS.EXTRAS]: 'border-violet-500/30',
  [POSITIONS.RENTAL]: 'border-amber-500/30',
};

export const EditableAssignmentsGrid = ({
  enabledLifts,
  rentalsEnabled,
  rentalCount,
  fixedPositions,
  onSlotChange,
}) => {
  const structure = getPositionSlotsStructure(
    enabledLifts,
    rentalsEnabled,
    rentalCount
  );

  return (
    <div>
      <h3 className="text-slate-300 font-medium mb-3 text-sm">Assignments</h3>
      <p className="text-slate-500 text-xs mb-4">
        Type names in the slots to assign them (they skip the roulette). Empty slots get filled by the wheel.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {structure.map(({ position, slotCount }) => {
          const positionType = getPositionType(position);
          const colorConfig = POSITION_COLORS[positionType];
          const cardStyle = CARD_STYLES[positionType] || CARD_STYLES[POSITIONS.LIFT];
          const names = fixedPositions[position] || [];

          return (
            <div
              key={position}
              id={`position-${position}`}
              className={`rounded-xl border bg-slate-700/80 p-4 ${cardStyle}`}
            >
              <h3 className="text-slate-200 font-semibold mb-3 flex items-center gap-2 text-sm">
                <span className="text-lg">{colorConfig.icon}</span>
                {position}
              </h3>

              <div className="space-y-2">
                {Array.from({ length: slotCount }, (_, idx) => {
                  const value = names[idx] || '';
                  return (
                    <input
                      key={idx}
                      type="text"
                      value={value}
                      onChange={(e) =>
                        onSlotChange(position, idx, e.target.value.trim())
                      }
                      placeholder="Type name..."
                      className="w-full px-3 py-2 rounded-lg bg-slate-800/80 text-slate-200 text-sm border border-slate-600/60 placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none"
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
