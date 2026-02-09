import React from 'react';

const FightInfo = ({
  fightNumber,
  fightStatus,
  onNextFight,
  updateStatus,
  onDeclareDraw,
  onDeclareCancel,
}) => {
  return (
    <div className='absolute inset-0 z-20 pointer-events-none flex flex-col items-center pt-1 md:pt-2 pb-4 md:pb-6'>
      <div className='pointer-events-auto bg-white rounded-2xl px-3 md:px-5 py-1.5 md:py-2 shadow-lg text-center'>
        <div className='text-black text-xs md:text-sm font-bold mb-1'>FIGHT#</div>
        <div className='text-black text-3xl md:text-4xl font-bold leading-none'>
          {fightNumber}
        </div>
      </div>

      <div className='pointer-events-auto flex flex-col gap-1.5 md:gap-2 items-center mt-auto'>
        <button
          onClick={onNextFight}
          className={`w-24 md:w-28 px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-white text-xs md:text-sm ${
            fightStatus === 'WAITING' ? 'bg-orange-500' : 'bg-gray-700'
          }`}
        >
          NEXT FIGHT
        </button>
        <button
          onClick={() => updateStatus('OPEN')}
          className={`w-24 md:w-28 px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-white text-xs md:text-sm ${
            fightStatus === 'OPEN' ? 'bg-green-500' : 'bg-gray-700'
          }`}
        >
          OPEN
        </button>
        <button
          onClick={() => updateStatus('CLOSED')}
          className={`w-24 md:w-28 px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-bold text-white text-xs md:text-sm ${
            fightStatus === 'CLOSED' ? 'bg-red-500' : 'bg-gray-700'
          }`}
        >
          CLOSE
        </button>
        <div className='flex gap-2 pt-1.5 md:pt-2'>
          <button
            onClick={onDeclareDraw}
            className='px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg font-bold text-white text-[11px] md:text-xs bg-slate-700'
          >
            DRAW
          </button>
          <button
            onClick={onDeclareCancel}
            className='px-2.5 md:px-3 py-1.5 md:py-2 rounded-lg font-bold text-white text-[11px] md:text-xs bg-slate-700'
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

export default FightInfo;
