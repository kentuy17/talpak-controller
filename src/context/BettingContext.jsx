import { createContext, useState, useEffect, useMemo, useRef } from 'react';
import { io } from 'socket.io-client';
import { COMMISSION, calculatePayout } from '../utils/bettingUtils';
import { useContext } from 'react';

const BettingContext = createContext(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useBetting = () => {
  const context = useContext(BettingContext);
  if (!context) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
};

export const BettingProvider = ({ children, token }) => {
  // State
  const [meronBet, setMeronBet] = useState(0);
  const [walaBet, setWalaBet] = useState(0);
  const [isMeronOpen, setIsMeronOpen] = useState(true);
  const [isWalaOpen, setIsWalaOpen] = useState(true);
  const [fightNumber, setFightNumber] = useState(0);
  const [fightStatus, setFightStatus] = useState('WAITING');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventName, setEventName] = useState('');
  const [currentFightId, setCurrentFightId] = useState(null);
  const [prevFightWinner, setPrevFightWinner] = useState(null);
  const [winnerDeclaration, setWinnerDeclaration] = useState(null);

  const socketRef = useRef(null);
  const currentFightIdRef = useRef(null);

  useEffect(() => {
    currentFightIdRef.current = currentFightId;
  }, [currentFightId]);

  // Computed values
  const totalPool = useMemo(() => meronBet + walaBet, [meronBet, walaBet]);

  const meronPayout = useMemo(
    () => calculatePayout(meronBet, totalPool),
    [meronBet, totalPool],
  );

  const walaPayout = useMemo(
    () => calculatePayout(walaBet, totalPool),
    [walaBet, totalPool],
  );

  // API Functions
  const fetchActiveEvent = async () => {
    const response = await fetch('/api/guests/event/active');
    if (!response.ok) {
      throw new Error('Failed to fetch active event');
    }
    const data = await response.json();
    setEventName(data.eventName);
    return data;
  };

  const fetchCurrentFight = async (eventId) => {
    try {
      const response = await fetch(`/api/guests/current/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch current fight');
      }
      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      console.log(data, 'fightData');

      setFightNumber(data.fightNumber || 0);
      setMeronBet(parseFloat(data.meron) || 0);
      setWalaBet(parseFloat(data.wala) || 0);
      setFightStatus(data.status.toUpperCase() || 'WAITING');
      setCurrentFightId(data._id || null);
      setIsMeronOpen(data.status !== 'closed');
      setIsWalaOpen(data.status !== 'closed');

      // Fetch partial state for this fight
      if (data.fightNumber) {
        await fetchPartialState(data.fightNumber);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    if (!currentFightId) {
      alert('No active fight selected.');
      return;
    }

    try {
      const response = await fetch(`/api/fights/${currentFightId}/status`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status.toLowerCase() }),
      });

      if (response.ok) {
        setFightStatus(status.toUpperCase());
        setIsMeronOpen(status.toLowerCase() !== 'closed');
        setIsWalaOpen(status.toLowerCase() !== 'closed');
      } else {
        alert('Failed to update status: ' + (await response.text()));
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const updatePartialState = async (side, isClosed) => {
    try {
      console.log('clicked');

      const response = await fetch('/api/fights/partial-state', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          side: side.toUpperCase(),
          isClosed,
          fightNo: fightNumber,
        }),
      });

      if (response.ok) {
        if (side.toUpperCase() === 'MERON') {
          setIsMeronOpen(!isClosed);
        } else if (side.toUpperCase() === 'WALA') {
          setIsWalaOpen(!isClosed);
        }
      } else {
        alert('Failed to update partial state: ' + (await response.text()));
      }
    } catch (err) {
      alert('Error updating partial state: ' + err.message);
    }
  };

  const declareWinner = async (winner) => {
    if (!currentFightId) {
      alert('No active fight selected.');
      return;
    }

    const winnerLower = winner.toLowerCase();
    const validWinners = ['meron', 'wala', 'draw', 'cancelled'];
    if (!validWinners.includes(winnerLower)) {
      alert(`Invalid winner: ${winner}.`);
      return;
    }
    const status = winnerLower === 'cancelled' ? 'cancelled' : 'completed';

    try {
      const response = await fetch('/api/fights/declare-winner', {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fightId: currentFightId,
          winner: winnerLower,
          status,
        }),
      });

      if (!response.ok) {
        alert('Failed to declare winner: ' + (await response.text()));
        return null;
      }

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      const nextFight =
        data?.nextFight ||
        data?.fight ||
        data?.currentFight ||
        data?.data?.nextFight ||
        null;

      if (nextFight) {
        const nextStatus = (nextFight.status || 'WAITING').toUpperCase();
        setFightNumber(nextFight.fightNumber || 0);
        setMeronBet(parseFloat(nextFight.meron) || 0);
        setWalaBet(parseFloat(nextFight.wala) || 0);
        setFightStatus(nextStatus);
        setCurrentFightId(nextFight._id || null);
        setIsMeronOpen(nextFight.status !== 'closed');
        setIsWalaOpen(nextFight.status !== 'closed');
      }

      setWinnerDeclaration({
        winner: winner.toUpperCase(),
        totalAmount: data?.totalAmount ?? data?.totals?.amount ?? null,
        winnerAmount: data?.winnerAmount ?? data?.totals?.winnerAmount ?? null,
        winnerPercentage:
          data?.winnerPercentage ?? data?.totals?.winnerPercentage ?? null,
        resultsTrend:
          data?.resultsTrend ||
          data?.betTrends ||
          data?.formattedResults ||
          data?.recentResults ||
          [],
        nextFight,
      });

      return data;
    } catch (err) {
      alert('Error declaring winner: ' + err.message);
      return null;
    }
  };

  const fetchPartialState = async (fightNo) => {
    try {
      const response = await fetch(`/api/fights/partial-state/${fightNo}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
        setIsMeronOpen(!data.meron);
        setIsWalaOpen(!data.wala);
      }
    } catch (err) {
      console.error('Error fetching partial state:', err);
    }
  };

  // Socket event handlers
  const handleBetAdded = (bet) => {
    console.log('New bet received:', bet);
    if (bet.fightId !== currentFightIdRef.current) {
      return;
    }

    const nextMeron = Number.parseFloat(bet.meron);
    const nextWala = Number.parseFloat(bet.wala);

    if (Number.isFinite(nextMeron) && Number.isFinite(nextWala)) {
      setMeronBet(nextMeron);
      setWalaBet(nextWala);
      return;
    }

    const betAmount = Number.parseFloat(bet.amount) || 0;
    const betSide = (bet.betSide || '').toLowerCase();

    if (betSide === 'meron') {
      setMeronBet((prev) => prev + betAmount);
    } else if (betSide === 'wala') {
      setWalaBet((prev) => prev + betAmount);
    }
  };

  const handleFightUpdate = (data) => {
    console.log('Fight update:', data);
    const { meron, wala, _id, status, fightNumber, previousFightWinner } = data;
    setMeronBet(parseFloat(meron));
    setWalaBet(parseFloat(wala));
    setFightStatus(status.toUpperCase() || 'WAITING');
    setCurrentFightId(_id);
    setFightNumber(fightNumber);
    setIsMeronOpen(status !== 'closed');
    setIsWalaOpen(status !== 'closed');

    if (previousFightWinner && status === 'waiting') {
      setPrevFightWinner(previousFightWinner);
    }
  };

  const handlePartialStateUpdate = (data) => {
    console.log('Partial state update:', data);
    const { fightNo, side, isClosed } = data;
    if (fightNo === fightNumber) {
      if (side === 'MERON') {
        setIsMeronOpen(!isClosed);
      } else if (side === 'WALA') {
        setIsWalaOpen(!isClosed);
      }
    }
  };

  // Initialize socket and data
  useEffect(() => {
    socketRef.current = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
      reconnection: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    socketRef.current.on('bet_added', handleBetAdded);
    socketRef.current.on('fight_update', handleFightUpdate);
    socketRef.current.on('partial_state_update', handlePartialStateUpdate);

    const initializeData = async () => {
      try {
        const event = await fetchActiveEvent();
        if (event && event._id) {
          await fetchCurrentFight(event._id);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    initializeData();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    // State
    meronBet,
    walaBet,
    isMeronOpen,
    isWalaOpen,
    fightNumber,
    fightStatus,
    loading,
    error,
    eventName,
    currentFightId,
    prevFightWinner,
    totalPool,
    meronPayout,
    walaPayout,
    // Actions
    setIsMeronOpen,
    setIsWalaOpen,
    updateStatus,
    updatePartialState,
    declareWinner,
    winnerDeclaration,
    setWinnerDeclaration,
  };

  return (
    <BettingContext.Provider value={value}>{children}</BettingContext.Provider>
  );
};
