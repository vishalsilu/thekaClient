import React, { useState } from'react';
import { FaHome, FaChevronRight, FaStar } from'react-icons/fa';
import { FiTruck, FiRefreshCw, FiPackage } from"react-icons/fi";
import { BadgePercent } from'lucide-react';
import { useProductController } from'../../Controllers/Product/useProductController';
import ImageViewer from'../../Modals/ImageViewer';
import toast from'react-hot-toast';

const ProductDetail = () => {
 const [activeMobileIdx, setActiveMobileIdx] = useState(0);
 const [imageViewerOpen, setImageViewerOpen] = useState(false);
 
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
 availableToAdd,
 handleColorClick,
 handleAddToCart,
 inBag,
 navigate,
 shippingTime
 } = useProductController();

 const averageRating = product?.reviews?.reduce((sum, review) => sum + review.rating, 0) / (product?.reviews?.length || 1);

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

 if (isLoading || !product || !currentVariant) {
 return (
 <div className="min-h-screen flex items-center justify-center font-bold text-xs uppercase tracking-widest text-stone-400 animate-pulse bg-stone-50">
 Loading architectural piece...
 </div>
 );
 }

 const handleImageClick = (index) => {
 setActiveMobileIdx(index);
 setImageViewerOpen(true);
 };

 const isDiscounted = product.salePrice !== product.price || currentSizeData?.price !== currentSizeData?.salePrice;

 return (
 <div className="min-h-screen bg-white text-stone-900 selection:bg-stone-900 selection:text-white pb-12 transition-colors duration-300">
 
 {imageViewerOpen && (
 <ImageViewer 
 images={currentVariant.images}
 initialIndex={activeMobileIdx}
 onClose={() => setImageViewerOpen(false)}
 />
 )}
 
 <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-6">
 
 <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-stone-400 mb-8 md:mb-12">
 <FaHome onClick={() => navigate('/')} className="cursor-pointer text-stone-600 hover:text-stone-950 transition-colors text-xs" />
 <FaChevronRight className="text-[6px]" />
 <span className="cursor-pointer hover:text-stone-950 transition-colors" onClick={() => navigate(`/collections/${product.collectionInfo?.name?.toLowerCase()}`)}>
 {product.collectionInfo?.name}
 </span>
 <FaChevronRight className="text-[6px]" />
 <span className="cursor-pointer hover:text-stone-950 transition-colors" onClick={() => navigate(`/collections/${product.collectionInfo?.name?.toLowerCase()}/${product?.categoryInfo?.name?.toLowerCase()}`)}>
 {product?.categoryInfo?.name}
 </span>
 <FaChevronRight className="text-[6px]" />
 <span className="text-black font-extrabold">{product.name}</span>
 </div>

 <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-14">
 
 <div className="lg:col-span-7">
 <div 
 className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-1.5 lg:grid lg:grid-cols-2 lg:overflow-visible lg:snap-none"
 onScroll={(e) => {
 if (window.innerWidth < 1024) {
 const width = e.currentTarget.offsetWidth;
 const scrollLeft = e.currentTarget.scrollLeft;
 const newIndex = Math.round(scrollLeft / width);
 if (newIndex !== activeMobileIdx) {
 setActiveMobileIdx(newIndex);
 }
 }
 }}
 >
 {currentVariant.images.map((img, i) => (
 <div 
 key={i} 
 className="min-w-full snap-center lg:min-w-0 relative aspect-[3/4] overflow-hidden border border-stone-100 rounded-xl lg:rounded-2xl bg-stone-50 cursor-zoom-in"
 >
 <img 
 src={img} 
 alt={product.name}
 onClick={() => handleImageClick(i)}
 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
 />
 
 {i === 0 && product.deal && (
 <span 
  className={`
    absolute top-4 left-4 z-10 
    px-2.5 py-1 rounded-md
    bg-stone-950/80 backdrop-blur-sm 
    ring-1 ring-inset ring-emerald-500/50 shadow-lg shadow-emerald-900/20
    text-emerald-400 text-[9px] font-black uppercase tracking-[0.15em]
  `}
>
  {product.deal}
</span>
 )}
 </div>
 ))}

 {currentVariant.images.length % 2 !== 0 && (
 <div className="hidden lg:flex aspect-[3/4] bg-stone-50/50 rounded-2xl border border-dashed border-stone-200 items-center justify-center" />
 )}
 </div>

 <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
 {currentVariant.images.map((_, i) => (
 <div 
 key={i} 
 className={`h-1 rounded-full transition-all duration-300 ${
 i === activeMobileIdx ?"w-6 bg-stone-900" :"w-1.5 bg-stone-200"
 }`} 
 />
 ))}
 </div>
 </div>

 <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8 sticky top-10 h-fit">
 
 <div className="flex flex-col gap-2.5">
 <div className="flex items-center justify-between">
 <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase">
 {product.fabric} &bull; {product.fit}
 </span>
 {averageRating > 0 && (
 <div className="flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded border border-stone-100">
 <FaStar className="text-amber-400 text-xs" />
 <span className="text-xs font-bold text-stone-700">{averageRating.toFixed(1)}</span>
 </div>
 )}
 </div>
 <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-stone-900">
 {product.name}
 </h1>
 <p className="text-stone-500 text-xs leading-relaxed max-w-xl">
 {product.description}
 </p>
 </div>

 <div className="flex flex-col gap-1.5">
 <div className="flex items-baseline gap-3">
 <span className="text-3xl font-black text-stone-900">
 ₹{Math.round(currentSizeData?.salePrice || product.salePrice).toLocaleString('en-IN')}
 </span>
 {isDiscounted && (
 <>
 <span className="text-stone-400 line-through text-base">
 ₹{(currentSizeData?.price || product.price)?.toLocaleString('en-IN')}
 </span>
 {product?.discountDisplay && (
 <span className="text-red-600 bg-red-50 border border-red-100 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
 {product.discountDisplay} OFF
 </span>
 )}
 </>
 )}
 </div>

 {product.salePrice && (
 <div className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-700 w-fit border border-emerald-100 mt-1">
 <BadgePercent className="h-3.5 w-3.5" />
 <span>BEST PRICE MATCH AVAILABLE</span>
 </div>
 )}
 </div>

 <hr className="border-stone-200" />

 <div className="flex flex-col gap-3">
 <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
 Variant: <span className="text-stone-800">{selectedColor}</span>
 </span>
 <div className="flex flex-wrap gap-3.5">
 {product.variants.map((v) => {
 const isSelected = selectedColor === v.color;
 return (
 <button
 key={v.id}
 onClick={() => handleColorClick(v)}
 className={`relative w-10 h-10 rounded-full transition-all flex items-center justify-center p-0.5 border ${
 isSelected 
 ?"border-stone-950 scale-105" 
 :"border-stone-200 hover:border-stone-400"
 }`}
 >
 <div 
 className="w-full h-full rounded-full bg-cover border border-black/5" 
 style={{ 
 backgroundColor: v.colorCode || v?.color?.toLowerCase(), 
 backgroundImage: `url(${v.images[0]})` 
 }}
 />
 </button>
 );
 })}
 </div>
 </div>

 <div className="flex flex-col gap-3">
 <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Select Size</span>
 <div className="flex flex-wrap gap-2">
 {currentVariant.sizes.map((s) => (
 <button
 key={s.size}
 disabled={s.stock === 0}
 onClick={() => setSelectedSize(s.size)}
 className={`min-w-[56px] h-11 rounded-xl border text-xs font-bold transition-all flex items-center justify-center ${
 selectedSize === s.size 
 ?"border-stone-900 bg-stone-950 text-white font-extrabold" 
 : s.stock === 0 
 ?"opacity-30 border-stone-100 bg-stone-50 text-stone-300 cursor-not-allowed line-through italic" 
 :"border-stone-200 text-stone-600 hover:border-stone-400 hover:text-stone-900"
 }`}
 >
 {s.size}
 </button>
 ))}
 </div>
 </div>

 <div className="flex flex-col gap-3 pt-2">
 {inBag > 0 && (
 <div className="text-xs text-stone-500 font-medium tracking-wide">
 Currently in bag: <span className="font-bold">{inBag}</span> | Selection limit max 10
 </div>
 )}
 
 <div className="flex gap-3 w-full">
 <div className="flex items-center rounded-xl bg-stone-50 border border-stone-200 p-1">
 <button 
 onClick={() => setQty(Math.max(1, qty - 1))} 
 className="w-9 h-9 rounded-lg text-sm font-bold hover:bg-stone-200/60 text-stone-600 flex items-center justify-center transition-colors"
 >
 -
 </button>
 <span className="w-8 text-center text-xs font-bold text-black">{qty}</span>
 <button 
 onClick={handleQuantityInc} 
 disabled={qty >= 10 || availableToAdd <= 0}
 className="w-9 h-9 rounded-lg text-sm font-bold hover:bg-stone-200/60 text-stone-600 flex items-center justify-center transition-colors disabled:opacity-30"
 >
 +
 </button>
 </div>

 <button 
 disabled={isAdding || currentSizeData?.stock === 0 || availableToAdd === 0}
 onClick={handleAddToCart}
 className={`flex-1 h-14 rounded-xl font-bold text-[10px] tracking-widest uppercase transition-all flex items-center justify-center gap-2 border ${
 currentSizeData?.stock === 0 
 ?"bg-stone-100 text-stone-400 border-transparent cursor-not-allowed" 
 : availableToAdd === 0 
 ?"bg-stone-100 text-stone-500 border-transparent cursor-not-allowed" 
 :"bg-stone-50 text-stone-900 border-stone-200 hover:bg-stone-950 hover:text-white hover:border-stone-950 active:scale-[0.99]"
 }`}
 >
 {currentSizeData?.stock === 0 
 ?"Out of Stock" 
 : availableToAdd === 0 
 ? (isAdding ?"Adding..." :"Max Added to Bag") 
 : isAdding 
 ?"Adding..." 
 :"Add to Bag"
 }
 </button>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div className="mt-12 py-10 border-t border-stone-100 bg-stone-50/50">
 <div className="max-w-[1300px] mx-auto px-4 md:px-8">
 <section className="mb-16">
 <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6">Technical Specifications</h3>
 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
 <SpecBox label="Fabric Content" value={product.fabric} />
 <SpecBox label="Silhouette" value={product.fit} />
 <SpecBox label="Pattern Type" value={product.pattern} />
 <SpecBox label="Product ID" value={product.id} />
 </div>
 </section>

 <div className="grid lg:grid-cols-3 gap-10 lg:gap-16 pt-10 border-t border-stone-200">
 <div className="lg:col-span-2">
 <h3 className="text-xl font-bold uppercase tracking-tight mb-4">About this piece</h3>
 <p className="text-sm leading-relaxed max-w-2xl">{product.description}</p>
 </div>
 <div className="flex flex-col gap-6">
 <PolicyItem icon={<FiPackage className="text-stone-600" size={18}/>} title="Express Shipping" desc={`Orders processed within 24 hours. Transit window: ${shippingTime}`} />
 <PolicyItem icon={<FiRefreshCw className="text-stone-600" size={18}/>} title="7-Day Return Guarantee" desc="Full refund or custom size exchange request options open for 7 days post delivery." />
 </div>
 </div>
 </div>
 </div>
 </div>
 );
};

const SpecBox = ({ label, value }) => (
 <div className="bg-white rounded-xl p-3 text-black border border-stone-200/60 shadow-sm transition-colors">
 <p className="text-[9px] font-bold uppercase mb-1 tracking-wider">{label}</p>
 <p className="text-xs font-bold uppercase">{value ||'Not Specified'}</p>
 </div>
);

const PolicyItem = ({ icon, title, desc }) => (
 <div className="flex gap-4 items-start">
 <div className="p-2 rounded-lg bg-stone-100 transition-colors">{icon}</div>
 <div>
 <p className="text-[11px] font-bold uppercase tracking-wider text-stone-800 mb-0.5">{title}</p>
 <p className="text-[11px] text-stone-500 leading-relaxed font-medium">{desc}</p>
 </div>
 </div>
);

export default ProductDetail;