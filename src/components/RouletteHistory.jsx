import { useState, useEffect } from 'react';
import { History, Edit3, ChevronDown, ChevronUp } from 'lucide-react';
import { getHistory, hadManualModifications } from '../utils/rouletteHistory';

const formatTime = (timestamp) => {
  const d = new Date(timestamp);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} h ago`;
  return d.toLocaleDateString('en-US');
};

export const RouletteHistory = ({ refreshTrigger = 0, fullPage = false }) => {
  const [history, setHistory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getHistory().then((data) => {
      if (!cancelled) setHistory(data);
    });
    return () => { cancelled = true; };
  }, [refreshTrigger]);

  if (history.length === 0) {
    if (!fullPage) return null;
    return (
      <div className="bg-[#1e293b] rounded-xl border border-slate-600/50 p-8 text-center">
        <History size={48} className="mx-auto text-slate-500 mb-3" />
        <h3 className="text-slate-300 font-medium mb-2">No history yet</h3>
        <p className="text-slate-500 text-sm">Spin the wheel to see the latest assignments here.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-slate-600/50 p-4 ${fullPage ? 'bg-[#1e293b]' : 'bg-[#1e293b]'}`}>
      <h3 className="text-slate-300 font-medium mb-3 text-sm flex items-center gap-2">
        <History size={18} />
        Last 5 spins
      </h3>
      <div className="space-y-2">
        {history.map((entry) => {
          const isExpanded = expandedId === entry.hash;
          const hasManual = hadManualModifications(entry.fixedPositions);
          return (
            <div
              key={entry.hash}
              className="rounded-lg border border-slate-600/40 overflow-hidden"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : entry.hash)}
                className="w-full px-3 py-2.5 flex items-center justify-between gap-2 bg-slate-800/50 hover:bg-slate-700/50 text-left transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <code className="text-indigo-400 text-xs font-mono truncate">
                    {entry.hash}
                  </code>
                  <span className="text-slate-500 text-xs flex-shrink-0">
                    {formatTime(entry.timestamp)}
                  </span>
                  {hasManual && (
                    <span
                      className="flex items-center gap-1 text-amber-400 text-xs"
                      title="Had manual assignments"
                    >
                      <Edit3 size={12} />
                      Manual
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />
                )}
              </button>
              {isExpanded && (
                <div className="px-3 py-2 bg-slate-900/50 border-t border-slate-600/40 text-xs space-y-2 max-h-64 overflow-y-auto">
                  {hasManual && entry.fixedPositions && (
                    <div className="mb-3 pb-2 border-b border-slate-600/40">
                      <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-1.5">
                        <Edit3 size={12} />
                        Manual assignments
                      </div>
                      {Object.entries(entry.fixedPositions)
                        .filter(([, names]) => Array.isArray(names) && names.some((n) => n && String(n).trim()))
                        .map(([position, names]) => (
                          <div key={`manual-${position}`} className="flex gap-2 text-amber-300/90">
                            <span className="font-medium min-w-[100px]">{position}:</span>
                            <span>{names.filter(Boolean).join(', ')}</span>
                          </div>
                        ))}
                    </div>
                  )}
                  {entry.assignments && (
                    <>
                      <div className="font-medium text-slate-400 mb-1">All assignments</div>
                      {Object.entries(entry.assignments).map(([position, names]) => (
                        <div key={position} className="flex gap-2">
                          <span className="text-slate-500 font-medium min-w-[100px]">
                            {position}:
                          </span>
                          <span className="text-slate-300">
                            {Array.isArray(names) ? names.join(', ') : '-'}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
