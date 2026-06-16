import React, { use } from'react';
import { AboutHero, HeroImgMobile } from'../assets';
import { useSelector } from'react-redux';
import { useTextFavicon } from'../Utils/useTextFavicon';

const About = () => {
 const data = useSelector((state) => state.siteData.data);
 const about = data?.about

 useTextFavicon("AU", `ABOUT US - ${data?.websiteName.toUpperCase() }` , {
 bgColor:"#10b981", // Dark aesthetic variant
 textColor:"#ffffff"
 });
 
 return (
 <div className='w-full min-h-screen selection:bg-black selection:text-white'>
 
 {/* 1. HERO HEADER - Editorial Style */}
 <header className="w-full pt-8 pb-8">
 <div className="w-full md:w-[75%] mx-auto px-6">
 <h1 className="text-[12vw] md:text-[8vw] font-bold uppercase leading-[0.8] tracking-tighter mb-8">
 The Story
 </h1>
 <div className="w-full h-full overflow-hidden bg-gray-100">
 <img 
 src={`${about?.heroImage}`} 
 alt={about?.visionHeading}
 className="w-full h-1/2 object-cover"
 />
 </div>
 </div>
 </header>

 {/* 2. THE VISION - Two Column Detail */}
 <section className="w-full py-5 border-t border-gray-100">
 <div className="w-full md:w-[75%] mx-auto px-6">
 <div className="flex flex-col md:flex-row gap-5 md:gap-24">
 <div className="md:w-1/3">
 <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">{about?.visionHeading}</h2>
 </div>
 <div className="md:w-2/3">
 <p className="text-2xl md:text-4xl font-medium leading-tight tracking-tight mb-5">
 {about?.visionStatement}
 </p>
 <div className="text-gray-500 text-sm md:text-base leading-relaxed space-y-6 max-w-xl">
 <p>
 {about?.visionDescription}
 </p>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* 3. CORE VALUES - The"Stitch" Grid (Plain & Professional) */}
 <section className="w-full py-8 border-2 border-gray-100">
 <div className="w-full md:w-[75%] mx-auto px-6">
 {about?.coreValues?.heading && (
 <h2 className="text-2xl font-bold uppercase tracking-[0.2em] md:tracking-[0.8em] mb-8 text-center">
 {about.coreValues.heading}
 </h2>
 )}
 <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-20">
 {about?.coreValues?.values?.map((item, i) => (
 <div key={i} className="flex flex-col">
 <img 
 src={item?.image} 
 alt={item?.alt || i} 
 className="w-full h-full object-cover"
 />
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* 4. FOUNDER SECTION - The Portrait Split */}
 <section className="w-full py-8 bg-surface border-t border-gray-100">
 <div className="w-full md:w-[75%] mx-auto px-6">
 <div className="flex flex-col md:flex-row gap-20 items-center">
 <div className="w-full md:w-1/2">
 <div className="aspect-[3/4] bg-gray-50 overflow-hidden">
 <img 
 src={about?.founder?.image} 
 alt={about?.founder?.name} 
 className="w-full h-full object-cover"
 />
 </div>
 </div>
 <div className="w-full md:w-1/2">
 <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-gray-400 mb-8 block">{data?.websiteName}{about?.founder?.establishmentTag}</span>
 <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8">{about?.founder?.name}</h2>
 <p className="text-lg md:text-xl leading-snug italic mb-10">"{about?.founder?.quote}"
 </p>
 <div className="flex flex-col gap-2">
 <div className="h-px w-12 bg-black"></div>
 <p className="text-[10px] font-bold uppercase tracking-widest">{about?.founder?.role} // {new Date().getFullYear()}</p>
 </div>
 </div>
 </div>
 </div>
 </section>

 </div>
 );
};

export default About;