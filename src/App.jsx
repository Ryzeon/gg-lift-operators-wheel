import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Play, RotateCcw } from 'lucide-react';
import {
  ConfigurationPanel,
  RouletteWheel,
  ResultsGrid,
  FlyingNames,
  EditableAssignmentsGrid,
} from './components';
import { useRouletteDistribution } from './hooks/useRouletteDistribution';
import './App.css';

function App() {
  const [participants, setParticipants] = useState('');
  const [participantsList, setParticipantsList] = useState([]);
  const [enabledLifts, setEnabledLifts] = useState({
    A: true, B: true, C: true, D: true, E: true,
  });
  const [fixedPositions, setFixedPositions] = useState({});
  const [rentalsEnabled, setRentalsEnabled] = useState(false);
  const [rentalCount, setRentalCount] = useState(1);
  const [showSettings, setShowSettings] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1); // 0.5=Fast, 1=Normal, 1.5=Slow

  const rouletteAreaRef = useRef(null);

  const {
    displayedAssignments,
    isSpinning,
    showResults,
    flyingNames,
    wheelNames,
    selectedName,
    releaseIndex,
    startDistribution,
    reset: resetDistribution,
  } = useRouletteDistribution(speedMultiplier);

  const handleLoadParticipants = () => {
    const names = participants
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    setParticipantsList(names);
    setShowSettings(false);
  };

  const handleToggleLift = (lift) => {
    setEnabledLifts((prev) => ({ ...prev, [lift]: !prev[lift] }));
  };

  const handleSlotChange = (position, slotIndex, value) => {
    setFixedPositions((prev) => {
      const arr = prev[position] || [];
      const newArr = [...arr];
      while (newArr.length <= slotIndex) newArr.push('');
      newArr[slotIndex] = value;
      return { ...prev, [position]: newArr };
    });
  };

  const getFixedPositionsForDistribution = () => {
    return Object.fromEntries(
      Object.entries(fixedPositions).map(([pos, names]) => [
        pos,
        (names || []).filter(Boolean),
      ])
    );
  };

  const handleStartRoulette = () => {
    setShowSettings(false);
    startDistribution(
      participantsList,
      enabledLifts,
      rentalsEnabled,
      rentalCount,
      getFixedPositionsForDistribution()
    );
  };

  const handleReset = () => {
    resetDistribution();
    setFixedPositions({});
    setShowSettings(true);
  };

  const hasAssignments =
    showResults && Object.keys(displayedAssignments).length > 0;

  return (
    <div className="min-h-screen bg-pattern" aria-busy={isSpinning}>
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-8 md:py-10">
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-100 mb-1">
            The wheel of truth
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Automatic workstation distribution
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 lg:gap-10 items-start">
          {/* LEFT: Config + Assignments */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              <ConfigurationPanel
                participants={participants}
                setParticipants={setParticipants}
                participantsList={participantsList}
                onLoadParticipants={handleLoadParticipants}
                enabledLifts={enabledLifts}
                onToggleLift={handleToggleLift}
                rentalsEnabled={rentalsEnabled}
                setRentalsEnabled={setRentalsEnabled}
                rentalCount={rentalCount}
                setRentalCount={setRentalCount}
                showSettings={showSettings}
              />
            </AnimatePresence>

            {participantsList.length > 0 && !hasAssignments && (
              <>
                <div className="bg-[#1e293b] rounded-xl border border-slate-600/50 p-4">
                  <h3 className="text-slate-300 font-medium mb-3 text-sm">Participants ({participantsList.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {participantsList.map((name) => (
                      <span
                        key={name}
                        className="px-3 py-1.5 rounded-lg bg-slate-700/80 text-slate-200 text-sm"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
                <EditableAssignmentsGrid
                  enabledLifts={enabledLifts}
                  rentalsEnabled={rentalsEnabled}
                  rentalCount={rentalCount}
                  fixedPositions={fixedPositions}
                  onSlotChange={handleSlotChange}
                />
              </>
            )}

            {hasAssignments && (
              <div>
                <h3 className="text-slate-300 font-medium mb-4 text-sm">Assignments</h3>
                <ResultsGrid assignments={displayedAssignments} />
              </div>
            )}
          </div>

          {/* RIGHT: Buttons + Wheel */}
          <div
            ref={rouletteAreaRef}
            className="min-h-[480px] flex flex-col items-center bg-[#1e293b]/50 rounded-2xl border border-slate-600/30"
          >
            {participantsList.length > 0 && (
              <div className="flex flex-wrap gap-3 justify-end items-center w-full p-4 pb-2">
                <label className="flex items-center gap-2 text-slate-300 text-sm mr-auto">
                  <span>Speed:</span>
                  <select
                    value={speedMultiplier}
                    onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                    className="px-3 py-1.5 rounded-lg bg-slate-700/80 text-slate-100 border border-slate-600/60 text-sm"
                  >
                    <option value={0.5}>Fast</option>
                    <option value={1}>Normal</option>
                    <option value={1.5}>Slow</option>
                  </select>
                </label>
                {!showSettings && !isSpinning && (
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-5 py-2.5 rounded-xl bg-slate-600 hover:bg-slate-500 text-white font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <Settings size={18} />
                    Settings
                  </button>
                )}
                {!isSpinning && (
                  <button
                    onClick={handleStartRoulette}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <Play size={18} />
                    Spin Wheel
                  </button>
                )}
                {(hasAssignments || isSpinning) && (
                  <button
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw size={18} />
                    Reset
                  </button>
                )}
              </div>
            )}
            <div className="flex-1 flex flex-col items-center justify-center w-full py-4">
            <AnimatePresence mode="wait">
              {isSpinning || wheelNames.length > 0 ? (
                <motion.div
                  key="wheel"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex justify-center py-8"
                >
                  <RouletteWheel
                    names={wheelNames}
                    selectedName={selectedName}
                    releaseIndex={releaseIndex}
                    speedMultiplier={speedMultiplier}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-slate-500 text-center py-24 px-6"
                >
                  <p className="text-base">Load participants and spin to start</p>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </div>
        </div>

        <FlyingNames
          flyingNames={flyingNames}
          rouletteAreaRef={rouletteAreaRef}
          speedMultiplier={speedMultiplier}
        />

        <footer className="text-center mt-16 text-slate-500 text-xs">
          <p>Made by Ryzeon</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
