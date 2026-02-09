import React, { useMemo, useState } from 'react';
import { useBetting } from '../context/BettingContext';
import FighterPanel from './FighterPanel';
import FightInfo from './FightInfo';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import SplashScreen from './SplashScreen';
import { formatMoney } from '../utils/bettingUtils';
import { formatFightResultsGrid } from '../utils/fightResults';

const placeholderEvents = [
  {
    id: 'event-1',
    name: 'Talpak Championship Night',
    date: '2026-02-12',
    fights: [
      { fightNumber: 1, result: 'MERON' },
      { fightNumber: 2, result: 'MERON' },
      { fightNumber: 3, result: 'WALA' },
      { fightNumber: 4, result: 'WALA' },
      { fightNumber: 5, result: 'MERON' },
      { fightNumber: 6, result: 'MERON' },
      { fightNumber: 7, result: 'WALA' },
      { fightNumber: 8, result: 'MERON' },
    ],
  },
  {
    id: 'event-2',
    name: 'Saturday Pit Main Card',
    date: '2026-02-19',
    fights: [
      { fightNumber: 1, result: 'WALA' },
      { fightNumber: 2, result: 'MERON' },
      { fightNumber: 3, result: 'MERON' },
      { fightNumber: 4, result: 'MERON' },
      { fightNumber: 5, result: 'WALA' },
    ],
  },
];

const ProfilePage = () => (
  <section className='p-8 text-white'>
    <h2 className='text-2xl font-bold mb-4'>Profile</h2>
    <div className='bg-slate-900/80 rounded-xl p-6 max-w-xl'>
      <p className='mb-2'>Username: {localStorage.getItem('username') || 'Guest'}</p>
      <p className='mb-2'>Role: {localStorage.getItem('userRole') || 'Teller'}</p>
      <p>Teller No: {localStorage.getItem('tellerNo') || 'N/A'}</p>
    </div>
  </section>
);

const EventViewerPage = () => {
  const [selectedEventId, setSelectedEventId] = useState(placeholderEvents[0].id);
  const selectedEvent =
    placeholderEvents.find((event) => event.id === selectedEventId) ||
    placeholderEvents[0];

  const resultGrid = useMemo(
    () => formatFightResultsGrid(selectedEvent.fights.map((fight) => fight.result)),
    [selectedEvent],
  );

  return (
    <section className='p-8 text-white'>
      <h2 className='text-2xl font-bold mb-4'>Event Viewer</h2>
      <div className='flex gap-3 mb-4'>
        {placeholderEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => setSelectedEventId(event.id)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              selectedEventId === event.id ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            {event.name}
          </button>
        ))}
      </div>

      <div className='bg-slate-900/80 rounded-xl p-5 mb-4'>
        <p className='font-bold'>{selectedEvent.name}</p>
        <p className='text-sm text-slate-300'>Date: {selectedEvent.date}</p>
      </div>

      <div className='grid md:grid-cols-2 gap-4'>
        <div className='bg-slate-900/80 rounded-xl p-5'>
          <h3 className='font-bold mb-3'>Fights</h3>
          <ul className='space-y-1 text-sm'>
            {selectedEvent.fights.map((fight) => (
              <li key={`${selectedEvent.id}-${fight.fightNumber}`}>
                Fight {fight.fightNumber}: {fight.result}
              </li>
            ))}
          </ul>
        </div>
        <div className='bg-slate-900/80 rounded-xl p-5'>
          <h3 className='font-bold mb-3'>Formatted Results</h3>
          <div className='grid grid-rows-6 grid-flow-col auto-cols-[26px] gap-1 overflow-x-auto'>
            {resultGrid.map((entry) => (
              <div
                key={`${entry.column}-${entry.row}-${entry.fightIndex}`}
                className={`w-6 h-6 rounded-full border-2 ${
                  entry.result === 'MERON'
                    ? 'bg-red-500 border-red-200'
                    : 'bg-blue-500 border-blue-200'
                }`}
                style={{ gridColumn: entry.column + 1, gridRow: entry.row + 1 }}
                title={`Fight ${entry.fightIndex + 1} - ${entry.result}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const BettingDisplay = ({ onLogout }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');

  const {
    meronBet,
    walaBet,
    isMeronOpen,
    isWalaOpen,
    fightNumber,
    fightStatus,
    loading,
    error,
    eventName,
    meronPayout,
    walaPayout,
    prevFightWinner,
    updateStatus,
    updatePartialState,
    declareWinner,
  } = useBetting();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  const handleSetWinner = (winner) => {
    declareWinner(winner);
  };

  const isDashboard = activePage === 'dashboard';

  return (
    <main className='h-dvh overflow-hidden flex flex-col items-center bg-[#060714] pt-2 md:pt-3 pb-0 px-0 relative font-sans'>
      <header className='w-full text-center text-white text-[clamp(1.05rem,2.4vw,2rem)] font-black tracking-[1px] uppercase shadow-lg pb-1 px-2 relative leading-tight'>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className='absolute top-0 left-2 md:left-4 bg-slate-700 hover:bg-slate-600 text-white px-2 md:px-3 py-1.5 md:py-2 rounded font-bold text-xs md:text-sm'
        >
          ☰ MENU
        </button>
        {eventName || 'TALPAK CHAMPIONSHIP NIGHT'}
      </header>

      {isDashboard ? (
        <div className='w-full max-w-[1280px] flex-1 min-h-0 grid grid-cols-2 relative pt-2 md:pt-3'>
          <FighterPanel
            side='MERON'
            isOpen={isMeronOpen}
            onToggle={() => updatePartialState('MERON', isMeronOpen)}
            onSetWinner={() => handleSetWinner('MERON')}
            bet={formatMoney(meronBet)}
            payout={meronPayout}
            panelStyle='bg-gradient-to-br from-red-500 via-red-600 to-red-700'
          />

          <FighterPanel
            side='WALA'
            isOpen={isWalaOpen}
            onToggle={() => updatePartialState('WALA', isWalaOpen)}
            onSetWinner={() => handleSetWinner('WALA')}
            bet={formatMoney(walaBet)}
            payout={walaPayout}
            panelStyle='bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
          />

          <FightInfo
            fightNumber={fightNumber}
            fightStatus={fightStatus}
            updateStatus={updateStatus}
            onDeclareDraw={() => declareWinner('DRAW')}
            onDeclareCancel={() => declareWinner('CANCELLED')}
          />
        </div>
      ) : null}

      {activePage === 'profile' ? <ProfilePage /> : null}
      {activePage === 'event-viewer' ? <EventViewerPage /> : null}

      {/* Splash Screen Overlay */}
      {isDashboard && prevFightWinner && fightStatus === 'WAITING' && (
        <SplashScreen
          prevFightWinner={prevFightWinner}
          fightNumber={fightNumber}
        />
      )}

      {isDrawerOpen ? (
        <>
          <button
            className='absolute inset-0 bg-black/60 z-30'
            onClick={() => setIsDrawerOpen(false)}
            aria-label='Close navigation overlay'
          />
          <aside className='absolute left-0 top-0 bottom-0 w-72 bg-slate-900 border-r border-slate-700 z-40 p-5 text-white'>
            <h2 className='text-xl font-bold mb-4'>Navigation</h2>
            <div className='flex flex-col gap-2'>
              <button
                onClick={() => {
                  setActivePage('dashboard');
                  setIsDrawerOpen(false);
                }}
                className='text-left bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded'
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActivePage('profile');
                  setIsDrawerOpen(false);
                }}
                className='text-left bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded'
              >
                Profile
              </button>
              <button
                onClick={() => {
                  setActivePage('event-viewer');
                  setIsDrawerOpen(false);
                }}
                className='text-left bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded'
              >
                Event Viewer
              </button>
              <button
                onClick={onLogout}
                className='text-left bg-red-600 hover:bg-red-500 px-3 py-2 rounded mt-2'
              >
                LOGOUT
              </button>
            </div>
          </aside>
        </>
      ) : null}
    </main>
  );
};

export default BettingDisplay;
