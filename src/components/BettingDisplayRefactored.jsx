import React from 'react';
import { useBetting } from '../context/BettingContext';
import FighterPanel from './FighterPanel';
import FightInfo from './FightInfo';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import SplashScreen from './SplashScreen';
import { formatMoney } from '../utils/bettingUtils';

const BettingDisplay = ({ onLogout }) => {
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
  } = useBetting();

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <main className='min-h-screen flex flex-col gap-4 justify-center items-center bg-[#060714] p-6 relative'>
      <header className='text-white text-[2.1rem] font-black tracking-[2px] uppercase shadow-lg pb-16 relative'>
        {eventName || 'TALPAK CHAMPIONSHIP NIGHT'}
        <button
          onClick={onLogout}
          className='absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-bold text-sm'
        >
          LOGOUT
        </button>
      </header>

      <FightInfo
        fightNumber={fightNumber}
        fightStatus={fightStatus}
        updateStatus={updateStatus}
      />

      <div className='w-full max-w-[1024px] min-h-[680px] grid grid-cols-2 relative'>
        <FighterPanel
          side='MERON'
          isOpen={isMeronOpen}
          onToggle={() => updatePartialState('MERON', isMeronOpen)}
          bet={formatMoney(meronBet)}
          payout={meronPayout}
          panelStyle='bg-gradient-to-br from-red-500 via-red-600 to-red-700'
        />

        <FighterPanel
          side='WALA'
          isOpen={isWalaOpen}
          onToggle={() => updatePartialState('WALA', isWalaOpen)}
          bet={formatMoney(walaBet)}
          payout={walaPayout}
          panelStyle='bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
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

export default BettingDisplay;
