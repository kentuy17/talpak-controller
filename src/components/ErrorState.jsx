
import React from 'react';

const ErrorState = ({ error }) => (
  <div className="min-h-screen flex items-center justify-center bg-[#060714]">
    <div className="text-red-500 text-2xl">Error: {error}</div>
  </div>
);

export default ErrorState;
