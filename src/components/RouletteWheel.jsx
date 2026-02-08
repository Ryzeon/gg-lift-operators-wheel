import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getColorForIndex } from '../utils/wheelColors';

const BASE_INITIAL_SPIN = 2500;
const BASE_SPIN_AND_STOP = 2200;

export const RouletteWheel = ({
  names = [],
  selectedName = null,
  releaseIndex = 0,
  speedMultiplier = 1,
}) => {
  // One segment per name so each appears once with unique color (no repetition)
  const segmentCount = Math.max(1, names.length);
  const segmentAngle = 360 / segmentCount;

  const segmentsWithNames =
    names.length > 0
      ? names.map((n) => n || '')
      : [];

  // Target rotation: spin to land segment (releaseIndex) at top (12 o'clock)
  // Conic-gradient 0deg is at top; clockwise rotation moves 0deg right, so we need
  // rotation = 360 - centerOfSegment to bring segment to top
  const getTargetRotation = (idx) => {
    if (idx < 0) return 0;
    const segmentCenter = (idx + 0.5) * segmentAngle;
    const base = 360 - segmentCenter;
    const fullSpins = 360 * (5 + idx);
    return fullSpins + base;
  };

  const [rotation, setRotation] = useState(0);
  const isFirstSpin = releaseIndex === 0 && names.length > 0;

  useEffect(() => {
    if (names.length === 0) return;
    setRotation(getTargetRotation(releaseIndex));
  }, [releaseIndex, names.length, segmentAngle]);

  const conicGradient =
    segmentsWithNames.length > 0
      ? segmentsWithNames
          .map((_, i) => {
            const color = getColorForIndex(i);
            return `${color} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`;
          })
          .join(', ')
      : 'rgba(51, 65, 85, 0.9) 0deg 360deg';

  return (
    <div className="flex flex-col items-center relative">
      {/* Fixed indicator triangle */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 drop-shadow-lg">
        <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[28px] border-l-transparent border-r-transparent border-t-white" />
      </div>

      {/* Selected name badge - appears when chosen */}
      {selectedName && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-2xl border-2 border-white/30"
        >
          {selectedName}
        </motion.div>
      )}

      {/* Main wheel - fixed size */}
      <motion.div
        className="relative w-[420px] h-[420px] md:w-[520px] md:h-[520px]"
        animate={{ rotate: rotation }}
        transition={{
          duration: (isFirstSpin ? BASE_INITIAL_SPIN : BASE_SPIN_AND_STOP) * speedMultiplier / 1000,
          ease: [0.2, 0.8, 0.2, 1],
        }}
      >
        <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl ring-2 ring-slate-500/60">
          <div
            className="absolute inset-0 rounded-full p-1"
            style={{
              background: `conic-gradient(${conicGradient})`,
            }}
          >
            <div className="w-full h-full rounded-full overflow-hidden relative bg-slate-900/30">
              {segmentsWithNames.map((name, i) => {
                const angle = (i + 0.5) * segmentAngle - 90;
                const radius = 42;
                const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
                const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
                return (
                  <div
                    key={`seg-${i}`}
                    className="absolute text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] whitespace-nowrap"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                      fontSize: names.length > 15 ? '13px' : '16px',
                    }}
                  >
                    {name || ''}
                  </div>
                );
              })}
              <div className="absolute inset-[22%] rounded-full bg-slate-800 flex items-center justify-center ring-2 ring-slate-600/60 shadow-inner">
                <div className="w-[50%] h-[50%] rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-4xl md:text-5xl">🎯</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <p className="mt-6 text-slate-400 text-sm font-medium">Spinning...</p>
    </div>
  );
};
