import React, { useState, useEffect } from"react";
import { FiShield, FiTruck, FiRefreshCw, FiX } from"react-icons/fi";
import { FaStar } from"react-icons/fa";
import { BadgePercent } from"lucide-react";
import { useProductController } from'../../Controllers/Product/useProductController'; // Adjust path
import toast from"react-hot-toast";
import ImageViewer from'../../Modals/ImageViewer';

const AddToCart = ({ onClose, productId }) => {
 const {
 product,
 isLoading,
 selectedColor,
 selectedSize,
 setSelectedSize,
 qty,
 setQty,
 isAdding,
 currentVariant,
 currentSizeData,
 handleColorClick,
 handleAddToCart,
 addStatus,
 availableToAdd
 } = useProductController(productId);

 const averageRating = product?.reviews?.reduce((sum, review) => sum + review.rating, 0) / (product?.reviews?.length || 1);

 // Local state for image tracking & fullscreen view
 const [activeMobileIdx, setActiveMobileIdx] = useState(0);
 const [imageViewerOpen, setImageViewerOpen] = useState(false);

 useEffect(() => {
 if (addStatus) {
 onClose();
 }
 }, [addStatus, onClose]);

 if (isLoading || !product || !currentVariant) {
 return (
 <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-[200] font-black text-[10px] uppercase tracking-[0.2em] text-stone-500">
 Loading Component Core...
 </div>
 );
 }

 const handleQuantityInc = () => {
 const MAX_PER_VARIANT = 10;
 if (qty >= MAX_PER_VARIANT) {
 toast('Maximum structural quantity logged', { icon:'⚠️' });
 return;
 }

 if (availableToAdd <= 0) {
 toast('Selection thresholds reached maximum depth', { icon:'⚠️' });
 return;
 }

 if (qty + 1 > availableToAdd) {
 toast(`Only ${availableToAdd} allocations remaining`, { icon:'ℹ️' });
 setQty(availableToAdd);
 return;
 }

 setQty(Math.min(availableToAdd, qty + 1));
 };
 
 const displayImages = currentVariant.images || [];

 return (
 <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sj p-0 sm:p-6 no-scrollbar animate-in fade-in duration-200">
 
 {/* Fullscreen Image Viewer Modal Overlay */}
 {imageViewerOpen && (
 <ImageViewer 
 images={currentVariant.images}
 initialIndex={activeMobileIdx}
 onClose={() => setImageViewerOpen(false)}
 />
 )}

 {/* Backdrop Click Dismiss */}
 <div className="absolute inset-0" onClick={() => onClose()} />

 {/* --- MAIN MODAL CONTAINER --- */}
 <div className="relative w-full sm:max-w-5xl bg-white text-stone-900 rounded-t-2xl sm:rounded-xl border-t sm:border border-stone-200 max-h-[90vh] sm:max-h-[85vh] lg:max-h-[90vh] overflow-y-auto overflow-x-hidden no-scrollbar shadow-2xl z-10 selection:bg-stone-900 selection:text-white">

 {/* Mobile Swipe / Drag Indicator Visual */}
 <div className="w-12 h-1 bg-stone-200 rounded-full mx-auto my-3 sm:hidden block sticky top-0 z-50" />

 {/* --- DUAL INTERFACE CLOSING SELECTORS --- */}
 {/* Desktop Close Button */}
 <button 
 onClick={() => onClose()}
 className="absolute top-6 right-6 p-2 text-stone-400 hover:text-stone-900 transition-colors z-50 rounded-lg border border-stone-100 hover:border-stone-200 bg-stone-50/50 sm:block hidden"
 >
 <FiX size={15} />
 </button>

 {/* Mobile Dedicated Close Floating Button */}
 <button 
 onClick={() => onClose()}
 className="absolute top-4 right-4 p-2.5 text-stone-500 hover:text-stone-900 transition-colors z-50 rounded-full bg-stone-100 sm:hidden block border border-stone-200/40 active:scale-95"
 >
 <FiX size={16} />
 </button>

 <div className="flex flex-col lg:flex-row p-5 sm:p-8 lg:p-10 gap-6 lg:gap-12 h-full">
 
 {/* --- LEFT SIDE: IMAGE LAYOUT MATRIX --- */}
 <div className="w-full lg:flex-1">
 {/* Mobile Touch Carousel */}
 <div className="lg:hidden relative aspect-[3/4] rounded-xl overflow-hidden bg-stone-50 border border-stone-100 cursor-zoom-in">
 <div 
 className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
 onScroll={(e) => {
 const width = e.currentTarget.offsetWidth;
 const scrollLeft = e.currentTarget.scrollLeft;
 const newIndex = Math.round(scrollLeft / width);
 if (newIndex !== activeMobileIdx) {
 setActiveMobileIdx(newIndex);
 }
 }}
 onClick={() => setImageViewerOpen(true)}
 >
 {displayImages.map((img, i) => (
 <img 
 key={i} 
 src={img} 
 className="w-full h-full object-cover flex-shrink-0 snap-center" 
 alt="" 
 />
 ))}
 </div>

 {/* Minimal Line Indicators */}
 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
 {displayImages.map((_, i) => (
 <div 
 key={i} 
 className={`h-[2px] transition-all duration-300 ${
 i === activeMobileIdx ?"w-6 bg-stone-900" :"w-1.5 bg-stone-300/70"
 }`} 
 />
 ))}
 </div>
 </div>

 {/* Premium Desktop Grid Layout */}
 <div className="hidden lg:grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar">
 {displayImages.slice(0, 4).map((img, i) => (
 <div 
 key={i} 
 onClick={() => {
 setActiveMobileIdx(i);
 setImageViewerOpen(true);
 }}
 className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-50 border border-stone-100 cursor-zoom-in group"
 >
 <img 
 src={img} 
 className="w-full h-full object-cover opacity-95 group-hover:scale-[1.02] group-hover:opacity-100 transition-all duration-500" 
 alt="" 
 />
 </div>
 ))}
 </div>
 </div>

 {/* --- RIGHT SIDE: COMPACT INFORMATION SHEET --- */}
 <div className="w-full lg:w-[420px] flex flex-col justify-between pb-24 sm:pb-0 space-y-6">
 
 {/* Meta Descriptions Block */}
 <div className="flex flex-col gap-4">
 <div className="space-y-1.5 pr-8 sm:pr-0">
 <div className="flex items-center gap-2.5">
 <span className="text-[9px] tracking-[0.2em] font-black uppercase text-stone-400">
 {product.categoryInfo?.name}
 </span>
 {averageRating > 0 && (
 <div className="flex items-center gap-1 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200/60">
 <FaStar className="text-stone-800 text-[9px]" />
 <span className="text-[10px] font-bold text-stone-800 tracking-wide">{averageRating.toFixed(1)}</span>
 </div>
 )}
 </div>
 <h1 className="text-sm sm:text-base font-black uppercase tracking-wide text-stone-900 leading-tight">
 {product.name}
 </h1>
 </div>

 <p className="text-stone-500 text-xs font-medium leading-relaxed line-clamp-3 sm:line-clamp-4">
 {product.description}
 </p>

 {/* Pricing Blocks Row Integration */}
 <div className="flex flex-col gap-2 border-t border-b border-stone-100 py-3.5">
 <div className="flex items-center flex-wrap gap-2.5">
 <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900">
 ₹{Math.round(currentSizeData?.salePrice || product.salePrice).toLocaleString('en-IN')}
 </span>
 <span className="text-stone-400 line-through text-xs font-medium font-mono">
 ₹{(currentSizeData?.price || product.price)?.toLocaleString('en-IN')}
 </span>
 {product.discountDisplay && (
 <span className="font-extrabold text-[9px] text-rose-600 bg-rose-50 border border-rose-200/50 px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm animate-pulse">
 {product.discountDisplay} OFF
 </span>
 )}
 </div>

 {product.salePrice && (
 <div className="inline-flex items-center gap-1.5 rounded bg-stone-50 px-2 py-1 text-[9px] font-bold text-stone-500 w-fit border border-stone-100 uppercase tracking-widest">
 <BadgePercent size={11} className="text-stone-400" />
 <span className="font-bold text-green-500">Best Index Matrix: ₹{product.salePrice}</span>
 </div>
 )}
 </div>

 {/* Variants Selector Tracks */}
 <div className="flex flex-col gap-2">
 <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">
 Active Variant: <span className="text-stone-800 tracking-wide font-black">{selectedColor}</span>
 </span>
 <div className="flex flex-wrap gap-1.5">
 {product.variants?.map((v) => (
 <button
 key={v.id}
 onClick={() => handleColorClick(v)}
 className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border ${
 currentVariant.id === v.id 
 ?"border-stone-900 text-white bg-stone-900 shadow-sm" 
 :"border-stone-200 text-stone-500 bg-transparent hover:border-stone-400 hover:text-stone-900"
 }`}
 >
 {v.color}
 </button>
 ))}
 </div>
 </div>

 {/* Sizing Array Tracks */}
 <div className="flex flex-col gap-2">
 <span className="text-[10px] font-black tracking-widest text-stone-400 uppercase">Select Size Metric</span>
 <div className="flex gap-1.5 flex-wrap">
 {currentVariant.sizes.map((s) => (
 <button
 key={s.size}
 onClick={() => setSelectedSize(s.size)}
 disabled={s.stock === 0}
 className={`w-10 h-10 rounded-lg border text-[10px] font-mono font-bold transition-all duration-200 ${
 selectedSize === s.size 
 ?"border-stone-900 bg-stone-900 text-white shadow-sm" 
 : s.stock === 0 
 ?"opacity-25 border-stone-100 bg-stone-50 text-stone-400 cursor-not-allowed line-through" 
 :"border-stone-200 text-stone-600 bg-transparent hover:border-stone-900"
 }`}
 >
 {s.size}
 </button>
 ))}
 </div>
 </div>
 </div>

 {/* --- FIXATION FOOTER (Anchors precisely on mobile screens) --- */}
 <div className="fixed sm:relative bottom-0 left-0 right-0 sm:bottom-auto sm:left-auto sm:right-auto bg-white/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none p-4 sm:p-0 pb-safe border-t sm:border-t-0 border-stone-200/80 flex flex-col gap-4 z-40">
 <div className="flex gap-2.5">
 
 {/* Quantity adjustments structure block */}
 <div className="flex items-center rounded-lg bg-stone-50 border border-stone-200 p-0.5 shadow-inner">
 <button 
 onClick={() => setQty(Math.max(1, qty - 1))} 
 className="w-8 h-8 text-xs font-bold hover:bg-stone-200/50 rounded-md transition-colors flex items-center justify-center text-stone-400 hover:text-stone-900"
 >
 -
 </button>
 <span className="w-7 text-center text-[11px] font-mono font-bold text-stone-800">{qty}</span>
 <button 
 onClick={handleQuantityInc} 
 className="w-8 h-8 text-xs font-bold hover:bg-stone-200/50 rounded-md transition-colors flex items-center justify-center text-stone-400 hover:text-stone-900"
 >
 +
 </button>
 </div>

 {/* Primary Call To Action Submit */}
 <button 
 onClick={handleAddToCart}
 disabled={isAdding || currentSizeData?.stock === 0 || selectedSize === null}
 className={`w-full py-3 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center border ${
 selectedSize === null 
 ?'bg-stone-50 text-stone-400 cursor-not-allowed border-stone-200' 
 : isAdding 
 ?"bg-stone-800 text-white cursor-not-allowed animate-pulse border-transparent" 
 :"bg-stone-900 border-transparent text-white hover:opacity-90 active:scale-[0.985] shadow-md hover:shadow-lg"
 }`}
 >
 {isAdding ?"Synchronizing Bag..." :"Add to Bag"}
 </button>
 </div>

 {/* Layout Icons and Trust badging footprints */}
 <div className="grid grid-cols-3 gap-1 pt-3.5 border-t border-stone-100 sm:flex hidden justify-between items-center w-full">
 <div className="flex flex-col items-center text-center gap-1 flex-1">
 <FiTruck className="text-stone-400" size={12} />
 <span className="text-[8px] text-stone-400 font-black uppercase tracking-widest mt-0.5">Priority Transit</span>
 </div>
 <div className="flex flex-col items-center text-center gap-1 border-x border-stone-100 flex-1">
 <FiRefreshCw className="text-stone-400" size={11} />
 <span className="text-[8px] text-stone-400 font-black uppercase tracking-widest mt-0.5">7D Manifest</span>
 </div>
 <div className="flex flex-col items-center text-center gap-1 flex-1">
 <FiShield className="text-stone-400" size={11} />
 <span className="text-[8px] text-stone-400 font-black uppercase tracking-widest mt-0.5">Encrypted Pay</span>
 </div>
 </div>
 </div>

 </div>
 </div>
 </div>
 </div>
 );
};

export default AddToCart;