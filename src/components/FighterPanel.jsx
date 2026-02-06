import React from 'react';

const FighterPanel = ({ side, isOpen, onToggle, bet, payout, panelStyle }) => (
  <section
    className={`min-h-[680px] text-center p-7 text-white relative ${panelStyle}`}
  >
    <button
      className={`z-50 absolute top-4 left-1/2 transform -translate-x-1/2 border-none rounded-full px-6 py-3 inline-flex gap-2.5 items-center text-white font-extrabold text-lg tracking-wide cursor-pointer z-6 ${
        isOpen ? 'bg-green-600 bg-opacity-95' : 'bg-gray-800 bg-opacity-78'
      }`}
      onClick={onToggle}
      aria-label={`${isOpen ? 'Close' : 'Open'} ${side} betting`}
    >
      <span className='leading-none'>{isOpen ? '🔓' : '🔒'}</span>
      <span>{isOpen ? 'OPEN' : 'CLOSED'}</span>
    </button>

    {!isOpen && (
      <div className='absolute inset-0 bg-black bg-opacity-70 flex justify-center items-center text-xl font-extrabold tracking-wide shadow-md'>
        BETTING CLOSED
      </div>
    )}

    <h1 className='mt-24 mb-8 text-[4.8rem] font-black tracking-[2px] shadow-md'>
      {side}
    </h1>
    <p className='mb-3 text-2xl font-bold'>BET:</p>
    <p className='mb-7 text-[5.2rem] font-black shadow-md'>{bet}</p>
    <p className='mb-3 text-2xl font-bold'>PAYOUT:</p>
    <p className='text-5xl font-black opacity-80 shadow-md'>{payout}%</p>
  </section>
);

export default FighterPanel;
