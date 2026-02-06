import React from 'react';

const FightInfo = ({ fightNumber, fightStatus, updateStatus }) => {
  return (
    <div className='absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center'>
      <div className='pointer-events-auto bg-white rounded-2xl px-5 py-2 shadow-lg mb-4 text-center'>
        <div className='text-black text-sm font-bold mb-1'>FIGHT#</div>
        <div className='text-black text-4xl font-bold leading-none'>{fightNumber}</div>
      </div>

      <div className='pointer-events-auto flex flex-col gap-2 items-center'>
        <button
          onClick={() => updateStatus('WAITING')}
          className={`w-28 px-4 py-2 rounded-lg font-bold text-white text-sm ${
            fightStatus === 'WAITING' ? 'bg-orange-500' : 'bg-gray-700'
          }`}
        >
          WAITING
        </button>
        <button
          onClick={() => updateStatus('OPEN')}
          className={`w-28 px-4 py-2 rounded-lg font-bold text-white text-sm ${
            fightStatus === 'OPEN' ? 'bg-green-500' : 'bg-gray-700'
          }`}
        >
          OPEN
        </button>
        <button
          onClick={() => updateStatus('CLOSED')}
          className={`w-28 px-4 py-2 rounded-lg font-bold text-white text-sm ${
            fightStatus === 'CLOSED' ? 'bg-red-500' : 'bg-gray-700'
          }`}
        >
          CLOSED
        </button>
      </div>
    </div>
  );
};

export default FightInfo;
