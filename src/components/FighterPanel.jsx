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
    className={`h-full text-center px-2 sm:px-3 md:px-4 py-3 sm:py-4 md:py-6 text-white relative flex flex-col items-center min-h-0 ${panelStyle}`}
  >
    <h1 className='mt-10 sm:mt-12 md:mt-16 mb-2 md:mb-4 text-[clamp(2rem,8vw,3.2rem)] font-black tracking-[2px] shadow-md leading-none'>
      {side}
    </h1>

    <p className='mb-1 md:mb-2 text-sm sm:text-base md:text-lg font-bold'>TOTAL BETS</p>
    <p className='mb-2 md:mb-4 text-[clamp(1.9rem,7vw,2.6rem)] font-black shadow-md leading-tight break-words'>
      {bet}
    </p>

    <p className='mb-1 md:mb-2 text-sm sm:text-base md:text-lg font-bold'>PERCENTAGE</p>
    <p className='text-[clamp(1.8rem,6vw,2.5rem)] font-black opacity-80 shadow-md leading-none'>
      {payout}%
    </p>

    <div className='mt-auto mb-2 md:mb-4 flex flex-col gap-2 md:gap-3 items-center'>
      <button
        className='relative z-20 border border-white/60 rounded-full px-4 md:px-6 py-1.5 md:py-2 inline-flex items-center text-white font-extrabold text-xs md:text-sm tracking-wide'
        onClick={onSetWinner}
      >
        SET WINNER
      </button>
      <button
        className={`border-none rounded-full px-4 md:px-5 py-1.5 md:py-2 inline-flex gap-1.5 md:gap-2 items-center text-white font-extrabold text-sm md:text-base tracking-wide cursor-pointer ${
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
      <div className='absolute inset-0 z-10 bg-black bg-opacity-70 flex justify-center items-center text-sm md:text-lg font-extrabold tracking-wide shadow-md'>
        BETTING CLOSED
      </div>
    )}
  </section>
);

export default FighterPanel;
