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
      className={`h-full w-full flex items-center justify-center px-4 ${getBackgroundColor()} fixed inset-0 z-10 pointer-events-none`}
    >
      <div className='text-center animate-pulse'>
        <h2 className='text-[clamp(2rem,7vw,4rem)] font-bold text-yellow-300 mb-2 md:mb-4'>
          {`FIGHT# ${fightNumber - 1}`}
        </h2>
        <div className='text-[clamp(3rem,10vw,6rem)] font-bold text-white'>
          {prevFightWinner.toUpperCase()}
        </div>
        <h2 className='text-[clamp(2rem,7vw,4rem)] font-bold text-yellow-300 mt-2 md:mt-4'>WINS</h2>
      </div>
    </div>
  );
};

export default SplashScreen;
