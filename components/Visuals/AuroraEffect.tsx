import React from 'react';

const AuroraEffect = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60 md:opacity-75">
      <div
        className="absolute -top-1/3 -left-1/4 w-3/4 h-3/4 sm:w-1/2 sm:h-1/2 rounded-full 
                   bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 
                   filter blur-[70px] sm:blur-[100px] animate-aurora-float-1"
      />
      <div
        className="absolute -bottom-1/3 -right-1/4 w-3/4 h-3/4 sm:w-1/2 sm:h-1/2 rounded-full 
                   bg-gradient-to-tl from-blue-600 via-teal-500 to-green-500 
                   filter blur-[70px] sm:blur-[100px] animate-aurora-float-2"
      />
      <div
        className="absolute top-1/4 left-1/3 w-1/2 h-1/2 sm:w-1/3 sm:h-1/3 rounded-full 
                   bg-gradient-to-tr from-yellow-400 via-orange-500 to-pink-400 
                   filter blur-[60px] sm:blur-[90px] animate-aurora-float-3"
      />
    </div>
  );
};

export default AuroraEffect;