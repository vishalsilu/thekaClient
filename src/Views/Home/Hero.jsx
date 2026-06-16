import React from'react';
import { FaArrowRight } from'react-icons/fa';
import { useHeroController } from'../../Controllers/Home/useHeroController';

const Hero = ({ Data }) => {
 // Inject parsed word variables and abstract programmatic actions from controller
 const { 
 firstWord, 
 secondWord, 
 thirdWord, 
 handleNavigation 
 } = useHeroController({ Data });

 return (
 <div className="w-full relative overflow-hidden bg-black">
 
 {/* DESKTOP VIEW GRID FRAMEWORK */}
 <div className="hidden sm:block relative h-auto">
 <img 
 src={`${Data?.imageDesktop}`} 
 alt={Data?.title ||"Hero Banner Desktop"} 
 className="w-full h-full opacity-80" 
 />
 
 {/* TECHNICAL LAYER MATRIX OVERLAYS */}
 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
 <div 
 className="absolute inset-0 opacity-10" 
 style={{ 
 backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, 
 backgroundSize:'40px 40px' 
 }} 
 />

 {/* VIEW PORT CONTENT ACTION PANEL */}
 <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
 <div className="max-w-8xl">
 <div className="flex items-center gap-3 mb-4">
 <span className="w-12 h-[1px] bg-emerald-500" />
 </div>
 <h1 className="text-7xl lg:text-8xl font-black text-white uppercase italic tracking-tighter leading-[0.8] mb-6">
 {firstWord} <br /> 
 {/* Replaced <style> with inline arbitrary Tailwind utilities */}
 <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">{secondWord}</span>{''}<br/>
 {thirdWord && <span className="text-white [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">{thirdWord}</span>}
 </h1>
 <p className="text-gray-400 text-lg max-w-md leading-relaxed border-l border-emerald-500/30 pl-6">
 {Data?.subtitle}
 </p>
 </div>

 <button 
 onClick={handleNavigation}
 className="group relative px-12 py-6 bg-surface overflow-hidden rounded-full transition-all hover:pr-16"
 >
 <div className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
 <span className="relative z-10 flex items-center gap-3 font-black uppercase tracking-widest text-xs group-hover:text-white transition-colors">
 {Data?.ctaLabel ||"Explore Collection"} <FaArrowRight />
 </span>
 </button>
 </div>
 </div>

 {/* MOBILE VIEW PORT CONTAINER */}
 <div className="relative sm:hidden h-[90dvh]">
 <img 
 src={`${Data?.imageMobile}`} 
 alt={Data?.title ||"Hero Banner Mobile"} 
 className="w-full h-full object-cover opacity-90" 
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
 
 <div className="absolute bottom-10 left-0 right-0 px-6">
 <h1 className="text-5xl text-white font-black uppercase italic leading-none mb-6">
 {firstWord} <br /> 
 {/* Replaced <style> with inline arbitrary Tailwind utilities */}
 <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">{secondWord}</span>{''}<br/>
 {thirdWord &&  <span className="text-white [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">{thirdWord}</span>}
 </h1>
 <button 
 onClick={handleNavigation}
 className="text-white w-full py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full flex items-center justify-center gap-3 active:scale-95 transition-transform"
 >
 {Data?.ctaLabel ||"Explore Drops"} <FaArrowRight size={10} />
 </button>
 </div>
 </div>
 </div>
 );
};

export default Hero;