import React, { useState, useRef } from'react';
import { TransformWrapper, TransformComponent } from'react-zoom-pan-pinch';
import { X, ChevronLeft, ChevronRight, Maximize2 } from'lucide-react';

const ImageViewer = ({ images = [], initialIndex = 0, onClose }) => {
 const [currentIndex, setCurrentIndex] = useState(initialIndex);
 const transformWrapperRef = useRef(null);

 // Clear previous zoom states completely when switching active image tracks
 const handleSelectImage = (index) => {
 if (transformWrapperRef.current) {
 transformWrapperRef.current.resetTransform();
 }
 setCurrentIndex(index);
 };

 const handleNext = (e) => {
 if (e) e.stopPropagation();
 if (currentIndex < images.length - 1) {
 handleSelectImage(currentIndex + 1);
 }
 };

 const handlePrev = (e) => {
 if (e) e.stopPropagation();
 if (currentIndex > 0) {
 handleSelectImage(currentIndex - 1);
 }
 };

 if (!images || images.length === 0) return null;

 const currentImageData = images[currentIndex];
 // Determine if metadata exists to show/hide the description block dynamically
 const hasMetadata = currentImageData?.title || currentImageData?.comment || currentImageData?.user;

 return (
 <div className="fixed inset-0 z-[200] flex flex-col bg-neutral-950/50 backdrop-blur-md font-inter select-none">

 {/* --- TOP CONTROL HEADER --- */}
 <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-[220] bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
 <div className="text-white/80 text-xs md:text-sm font-medium bg-neutral-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-auto shadow-sm">
 {currentIndex + 1} / {images.length}
 </div>
 
 <div className="flex items-center gap-3 pointer-events-auto">
 {/* Quick reset toggle visibility matching active magnification maps */}
 <button
 onClick={() => transformWrapperRef.current?.resetTransform()}
 className="p-2.5 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20 transition-all text-xs font-medium flex items-center gap-1.5 hidden md:flex"
 >
 <Maximize2 className="w-4 h-4" /> Reset Zoom
 </button>
 
 <button 
 onClick={onClose} 
 className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-red-600 hover:border-red-600 transition-all shadow-lg"
 >
 <X className="w-5 h-5 md:w-6 md:h-6" />
 </button>
 </div>
 </div>

 {/* --- MAIN CAROUSEL VIEWPORT CONTAINER --- */}
 <div className="flex-1 w-full relative flex items-center justify-center overflow-hidden touch-auto">
 
 {/* DESKTOP NAV: LEFT ARROW */}
 {currentIndex > 0 && (
 <button
 onClick={handlePrev}
 className="hidden md:flex absolute left-6 w-12 h-12 items-center justify-center rounded-full bg-black/40 text-white border border-white/10 hover:bg-black/70 hover:scale-105 transition z-[230]"
 >
 <ChevronLeft className="w-6 h-6" />
 </button>
 )}

 {/* PINCH-ZOOM VIEWPORT WINDOW */}
 <div className="w-full h-full flex items-center justify-center px-4 md:px-12">
 <TransformWrapper
 ref={transformWrapperRef}
 initialScale={1}
 minScale={1}
 maxScale={6}
 centerOnInit={true}
 doubleClick={{ mode:"toggle" }} 
 wheel={{ step: 0.12 }} 
 panning={{ velocityDisabled: false }} 
 >
 <TransformComponent wrapperClassName="!w-full !h-full !flex !items-center !justify-center">
 <img
 src={currentImageData?.img || currentImageData}
 alt={`Viewer item ${currentIndex}`}
 /* max-h-[70vh] guarantees no cropping across standard phone screens */
 className="max-w-full max-h-[70vh] md:max-h-[75vh] object-contain rounded-md pointer-events-none drop-shadow-[0_0_30px_rgba(0,0,0,0.6)] transition-transform duration-75 ease-out"
 />
 </TransformComponent>
 </TransformWrapper>
 </div>

 {/* DESKTOP NAV: RIGHT ARROW */}
 {currentIndex < images.length - 1 && (
 <button
 onClick={handleNext}
 className="hidden md:flex absolute right-6 w-12 h-12 items-center justify-center rounded-full bg-black/40 text-white border border-white/10 hover:bg-black/70 hover:scale-105 transition z-[230]"
 >
 <ChevronRight className="w-6 h-6" />
 </button>
 )}
 </div>

 {/* --- BOTTOM INTERACTION & METADATA SECTION --- */}
 <div className="w-full bg-gradient-to-t from-black via-black/80 to-transparent pt-4 pb-6 px-4 z-[220]">
 
 {/* THUMBNAILS HORIZONTAL SCROLL TRACK */}
 <div className="max-w-xl mx-auto flex items-center justify-center gap-2.5 overflow-x-auto py-2 px-1 no-scrollbar overflow-y-hidden">
 {images.map((image, index) => {
 const thumbSrc = image?.img || image;
 const isActive = index === currentIndex;

 return (
 <button
 key={index}
 onClick={() => handleSelectImage(index)}
 className={`relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200 border ${
 isActive 
 ?'border-white ring-1 ring-white scale-105 shadow-xl opacity-100' 
 :'border-transparent opacity-40 hover:opacity-80'
 }`}
 >
 <img 
 src={thumbSrc} 
 alt={`Thumbnail view index ${index}`} 
 className="w-full h-full object-cover" 
 loading="lazy"
 />
 </button>
 );
 })}
 </div>

 {/* DYNAMIC TEXT CARD: Mounts ONLY if valid data properties exist */}
 {hasMetadata && (
 <div className="max-w-2xl mx-auto mt-4 rounded-2xl border border-white/10 bg-neutral-900/60 backdrop-blur-md p-4 text-white">
 {currentImageData?.title && (
 <div className="font-semibold text-xs md:text-sm mb-1 uppercase tracking-wider text-stone-200">
 {currentImageData.title}
 </div>
 )}
 {currentImageData?.comment && (
 <p className="text-[11px] md:text-xs text-white/70 leading-relaxed">
 {currentImageData.comment}
 </p>
 )}
 {currentImageData?.user && (
 <p className="mt-2.5 text-[10px] text-white/40 font-medium">
 Uploaded by {currentImageData.user}
 {currentImageData?.date && ` • ${currentImageData.date}`}
 </p>
 )}
 </div>
 )}
 </div>

 </div>
 );
};

export default ImageViewer;