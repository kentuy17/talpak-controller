
import React from 'react';

const FightInfo = ({ fightNumber, fightStatus, updateStatus }) => {
  return (
    <>
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
    </>
  );
};

export default FightInfo;
