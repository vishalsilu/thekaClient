import React from'react';

const NavbarSkeleton = () => {
 return (
 <nav className="w-full bg-white border-b border-gray-200 px-4 py-3 animate-pulse">
 <div className="max-w-7xl mx-auto flex items-center justify-between">
 
 {/* 1. Left Side: Brand/Logo Placeholder */}
 <div className="flex items-center gap-3">
 {/* Logo Icon */}
 <div className="h-9 w-9 bg-gray-200 rounded-lg"></div>
 {/* Brand Name Text */}
 <div className="h-5 w-24 bg-gray-200 rounded-md hidden sm:block"></div>
 </div>

 {/* 2. Center: Search Bar or Nav Links Placeholder (Hidden on Mobile) */}
 <div className="hidden md:flex items-center gap-6 flex-1 max-w-md mx-8">
 {/* Mimicking a Search Input Box */}
 <div className="w-full h-9 bg-gray-200 rounded-full px-4 flex items-center">
 <div className="h-4 w-4 bg-gray-300 rounded-full mr-2"></div>
 <div className="h-3 w-24 bg-gray-300 rounded-md"></div>
 </div>
 </div>

 {/* 3. Right Side: Action Buttons & Profile Avatar */}
 <div className="flex items-center gap-4">
 {/* Utility Icon 1 (e.g., Notifications) */}
 <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
 
 {/* Utility Icon 2 (e.g., Settings) - Hidden on extra small screens */}
 <div className="h-8 w-8 bg-gray-200 rounded-full hidden xs:block"></div>
 
 {/* Divider Line */}
 <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

 {/* User Profile Avatar */}
 <div className="h-9 w-9 bg-gray-200 rounded-full ring-2 ring-gray-100"></div>
 </div>

 </div>
 </nav>
 );
};

export default NavbarSkeleton;