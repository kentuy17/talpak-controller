import React from 'react';

const FighterPanel = ({
  side,
  isOpen,
  onToggle,
  onSetWinner,
  bet,
  payout,
  panelStyle,
}) => (
  <section
    className={`h-full text-center px-4 py-6 text-white relative flex flex-col items-center ${panelStyle}`}
  >
    <h1 className='mt-16 mb-4 text-[3.2rem] font-black tracking-[2px] shadow-md leading-none'>
      {side}
    </h1>

    <p className='mb-2 text-lg font-bold'>TOTAL BETS</p>
    <p className='mb-4 text-[2.6rem] font-black shadow-md leading-tight break-words'>
      {bet}
    </p>

    <p className='mb-2 text-lg font-bold'>PERCENTAGE</p>
    <p className='text-[2.5rem] font-black opacity-80 shadow-md leading-none'>
      {payout}%
    </p>

    <div className='mt-auto mb-4 flex flex-col gap-3 items-center'>
      <button
        className='border border-white/60 rounded-full px-6 py-2 inline-flex items-center text-white font-extrabold text-sm tracking-wide'
        onClick={onSetWinner}
      >
        SET WINNER
      </button>
      <button
        className={`border-none rounded-full px-5 py-2 inline-flex gap-2 items-center text-white font-extrabold text-base tracking-wide cursor-pointer ${
          isOpen ? 'bg-green-600 bg-opacity-95' : 'bg-gray-800 bg-opacity-80'
        }`}
        onClick={onToggle}
        aria-label={`${isOpen ? 'Close' : 'Open'} ${side} betting`}
      >
        <span className='leading-none'>{isOpen ? '🔓' : '🔒'}</span>
        <span>{isOpen ? 'OPEN' : 'CLOSED'}</span>
      </button>
    </div>

    {!isOpen && (
      <div className='absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center text-lg font-extrabold tracking-wide shadow-md'>
        BETTING CLOSED
      </div>
    )}
  </section>
);

export default FighterPanel;
