// Constants for position types and lifts
export const LIFTS = ['A', 'B', 'C', 'D', 'E'];

export const POSITIONS = {
  LIFT: 'Lift',
  SLEEDS: 'Sleeds',
  EXTRAS: 'Extras',
  EXTRAS_OVERFLOW: 'Extras of Extra', // General pool for those without a lift
  RENTAL: 'Rental',
  RENTALS: 'Rentals'  // Single category, multiple slots
};

export const POSITION_COLORS = {
  [POSITIONS.LIFT]: {
    gradient: 'from-blue-500 via-blue-600 to-blue-700',
    icon: '🚡',
    glow: 'shadow-blue-500/50'
  },
  [POSITIONS.SLEEDS]: {
    gradient: 'from-green-500 via-green-600 to-green-700',
    icon: '⛷️',
    glow: 'shadow-green-500/50'
  },
  [POSITIONS.EXTRAS]: {
    gradient: 'from-purple-500 via-purple-600 to-purple-700',
    icon: '⭐',
    glow: 'shadow-purple-500/50'
  },
  [POSITIONS.RENTAL]: {
    gradient: 'from-orange-500 via-orange-600 to-orange-700',
    icon: '🎿',
    glow: 'shadow-orange-500/50'
  },
  [POSITIONS.RENTALS]: {
    gradient: 'from-orange-500 via-orange-600 to-orange-700',
    icon: '🎿',
    glow: 'shadow-orange-500/50'
  }
};

export const ANIMATION_DURATION = {
  INITIAL_SPIN: 2500,  // wheel spins before first release
  SPIN_AND_STOP: 2200, // ms for wheel to spin and stop on name
  STAGGER_DELAY: 2800, // ms between each name release (spin + stop + fly)
  NAME_FLIGHT: 1600,   // ms for name to fly to position
};
