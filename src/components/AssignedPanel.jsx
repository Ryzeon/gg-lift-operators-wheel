import { useState } from 'react';
import { Lock, Plus, X } from 'lucide-react';
import { LIFTS, POSITIONS } from '../constants/positions';

export const AssignedPanel = ({
  fixedPositions,
  onAddAssigned,
  onRemoveAssigned,
  enabledLifts,
  rentalsEnabled,
  rentalCount,
}) => {
  const [nameInput, setNameInput] = useState('');
  const [positionSelect, setPositionSelect] = useState('');

  const handleAdd = () => {
    const name = nameInput.trim();
    if (!name || !positionSelect) return;
    onAddAssigned(positionSelect, name);
    setNameInput('');
  };

  const assignedEntries = Object.entries(fixedPositions).flatMap(([pos, names]) =>
    names.map((name) => ({ position: pos, name }))
  );

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-600/50 p-4">
      <h3 className="text-slate-300 font-medium mb-3 text-sm flex items-center gap-2">
        <Lock size={18} />
        Assigned (not in roulette)
      </h3>
      <p className="text-slate-500 text-xs mb-3">
        Type a name and assign to a position. These people skip the roulette.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Name"
          className="flex-1 p-2 rounded-lg bg-slate-800/80 text-slate-200 text-sm border border-slate-600/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none"
        />
        <select
          value={positionSelect}
          onChange={(e) => setPositionSelect(e.target.value)}
          className="p-2 rounded-lg bg-slate-800/80 text-slate-200 text-sm border border-slate-600/60 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none min-w-[120px]"
        >
          <option value="">Position</option>
          {LIFTS.filter((l) => enabledLifts[l]).map((lift) => (
            <option key={`lift-${lift}`} value={`${POSITIONS.LIFT} ${lift}`}>
              Lift {lift}
            </option>
          ))}
          <option value={POSITIONS.SLEEDS}>Sleeds</option>
          {LIFTS.filter((l) => enabledLifts[l]).map((lift) => (
            <option key={`extras-${lift}`} value={`${POSITIONS.EXTRAS} ${lift}`}>
              Extras {lift}
            </option>
          ))}
          {rentalsEnabled &&
            Array.from({ length: rentalCount }, (_, i) => (
              <option key={`rental-${i}`} value={`${POSITIONS.RENTAL} ${i + 1}`}>
                Rental {i + 1}
              </option>
            ))}
        </select>
        <button
          onClick={handleAdd}
          disabled={!nameInput.trim() || !positionSelect}
          className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm flex items-center gap-1"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {assignedEntries.length > 0 && (
        <div className="space-y-2">
          {assignedEntries.map(({ position, name }) => (
            <div
              key={`${position}-${name}`}
              className="flex items-center justify-between bg-slate-800/60 px-3 py-2 rounded-lg text-sm"
            >
              <span className="text-slate-200">
                <span className="font-medium">{name}</span>
                <span className="text-slate-500 ml-2">→ {position}</span>
              </span>
              <button
                onClick={() => onRemoveAssigned(position, name)}
                className="text-slate-400 hover:text-red-400 p-1"
                aria-label="Remove"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
