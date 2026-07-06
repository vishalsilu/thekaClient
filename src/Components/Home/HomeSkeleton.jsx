import React, { useState, useEffect } from 'react';

const HomeSkeleton = () => {
  const TOTAL_TIME = 58;
  // Count down from 58 to 0
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          return 0; // Lock state at 0
        }
        return prevTime - 1; // Decrease by 1 second
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  // ==========================================
  // PROGRESS BAR & COLOR LOGIC
  // ==========================================
  
  // Calculate percentage to shrink the bar (100% down to 0%)
  const progressPercentage = (timeLeft / TOTAL_TIME) * 100;

  // Determine colors based on remaining time
  let barColor = 'bg-blue-500';
  let textColor = 'text-blue-600';
  
  if (timeLeft <= 10) {
    // Last 10 seconds: Green
    barColor = 'bg-green-500';
    textColor = 'text-green-600';
  } else if (timeLeft <= 30) {
    // Middle phase (30s to 11s): Yellow
    barColor = 'bg-yellow-400';
    textColor = 'text-yellow-600';
  }

  // ==========================================
  // PHASED MESSAGING LOGIC
  // ==========================================
  const getPhaseMessage = (time) => {
    if (time === 0) return 'Ready!';
    if (time <= 10) return 'Almost there, finalizing setup...';
    if (time <= 25) return 'Preparing your workspace...';
    if (time <= 45) return 'Establishing secure connections...';
    return 'Booting up the system...';
  };

  const isFinished = timeLeft === 0;

  return (
    <div className="relative min-h-screen bg-gray-50 p-4 md:p-8">
      
      {/* ================================================================
      CENTRAL STATUS MESSAGE 
      ================================================================ */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl p-6 max-w-sm w-full text-center pointer-events-auto transition-all duration-500">
          
          {/* Phased Status Text */}
          <h2 className="text-gray-800 font-semibold text-lg mb-5 transition-opacity duration-300">
            {getPhaseMessage(timeLeft)}
          </h2>
          
          {/* Dynamic Progress Bar */}
          <div className="w-full bg-gray-100 rounded-full h-3 mb-3 overflow-hidden shadow-inner">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ease-linear ${barColor}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          {/* Timer Message */}
          <p className={`font-medium text-sm transition-all duration-300 ${
            isFinished ? 'animate-pulse scale-105' : ''
          } ${textColor}`}>
            {isFinished ? 'Entering application...' : `Expected wait: ${timeLeft}s`}
          </p>

        </div>
      </div>

      {/* ================================================================
      BACKGROUND SKELETON 
      ================================================================ */}
      <div className="animate-pulse filter blur-[3px] opacity-70 select-none pointer-events-none transition-all duration-1000">
        
        {/* Navbar Skeleton */}
        <header className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-6 w-32 bg-gray-300 rounded-md"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-20 bg-gray-300 rounded-md hidden sm:block"></div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>
        </header>

        {/* Hero Banner Skeleton */}
        <section className="mb-12">
          <div className="w-full h-48 md:h-64 bg-gray-300 rounded-2xl mb-4"></div>
          <div className="h-6 bg-gray-300 rounded-md w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded-md w-1/2"></div>
        </section>

        {/* Content Grid Title */}
        <div className="h-7 bg-gray-300 rounded-md w-40 mb-6"></div>

        {/* Grid Cards Skeleton */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="w-full h-40 bg-gray-300 rounded-lg mb-4"></div>
              <div className="h-5 bg-gray-300 rounded-md w-5/6 mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-gray-300 rounded-md w-full"></div>
                <div className="h-3 bg-gray-300 rounded-md w-4/5"></div>
              </div>
            </div>
          ))}
        </section>
      </div>

    </div>
  );
};

export default HomeSkeleton;