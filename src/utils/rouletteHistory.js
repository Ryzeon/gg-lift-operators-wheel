const STORAGE_KEY = 'ruleta-lift-history';
const MAX_ENTRIES = 5;
const JSONBIN_BASE = 'https://api.jsonbin.io/v3';

const apiKey = import.meta.env.VITE_JSONBIN_API_KEY;
const binId = import.meta.env.VITE_JSONBIN_BIN_ID;
const isJsonBinEnabled = () => !!(apiKey && binId);

const jsonBinHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Master-Key': apiKey,
});

/**
 * Generates unique hash for each run
 */
export const generateHash = () => {
  const str = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `rl-${Math.abs(hash).toString(36).slice(0, 8)}`;
};

/**
 * Saves a spin to history (localStorage + JSONBin if configured)
 * @param {Object} entry - { hash, assignments, fixedPositions, timestamp }
 */
export const saveToHistory = (entry) => {
  const newEntry = { ...entry, timestamp: entry.timestamp || Date.now() };

  // Always save to localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const history = raw ? JSON.parse(raw) : [];
    const updated = [newEntry, ...history].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Failed to save history to localStorage:', e);
  }

  // If JSONBin configured, also save globally
  if (isJsonBinEnabled()) {
    fetch(`${JSONBIN_BASE}/b/${binId}/latest`)
      .then((r) => r.json())
      .then((res) => {
        const current = Array.isArray(res?.record) ? res.record : (Array.isArray(res) ? res : []);
        const updated = [newEntry, ...current].slice(0, MAX_ENTRIES);
        return fetch(`${JSONBIN_BASE}/b/${binId}`, {
          method: 'PUT',
          headers: jsonBinHeaders(),
          body: JSON.stringify(updated),
        });
      })
      .catch((e) => console.warn('Failed to save history to JSONBin:', e));
  }
};

/**
 * Gets history (async for JSONBin; returns promise)
 * Uses JSONBin if configured (global), otherwise localStorage
 * @returns {Promise<Array>}
 */
export const getHistory = async () => {
  if (isJsonBinEnabled()) {
    try {
      const res = await fetch(`${JSONBIN_BASE}/b/${binId}/latest?meta=false`, {
        headers: { 'X-Master-Key': apiKey },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch');
      const arr = Array.isArray(data) ? data : (Array.isArray(data?.record) ? data.record : []);
      return arr;
    } catch (e) {
      console.warn('JSONBin fetch failed, using localStorage:', e);
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Checks if there were manual modifications (fixed positions)
 */
export const hadManualModifications = (fixedPositions) => {
  if (!fixedPositions || typeof fixedPositions !== 'object') return false;
  const names = Object.values(fixedPositions).flat();
  return names.some((n) => n && String(n).trim() !== '');
};
