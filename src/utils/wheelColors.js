/**
 * Palette of distinct colors for roulette segments (one per name)
 */
export const WHEEL_COLORS = [
  'rgba(59, 130, 246, 0.95)',   // blue
  'rgba(168, 85, 247, 0.95)',   // violet
  'rgba(236, 72, 153, 0.95)',   // pink
  'rgba(34, 197, 94, 0.95)',    // green
  'rgba(245, 158, 11, 0.95)',   // amber
  'rgba(239, 68, 68, 0.95)',    // red
  'rgba(6, 182, 212, 0.95)',    // cyan
  'rgba(132, 204, 22, 0.95)',   // lime
  'rgba(251, 146, 60, 0.95)',   // orange
  'rgba(167, 139, 250, 0.95)',  // purple
  'rgba(20, 184, 166, 0.95)',   // teal
  'rgba(250, 204, 21, 0.95)',   // yellow
  'rgba(244, 63, 94, 0.95)',    // rose
  'rgba(99, 102, 241, 0.95)',   // indigo
  'rgba(52, 211, 153, 0.95)',   // emerald
  'rgba(251, 113, 133, 0.95)',  // pink-400
  'rgba(56, 189, 248, 0.95)',   // sky
  'rgba(161, 161, 170, 0.95)',  // zinc
  'rgba(253, 186, 116, 0.95)',  // orange-300
  'rgba(196, 181, 253, 0.95)',  // violet-300
];

export const getColorForIndex = (index) =>
  WHEEL_COLORS[index % WHEEL_COLORS.length];
