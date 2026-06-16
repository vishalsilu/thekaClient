import React, { useState, useEffect } from'react';

const ImageCarousel = ({ image }) => {
 
 const [currentIndex, setCurrentIndex] = useState(0);
 const [isHovered, setIsHovered] = useState(false);
 
 // In a real app,'image' would be an array of strings. 
 // Here we use the same image 3 times to simulate the loop.
 const slides = [image, image, image];

 useEffect(() => {
 let interval;
 if (isHovered) {
 interval = setInterval(() => {
 setCurrentIndex((prev) => (prev + 1) % slides.length);
 }, 2000); // Transitions every 1.2 seconds on hover
 } else {
 setCurrentIndex(0); // Reset to first image when mouse leaves
 }
 return () => clearInterval(interval);
 }, [isHovered, slides.length]);

 return (
 <div 
 className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100"
 onMouseEnter={() => setIsHovered(true)}
 onMouseLeave={() => setIsHovered(false)}
 >
 <div 
 className="flex h-full transition-transform duration-700 ease-in-out"
 style={{ transform: `translateX(-${currentIndex * 100}%)` }}
 >
 {slides.map((src, i) => (
 <img 
 key={i} 
 src={src} 
 className="w-full h-full object-cover flex-shrink-0" 
 alt={`Product view ${i + 1}`} 
 />
 ))}
 </div>

 {/* Slide Indicators */}
 {isHovered && (
 <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-30">
 {slides.map((_, i) => (
 <div 
 key={i}
 className={`h-1 rounded-full transition-all duration-300 ${
 currentIndex === i ?'w-4 bg-white' :'w-1 bg-white/50'
 }`}
 />
 ))}
 </div>
 )}
 </div>
 );
};

export default ImageCarousel;