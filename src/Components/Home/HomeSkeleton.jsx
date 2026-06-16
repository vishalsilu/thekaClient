import React, { useState, useEffect } from'react';

const HomeSkeleton = () => {
 const [statusMessage, setStatusMessage] = useState('Website is loading...');

 useEffect(() => {
 // 1. After 3 seconds, change to the second message
 const timer1 = setTimeout(() => {
 setStatusMessage('Please wait...');
 }, 3000);

 // 2. After 6 seconds, change to the final offline/network warning
 const timer2 = setTimeout(() => {
 setStatusMessage('Network taking too long?');
 }, 6000);

 // Cleanup timers if the component unmounts before they finish
 return () => {
 clearTimeout(timer1);
 clearTimeout(timer2);
 };
 }, []);

 return (
 <div className="relative min-h-screen bg-gray-50 p-4 md:p-8">
 
 {/* ================================================================
 CENTRAL STATUS MESSAGE (Sits on top of the blurred background)
 ================================================================
 */}
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
 <div className="bg-white/90 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-6 max-w-sm w-full text-center pointer-events-auto transition-all duration-500 transform scale-100">
 {/* Animated Spinner */}
 <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
 
 {/* Dynamic Status Text */}
 <p className="text-gray-700 font-medium text-lg animate-fade-in transition-all duration-300">
 {statusMessage}
 </p>
 </div>
 </div>

 {/* ================================================================
 BACKGROUND SKELETON (Blurred slightly to focus on the center message)
 ================================================================
 */}
 <div className="animate-pulse filter blur-[2px] select-none pointer-events-none">
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
 <div className="flex justify-between items-center pt-2 border-t border-gray-100">
 <div className="h-4 bg-gray-300 rounded-md w-16"></div>
 <div className="h-6 bg-gray-300 rounded-full w-12"></div>
 </div>
 </div>
 ))}
 </section>
 </div>

 </div>
 );
};

export default HomeSkeleton;