import { useMemo, useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import SplashScreen from './SplashScreen';

const COMMISSION = 5;

const BettingDisplay = ({ token, onLogout }) => {
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
  const socketRef = useRef(null);

  const totalPool = meronBet + walaBet;
  const meronPayout = useMemo(
    () => calculatePayout(meronBet, totalPool),
    [meronBet, totalPool],
  );
  const walaPayout = useMemo(
    () => calculatePayout(walaBet, totalPool),
    [walaBet, totalPool],
  );

  const fetchActiveEvent = async () => {
    const response = await fetch('/api/guests/event/active');
    if (!response.ok) {
      throw new Error('Failed to fetch active event');
    }
    const data = await response.json();
    setEventName(data.eventName);
    return data;
  };

  const fetchCurrentFight = async (id) => {
    try {
      const response = await fetch('/api/guests/current/' + id);
      if (!response.ok) {
        throw new Error('Failed to fetch current fight');
      }
      const data = await response.json();
      console.log(data, 'fightData');

      setFightNumber(data.fightNumber || 0);
      setMeronBet(parseFloat(data.meron) || 0);
      setWalaBet(parseFloat(data.wala) || 0);
      setFightStatus(data.status.toUpperCase() || 'WAITING');
      setCurrentFightId(data._id || null);
      setIsMeronOpen(data.status !== 'closed');
      setIsWalaOpen(data.status !== 'closed');
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: status.toLowerCase() }),
      });

      if (response.ok) {
        setFightStatus(status.toUpperCase());
        setIsMeronOpen(status.toLowerCase() !== 'closed');
        setIsWalaOpen(status.toLowerCase() !== 'closed');
      } else {
        alert('Failed to update status: ' + await response.text());
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

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

    socketRef.current.on('bet_added', (bet) => {
      console.log('New bet received:', bet);
      if (bet.fightId === currentFightId) {
        if (bet.betSide === 'meron') {
          setMeronBet((prev) => prev + parseInt(bet.amount));
        } else if (bet.betSide === 'wala') {
          setWalaBet((prev) => prev + parseInt(bet.amount));
        }
      }
    });

    socketRef.current.on('fight_update', (data) => {
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
    });

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
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060714]">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060714]">
        <div className="text-red-500 text-2xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col gap-4 justify-center items-center bg-[#060714] p-6 relative">
      <header className="text-white text-[2.1rem] font-black tracking-[2px] uppercase shadow-lg pb-16 relative">
        {eventName || 'TALPAK CHAMPIONSHIP NIGHT'}
        <button
          onClick={onLogout}
          className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold text-sm"
        >
          LOGOUT
        </button>
      </header>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-10 mt-20 bg-white rounded-b-2xl px-8 py-4 shadow-lg">
        <div className="text-black text-xl font-bold mb-1 text-center">FIGHT#</div>
        <div className="text-black text-6xl font-bold leading-none">{fightNumber}</div>
      </div>
      {/* Status Control Buttons */}
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => updateStatus('WAITING')}
          className={`px-6 py-3 rounded-lg font-bold text-white ${
            fightStatus === 'WAITING' ? 'bg-orange-500' : 'bg-gray-700'
          }`}
        >
          WAITING
        </button>
        <button
          onClick={() => updateStatus('OPEN')}
          className={`px-6 py-3 rounded-lg font-bold text-white ${
            fightStatus === 'OPEN' ? 'bg-green-500' : 'bg-gray-700'
          }`}
        >
          OPEN
        </button>
        <button
          onClick={() => updateStatus('CLOSED')}
          className={`px-6 py-3 rounded-lg font-bold text-white ${
            fightStatus === 'CLOSED' ? 'bg-red-500' : 'bg-gray-700'
          }`}
        >
          CLOSED
        </button>
      </div>
      <div className="w-full max-w-[1024px] min-h-[680px] grid grid-cols-2 relative">
        <FighterPanel
          side='MERONs'
          isOpen={isMeronOpen}
          onToggle={() => setIsMeronOpen((value) => !value)}
          bet={formatMoney(meronBet)}
          payout={meronPayout}
          panelStyle="bg-gradient-to-br from-red-500 via-red-600 to-red-700"
        />

        <FighterPanel
          side='WALA'
          isOpen={isWalaOpen}
          onToggle={() => setIsWalaOpen((value) => !value)}
          bet={formatMoney(walaBet)}
          payout={walaPayout}
          panelStyle="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700"
        />
      </div>
      {/* Splash Screen Overlay */}
      {prevFightWinner && fightStatus === 'WAITING' && (
        <SplashScreen
          prevFightWinner={prevFightWinner}
          fightNumber={fightNumber}
        />
      )}
    </main>
  );
};

const FighterPanel = ({ side, isOpen, onToggle, bet, payout, panelStyle }) => (
  <section className={`min-h-[680px] text-center p-7 text-white relative ${panelStyle}`}>
    <button
      className={`absolute top-4 left-1/2 transform -translate-x-1/2 border-none rounded-full px-6 py-3 inline-flex gap-2.5 items-center text-white font-extrabold text-lg tracking-wide cursor-pointer z-6 ${
        isOpen ? 'bg-green-600 bg-opacity-95' : 'bg-gray-800 bg-opacity-78'
      }`}
      onClick={onToggle}
      aria-label={`${isOpen ? 'Close' : 'Open'} ${side} betting`}
    >
      <span className="leading-none">{isOpen ? '🔓' : '🔒'}</span>
      <span>{isOpen ? 'OPEN' : 'CLOSED'}</span>
    </button>

    {!isOpen && <div className="absolute inset-0 bg-black bg-opacity-20 flex justify-center items-center text-xl font-extrabold tracking-wide shadow-md">BETTING CLOSED</div>}

    <h1 className="mt-24 mb-8 text-[4.8rem] font-black tracking-[2px] shadow-md">{side}</h1>
    <p className="mb-3 text-2xl font-bold">BET:</p>
    <p className="mb-7 text-[5.2rem] font-black shadow-md">{bet}</p>
    <p className="mb-3 text-2xl font-bold">PAYOUT:</p>
    <p className="text-5xl font-black opacity-80 shadow-md">{payout}%</p>
  </section>
);

const calculatePayout = (bet, total) => {
  if (bet == 0) return parseFloat(0).toFixed(2);
  const comm = (total) => (total * Number.parseFloat(COMMISSION)) / 100;
  const win = total - comm(total);
  return ((win / parseInt(bet)) * 100).toFixed(2);
};

const formatMoney = (amount) =>
  amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default BettingDisplay;
