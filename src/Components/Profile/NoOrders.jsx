import React from'react';
import { ShoppingBag, Trash2 } from'lucide-react'; // Optional: icon library

const NoOrders = () => {
 return (
 <div className="flex flex-col items-center justify-start min-h-[60vh] px-4 text-center">
 {/* Animation Container */}
 <div className="relative mb-8">
 <div className="bg-gray-100 p-8 rounded-full">
 {/* Dustbin Icon with custom wobble animation */}
 <h1><Trash2 className='text-gray-400 animate-wobble' size={96}/></h1>
 </div>
 {/* Subtle shadow beneath the bin */}
 <div className="w-16 h-2 bg-gray-200 rounded-[100%] mx-auto mt-2 blur-sm animate-pulse"></div>
 </div>

 {/* Text Section */}
 <h2 className="text-2xl font-bold text-gray-800 mb-2">
 Your order bin is empty!
 </h2>
 <p className="text-gray-500 max-w-sm mb-8">
 Looks like you haven't placed any orders yet. Let's find something amazing to fill this up!
 </p>

 {/* Action Button */}
 <button 
 onClick={() => window.location.href ='/collections'}
 className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-emerald-200"
 >
 <ShoppingBag size={20} />
 Order Now
 </button>
 </div>
 );
};

export default NoOrders;