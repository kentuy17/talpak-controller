import React from 'react';

const SplashScreen = ({ prevFightWinner, fightNumber }) => {
  const getBackgroundColor = () => {
    const winner = prevFightWinner.toLowerCase();
    if (winner === 'meron') return 'bg-red-900 bg-opacity-95';
    if (winner === 'wala') return 'bg-blue-900 bg-opacity-95';
    return 'bg-gray-700 bg-opacity-95'; // For draw and cancelled
  };

  return (
    <div
      className={`h-[70%] w-full flex items-center justify-center ${getBackgroundColor()} fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50`}
    >
      <div className='text-center animate-pulse'>
        <h2 className='text-6xl font-bold text-yellow-300 mb-4'>
          {`FIGHT# ${fightNumber - 1}`}
        </h2>
        <div className='text-8xl font-bold text-white'>
          {prevFightWinner.toUpperCase()}
        </div>
        <h2 className='text-6xl font-bold text-yellow-300 mt-4'>WINS</h2>
      </div>
    </div>
  );
};

export default SplashScreen;
