import { LIFTS, POSITIONS } from '../constants/positions';

/**
 * Entero aleatorio uniforme en [0, max) - sin sesgo (rejection sampling).
 * crypto.getRandomValues + rechazo de valores que causarían desbalance.
 */
const secureRandomInt = (max) => {
  if (max <= 0) return 0;
  const range = 2 ** 32;
  const threshold = range - (range % max);
  let value;
  do {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    value = arr[0];
  } while (value >= threshold);
  return value % max;
};

/**
 * Fisher-Yates shuffle con crypto - TODOS tienen EXACTAMENTE la misma probabilidad.
 * Cada permutación tiene probabilidad 1/n! (imposible de sesgar).
 * @param {Array} array
 * @returns {Array} nuevo array mezclado
 */
const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Distributes participants to positions based on configuration
 * @param {string[]} availableParticipants - List of participants not assigned to fixed positions
 * @param {Object} enabledLifts - Object indicating which lifts are active
 * @param {boolean} rentalsEnabled - Whether rentals are enabled
 * @param {number} rentalCount - Number of rental positions
 * @param {Object} fixedPositions - Pre-assigned positions
 * @returns {Object} Object with position assignments
 */
export const distributeParticipants = (
  availableParticipants,
  enabledLifts,
  rentalsEnabled,
  rentalCount,
  fixedPositions
) => {
  // Fisher-Yates shuffle: distribución uniforme y justa
  const shuffled = shuffle(availableParticipants);
  const assignments = {};
  Object.entries(fixedPositions || {}).forEach(([k, v]) => {
    assignments[k] = [...(v || [])];
  });
  const activeLifts = LIFTS.filter(lift => enabledLifts[lift]);
  let currentIndex = 0;

  const getLiftSlotCount = (lift) => (['D', 'E'].includes(lift) ? 1 : 2);

  const fillSlots = (key, count) => {
    if (!assignments[key]) assignments[key] = [];
    const need = count - assignments[key].length;
    for (let i = 0; i < need && currentIndex < shuffled.length; i++) {
      assignments[key].push(shuffled[currentIndex]);
      currentIndex++;
    }
  };

  activeLifts.forEach(lift => {
    fillSlots(`${POSITIONS.LIFT} ${lift}`, getLiftSlotCount(lift));
  });
  fillSlots(POSITIONS.SLEEDS, 1);
  // 1) First: 5 Extras (one per lift)
  activeLifts.forEach(lift => {
    fillSlots(`${POSITIONS.EXTRAS} ${lift}`, 1);
  });
  // 2) If remaining: add 1 more extra for Lift A, B, C only
  ['A', 'B', 'C'].forEach(lift => {
    if (activeLifts.includes(lift)) fillSlots(`${POSITIONS.EXTRAS} ${lift}`, 2);
  });
  // 3) If Rentals enabled: fill Rentals slots (single "Rentals" category)
  if (rentalsEnabled && rentalCount > 0) {
    fillSlots(POSITIONS.RENTALS, rentalCount);
  }
  // 4) If still remaining: put in EXTRAS (general pool, no lift assigned)
  while (currentIndex < shuffled.length) {
    if (!assignments[POSITIONS.EXTRAS_OVERFLOW]) assignments[POSITIONS.EXTRAS_OVERFLOW] = [];
    assignments[POSITIONS.EXTRAS_OVERFLOW].push(shuffled[currentIndex]);
    currentIndex++;
  }

  return assignments;
};

/**
 * Gets participants available for distribution (excluding fixed positions)
 * @param {string[]} allParticipants - All participants
 * @param {Object} fixedPositions - Pre-assigned positions
 * @returns {string[]} Available participants
 */
export const getAvailableParticipants = (allParticipants, fixedPositions) => {
  const fixedNames = Object.values(fixedPositions).flat();
  return allParticipants.filter(name => !fixedNames.includes(name));
};

/**
 * Creates display structure - fixed positions keep their names, others start empty
 */
export const getEmptyDisplayStructure = (assignments, fixedPositions = {}) => {
  return Object.fromEntries(
    Object.entries(assignments).map(([pos, names]) => {
      const fixed = fixedPositions[pos];
      return [pos, fixed ? [...fixed] : []];
    })
  );
};

/**
 * Converts assignments to ordered flat list [{ position, name }, ...]
 */
export const getOrderedAssignments = (assignments) => {
  const ordered = [];
  Object.entries(assignments).forEach(([position, names]) => {
    names.forEach(name => ordered.push({ position, name }));
  });
  return ordered;
};

/**
 * Gets position structure (slots) from config for display before spin
 */
export const getPositionSlotsStructure = (
  enabledLifts,
  rentalsEnabled,
  rentalCount
) => {
  const structure = [];
  const activeLifts = LIFTS.filter((lift) => enabledLifts[lift]);
  const getLiftSlotCount = (lift) => (['D', 'E'].includes(lift) ? 1 : 2);

  activeLifts.forEach((lift) => {
    structure.push({ position: `${POSITIONS.LIFT} ${lift}`, slotCount: getLiftSlotCount(lift) });
  });

  structure.push({ position: POSITIONS.SLEEDS, slotCount: 1 });

  activeLifts.forEach((lift) => {
    const count = ['A', 'B', 'C'].includes(lift) ? 2 : 1;
    structure.push({ position: `${POSITIONS.EXTRAS} ${lift}`, slotCount: count });
  });

  if (rentalsEnabled && rentalCount > 0) {
    structure.push({ position: POSITIONS.RENTALS, slotCount: rentalCount });
  }
  structure.push({ position: POSITIONS.EXTRAS_OVERFLOW, slotCount: 5 }); // General overflow (last)

  return structure;
};

/**
 * Gets the position color configuration
 * @param {string} position - Position name
 * @returns {Object} Color configuration object
 */
export const getPositionColor = (position) => {
  if (position.startsWith(POSITIONS.LIFT)) return 'from-blue-500 to-blue-700';
  if (position.startsWith(POSITIONS.SLEEDS)) return 'from-green-500 to-green-700';
  if (position.startsWith(POSITIONS.EXTRAS) || position === POSITIONS.EXTRAS_OVERFLOW) return 'from-purple-500 to-purple-700';
  if (position === POSITIONS.RENTALS || position.startsWith(POSITIONS.RENTAL)) return 'from-orange-500 to-orange-700';
  return 'from-gray-500 to-gray-700';
};
