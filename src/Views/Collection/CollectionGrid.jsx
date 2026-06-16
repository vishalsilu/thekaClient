// views/CollectionGrid.jsx
import React from'react';
import { useNavigate } from'react-router-dom';

const CollectionGrid = ({ title, items }) => {
 const navigate = useNavigate();

 return (
 <div className="w-full text-zinc-900  antialiased">
 
 {/* Header Container */}
 <div className="pt-7 pb-2 flex flex-col items-center bg-white border-b border-zinc-200/80 px-4">
 <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-[0.2em] uppercase mb-4 text-center text-zinc-950 ">
 {title}
 </h1>
 <nav className="flex items-center gap-2 text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase">
 <span 
 className="cursor-pointer hover:text-black transition-colors" 
 onClick={() => navigate('/')}
 >
 Home
 </span>
 <span className="text-zinc-300 font-normal">/</span>
 <span className="text-zinc-900 font-black">{title}</span>
 </nav>
 </div>

 {/* Dynamic Categorization Media Grid Container */}
 <div className="max-w-screen-2xl mx-auto px-4 md:px-12 py-12 ">
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
 {items.map((item, index) => (
 <div 
 key={item?.id || item?._id || index} 
 className="group cursor-pointer flex flex-col"
 onClick={() => navigate(item.targetPath)}
 >
 {/* Media Wrapper Context */}
 <div className="w-full aspect-[3/4] overflow-hidden bg-zinc-100 rounded-2xl relative shadow-sm border border-zinc-200/50 mb-4">
 <img 
 src={item?.image} 
 alt={item?.name}
 loading="lazy"
 className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
 />
 
 {/* Visual interface layout overlay - default subtle dark layer */}
 <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

 {/* LARGE SCREEN ONLY HOVER UI */}
 <div className="hidden lg:flex absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 items-end justify-center pb-6">
 <span className="bg-white text-zinc-950 text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-md translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">
 Explore
 </span>
 </div>
 </div>
 
 {/* Categorization Text Strings */}
 <div className="px-1 flex flex-col">
 <h3 className="text-xs md:text-sm font-black uppercase tracking-widest text-zinc-900 group-hover:text-zinc-600 transition-colors line-clamp-1">
 {item?.name}
 </h3>
 {(item?.subtitle || item?.collectionName) && (
 <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider mt-1">
 {item.subtitle || item.collectionName}
 </span>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};

export default CollectionGrid;