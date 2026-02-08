import { useState, useCallback, useRef } from 'react';
import { distributeParticipants, getAvailableParticipants, getOrderedAssignments, getEmptyDisplayStructure } from '../utils/distribution';

const BASE_DURATIONS = {
  INITIAL_SPIN: 2500,
  SPIN_AND_STOP: 2200,
  STAGGER_DELAY: 2800,
  NAME_FLIGHT: 1600,
};

export const useRouletteDistribution = (speedMultiplier = 1) => {
  const cancelledRef = useRef(false);
  const timeoutsRef = useRef([]);
  const [assignments, setAssignments] = useState({});
  const [displayedAssignments, setDisplayedAssignments] = useState({});
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [flyingNames, setFlyingNames] = useState([]);
  const [wheelNames, setWheelNames] = useState([]);
  const [selectedName, setSelectedName] = useState(null);
  const [releaseIndex, setReleaseIndex] = useState(0);

  const startDistribution = useCallback((
    participantsList,
    enabledLifts,
    rentalsEnabled,
    rentalCount,
    fixedPositions
  ) => {
    cancelledRef.current = false;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const getDuration = (base) => Math.round(base * speedMultiplier);
    const schedule = (fn, delay) => {
      const id = setTimeout(() => {
        if (!cancelledRef.current) fn();
      }, delay);
      timeoutsRef.current.push(id);
      return id;
    };

    setIsSpinning(true);
    setShowResults(true);
    setFlyingNames([]);
    setWheelNames([]);
    setReleaseIndex(0);

    const available = getAvailableParticipants(participantsList, fixedPositions);
    const newAssignments = distributeParticipants(
      available,
      enabledLifts,
      rentalsEnabled,
      rentalCount,
      fixedPositions
    );

    const allOrdered = getOrderedAssignments(newAssignments);
    const ordered = allOrdered.filter(
      ({ position, name }) => !fixedPositions[position]?.includes(name)
    );
    const names = ordered.map(({ name }) => name);
    setWheelNames(names);
    setAssignments(newAssignments);
    setDisplayedAssignments(getEmptyDisplayStructure(newAssignments, fixedPositions));

    let releaseIndex = 0;

    const releaseNext = () => {
      if (releaseIndex >= ordered.length) {
        setIsSpinning(false);
        return;
      }
      const { position, name } = ordered[releaseIndex];
      const delay = 0;
      const id = `fly-${releaseIndex}-${name}-${position}`;
      setSelectedName(name);
      setFlyingNames(prev => [...prev, { id, name, position, delay, nameIndex: releaseIndex }]);
      // Remove name from wheel AFTER wheel has stopped (prevents visual mismatch)
      const spinDuration =
        releaseIndex === 0
          ? getDuration(BASE_DURATIONS.INITIAL_SPIN)
          : getDuration(BASE_DURATIONS.SPIN_AND_STOP);
      schedule(
        () => setWheelNames(prev => prev.filter((n) => n !== name)),
        spinDuration + 400
      );
      schedule(() => setSelectedName(null), 500);
      setReleaseIndex(releaseIndex + 1);

      const landTime = delay + getDuration(BASE_DURATIONS.NAME_FLIGHT);
      schedule(() => {
        setDisplayedAssignments(prev => ({
          ...prev,
          [position]: [...(prev[position] || []), name],
        }));
        setFlyingNames(prev => prev.filter(f => f.id !== id));
      }, landTime);

      releaseIndex++;
      schedule(releaseNext, getDuration(BASE_DURATIONS.STAGGER_DELAY));
    };

    schedule(releaseNext, getDuration(BASE_DURATIONS.INITIAL_SPIN));
  }, [speedMultiplier]);

  const reset = useCallback(() => {
    cancelledRef.current = true;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setAssignments({});
    setDisplayedAssignments({});
    setShowResults(false);
    setFlyingNames([]);
    setWheelNames([]);
    setSelectedName(null);
    setReleaseIndex(0);
    setIsSpinning(false);
  }, []);

  return {
    assignments,
    displayedAssignments,
    isSpinning,
    showResults,
    flyingNames,
    wheelNames,
    selectedName,
    releaseIndex,
    startDistribution,
    reset,
  };
};
