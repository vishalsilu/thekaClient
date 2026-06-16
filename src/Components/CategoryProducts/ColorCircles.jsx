import React, { useState, useEffect } from'react';
import { useSelector } from'react-redux';

export const ColorCircles = ({data}) => {
 
 const [colors, setColors] = useState([]);
 const palette = ['#dc2626','#000000','#666666','#9333ea','#2563eb','#ea580c','#ca8a04'];


 useEffect(() => {
 // Picking two random colors to simulate variety
 const shuffled = [...palette].sort(() => 2 - Math.random());
 setColors([shuffled[0], shuffled[1]]);
 }, []);

 if (colors.length < 2) return null;

 return (
 data && data > 0 && <div className="absolute right-2 bottom-2 flex items-center justify-center bg-white/90 backdrop-blur-sm px-2 py-1.5 rounded-full z-30 shadow-sm border border-black/5 scale-90 md:scale-100">
 <div 
 style={{ backgroundColor:"black" }} 
 className={`w-4 h-4 rounded-full border-2 border-white z-20 shadow-sm `}
 ></div>
 {data > 1 && <div 
 style={{ backgroundColor:"pink" }} 
 className={`w-4 h-4 rounded-full border-2 border-white -ml-2 z-10 shadow-sm `}
 ></div>}
 <div className="text-black ml-1 text-[9px] font-black tracking-tighter">{data}</div>
 </div>
 );
};

export default ColorCircles;