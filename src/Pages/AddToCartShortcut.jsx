import React, { useState, useEffect } from"react";
import { FiShield, FiTruck, FiRefreshCw, FiX } from"react-icons/fi";
import { FaStar } from"react-icons/fa";
import { useProductLogic } from'../hooks/useProductHook'; // Adjust path
import toast from"react-hot-toast";

const AddToCartShortcut = () => {
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
 navigate,
 addStatus,
 availableToAdd
 } = useProductLogic();

 const averageRating = product?.reviews?.reduce((sum, review) => sum + review.rating, 0) / (product?.reviews?.length || 1);
 const onClose = () => {
 navigate(-1);
 }

 // Local state for the UI carousel only
 const [activeMobileIdx, setActiveMobileIdx] = useState(0);

 useEffect(() => {
 if (addStatus) {
 onClose();
 }
 }, [addStatus, onClose]);

 if (isLoading || !product || !currentVariant) {
 return (
 <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-[200] font-black uppercase tracking-widest">
 Loading...
 </div>
 );
 }

 const handleQuantityInc = () => {
 const MAX_PER_VARIANT = 10;
 if (qty >= MAX_PER_VARIANT) {
 toast('You have added maximum quantity', { icon:'⚠️' });
 return;
 }

 if (availableToAdd <= 0) {
 toast('You have reached the maximum allowed for this selection', { icon:'⚠️' });
 return;
 }

 if (qty + 1 > availableToAdd) {
 toast(`Only ${availableToAdd} left`, { icon:'ℹ️' });
 setQty(availableToAdd);
 return;
 }

 setQty(Math.min(availableToAdd, qty + 1));
 };
 
 const displayImages = currentVariant.images || [];

 return (
 /* Changed items-end to items-center globally */
 <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-[1px] no-scrollbar p-4 md:p-6">
 
 {/* Click outside to close */}
 <div className="absolute inset-0" onClick={() => onClose()} />

 {/* --- THE MAIN MODAL CONTAINER --- */}
 {/* Tweaked mobile width (w-[95%]), rounded values, and max-height limits */}
 <div className="relative w-[95%] lg:w-[90%] lg:max-w-6xl bg-surface 
 rounded-[2rem]
 max-h-[85vh] lg:max-h-[90vh] 
 overflow-y-auto overflow-x-hidden no-scrollbar
 border border-white/10 lg:border border-black/10
 shadow-[0_20px_50px_rgba(0,0,0,0.3)]
 selection:bg-[#00e5a0]">
 
 {/* Close Button Top Right */}
 <button 
 onClick={() => onClose()}
 className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-50"
 >
 <FiX className="text-lg" />
 </button>

 <div className="flex flex-col lg:flex-row p-6 lg:p-10 gap-8 lg:gap-16">
 
 {/* --- LEFT: IMAGES --- */}
 <div className="w-full lg:flex-1">
 {/* Mobile Carousel View */}
 <div className="lg:hidden relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111]">
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

 {/* Pagination Dots */}
 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 pointer-events-none">
 {displayImages.map((_, i) => (
 <div 
 key={i} 
 className={`h-1 rounded-full transition-all duration-300 ${
 i === activeMobileIdx ?"w-6 bg-[#00e5a0]" :"w-2 bg-white/20"
 }`} 
 />
 ))}
 </div>
 </div>

 {/* Desktop Grid View */}
 <div className="hidden lg:grid grid-cols-2 gap-4">
 {displayImages.slice(0, 4).map((img, i) => (
 <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] group">
 <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
 </div>
 ))}
 </div>
 </div>

 {/* --- RIGHT: PRODUCT INFO --- */}
 <div className="w-full lg:w-[420px] flex flex-col gap-6 lg:gap-8">
 <div className="flex flex-col gap-3">
 <div className="flex items-center gap-3">
 <span className="text-[10px] tracking-[4px] font-black uppercase italic">
 {product.categoryInfo?.name}
 </span>
 {averageRating > 0 && (
 <div className="flex items-center gap-1">
 <FaStar className="text-amber-400" />
 <span className="text-sm font-bold">{averageRating.toFixed(1)}</span>
 </div>
 )}
 </div>
 <h1 className="text-2xl lg:text-4xl font-black tracking-tighter uppercase leading-none italic">
 {product.name}
 </h1>
 <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>
 </div>

 <div className="flex items-baseline gap-4">
 <span className="text-3xl lg:text-4xl font-black">
 ₹{Math.round(currentSizeData?.salePrice || product.salePrice).toLocaleString('en-IN')}
 </span>
 <span className="text-gray-500 line-through text-md lg:text-lg">
 ₹{(currentSizeData?.price || product.price)?.toLocaleString('en-IN')}
 </span>
 {product.discountDisplay && (
 <span className="font-bold text-[10px] bg-[#00e5a0]/20 border border-[#00e5a0]/30 px-2 py-1 rounded uppercase italic tracking-widest">
 {product.discountDisplay} OFF
 </span>
 )}
 </div>

 {/* Color Selector */}
 <div className="flex flex-col gap-3">
 <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase italic">
 Variant: {selectedColor}
 </span>
 <div className="flex flex-wrap gap-2">
 {product.variants?.map((v) => (
 <button
 key={v.id}
 onClick={() => handleColorClick(v)}
 className={`px-4 py-2 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
 currentVariant.id === v.id 
 ?"border-[#00e5a0] text-[#00e5a0] bg-[#00e5a0]/5" 
 :"border-white/10 text-gray-400 hover:border-white/30"
 }`}
 >
 {v.color}
 </button>
 ))}
 </div>
 </div>

 {/* Size Selector */}
 <div className="flex flex-col gap-3">
 <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase italic">Select Size</span>
 <div className="flex gap-2 flex-wrap">
 {currentVariant.sizes.map((s) => (
 <button
 key={s.size}
 onClick={() => setSelectedSize(s.size)}
 disabled={s.stock === 0}
 className={`w-12 h-12 rounded-xl border-2 font-black transition-all text-xs ${
 selectedSize === s.size 
 ?"border-[#00e5a0] bg-[#00e5a0]/10 text-[#00e5a0]" 
 : s.stock === 0 ?"opacity-10 border-white/5 cursor-not-allowed italic" :"border-white/10 text-gray-400 hover:border-[#00e5a0]/50"
 }`}
 >
 {s.size}
 </button>
 ))}
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex gap-3 pt-2">
 <div className="flex items-center rounded-2xl px-4 border border-zinc-500">
 <button onClick={() => setQty(Math.max(1, qty-1))} className="w-8 text-xl font-bold">-</button>
 <span className="w-10 text-center font-black">{qty}</span>
 <button 
 onClick={() => handleQuantityInc()} 
 className="w-8 text-xl font-bold"
 >+</button>
 </div>
 <button 
 onClick={handleAddToCart}
 disabled={isAdding || currentSizeData?.stock === 0 || selectedSize === null}
 className={` ${selectedSize === null ?'opacity-50 cursor-not-allowed' :'opacity-100'} w-full py-4 lg:py-5 font-black text-sm tracking-[0.2em] rounded-2xl active:scale-[0.98] transition-all flex items-center justify-center ${
 isAdding ?"bg-gray-800 text-gray-400 cursor-not-allowed" :"bg-[#00e5a0] hover:shadow-[0_0_30px_rgba(0,229,160,0.3)]"
 }`}
 >
 {isAdding ?"ADDING TO BAG..." :"ADD TO BAG"}
 </button>
 </div>

 {/* Trust Badges */}
 <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-6 lg:pt-8">
 <div className="flex flex-col items-center text-center gap-2">
 <FiTruck className="text-[#00e5a0]" />
 <span className="text-[9px] text-gray-500 font-bold uppercase italic">Fast Ship</span>
 </div>
 <div className="flex flex-col items-center text-center gap-2 border-x border-white/10">
 <FiRefreshCw className="text-[#00e5a0]" />
 <span className="text-[9px] text-gray-500 font-bold uppercase italic">7D Return</span>
 </div>
 <div className="flex flex-col items-center text-center gap-2">
 <FiShield className="text-[#00e5a0]" />
 <span className="text-[9px] text-gray-500 font-bold uppercase italic">Safe Pay</span>
 </div>
 </div>

 </div>
 </div>
 </div>
 </div>
 );
};

export default AddToCartShortcut;