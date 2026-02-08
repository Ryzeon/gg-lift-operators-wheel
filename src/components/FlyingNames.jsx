import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayoutEffect, useState } from 'react';
import { POSITION_COLORS, POSITIONS } from '../constants/positions';
import { getColorForIndex } from '../utils/wheelColors';

const BASE_FLIGHT_DURATION = 1600;

export const FlyingName = ({
  name,
  position,
  delay,
  startPosition,
  nameIndex = 0,
  duration = 1.6,
}) => {
  const [targetPosition, setTargetPosition] = useState(null);

  useLayoutEffect(() => {
    const lookup = () => {
      const el = document.getElementById(`position-${position}`);
      if (el) {
        const rect = el.getBoundingClientRect();
        setTargetPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
        return true;
      }
      return false;
    };
    if (!lookup()) {
      const retry = setTimeout(lookup, 100);
      return () => clearTimeout(retry);
    }
  }, [position]);

  let positionType = POSITIONS.LIFT;
  if (position.startsWith(POSITIONS.SLEEDS)) positionType = POSITIONS.SLEEDS;
  else if (position.startsWith(POSITIONS.EXTRAS) || position === POSITIONS.EXTRAS_OVERFLOW) positionType = POSITIONS.EXTRAS;
  else if (position === POSITIONS.RENTALS || position.startsWith(POSITIONS.RENTAL)) positionType = POSITIONS.RENTAL;

  const colorConfig = POSITION_COLORS[positionType];
  const nameColor = getColorForIndex(nameIndex);

  if (!targetPosition) return null;

  const badgeW = 140;
  const badgeH = 48;
  const startX = startPosition.x - badgeW / 2;
  const startY = startPosition.y - badgeH / 2;
  const endX = targetPosition.x - badgeW / 2;
  const endY = targetPosition.y - badgeH / 2;
  const midY = Math.min(startY, endY) - 80;

  return (
    <motion.div
      initial={{
        x: startX,
        y: startY,
        opacity: 1,
        scale: 1,
      }}
      animate={{
        x: [startX, startX, (startX + endX) / 2, endX],
        y: [startY, startY, midY, endY],
        opacity: [1, 1, 1, 1],
        scale: [1, 1.15, 1.1, 1],
      }}
      transition={{
        delay: delay / 1000,
        duration,
        times: [0, 0.1, 0.5, 1],
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="fixed pointer-events-none text-white px-7 py-4 rounded-2xl font-bold text-xl flex items-center gap-3 min-w-[160px] justify-center select-none"
      style={{
        zIndex: 2147483647,
        backgroundColor: nameColor,
        boxShadow:
          '0 0 0 4px rgba(255,255,255,0.6), 0 12px 40px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.4)',
      }}
    >
      <span className="text-3xl drop-shadow-lg">{colorConfig.icon}</span>
      <span
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
      >
        {name}
      </span>
    </motion.div>
  );
};

export const FlyingNames = ({
  flyingNames,
  rouletteAreaRef,
  speedMultiplier = 1,
}) => {
  const [startPosition, setStartPosition] = useState(() => ({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
  }));

  useLayoutEffect(() => {
    if (!flyingNames.length) return;
    const el = rouletteAreaRef?.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setStartPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2 - 20,
      });
    }
  }, [flyingNames, rouletteAreaRef]);

  const duration =
    (BASE_FLIGHT_DURATION * speedMultiplier) / 1000;

  const content = (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2147483646 }}
    >
      <AnimatePresence>
        {flyingNames.map((item) => (
          <FlyingName
            key={item.id}
            name={item.name}
            position={item.position}
            delay={item.delay}
            startPosition={startPosition}
            nameIndex={item.nameIndex ?? 0}
            duration={duration}
          />
        ))}
      </AnimatePresence>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(content, document.body)
    : null;
};
