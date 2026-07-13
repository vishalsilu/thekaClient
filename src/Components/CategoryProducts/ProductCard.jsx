import React, { useState } from'react';
import { BadgePercent, TrendingUp, ShoppingBag } from'lucide-react';
import ImageCarousel from'./ImageCarousel';
import { ColorCircles } from'./ColorCircles';
import AddToCart from'./AddToCart';
import { useDispatch } from'react-redux';
import { getSingleProduct } from'../../Redux/controllers/metaDataController';
import { useNavigate } from'react-router-dom';

const ProductCard = ({ item, type, host }) => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const [open, setOpen] = useState(false);

 // Fallback calculations for safety
 const price = Number(item?.price) || 0;
 const originalPrice = Number(item?.originalPrice || item?.price) || 0;
 const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

 const handleClick = (it) => {
 dispatch(getSingleProduct(it?.id || item?.id));
 const variantQuery = it?.variantId ? `?variant=${it.variantId}${it?.size ? `&size=${it.size}` :''}` :'';
 navigate(`/product/${type}/${it?.id || item?.id}${variantQuery}`);
 };


 console.log(item)

 return (
 <article className={`group relative flex w-full max-w-[360px] flex-col overflow-hidden rounded-2xl border border-stone-200 bg-surface p-2 transition-all duration-300 hover:border-stone-400 hover:shadow-md ${!item?.inStock ?'bg-stone-50/60' :''}`}>
 
 {open && <AddToCart productId={item?.id} item={item} onClose={() => setOpen(false)} />}

 {/* 1. Image & Overlay Badges */}
 <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-stone-50 cursor-pointer" onClick={() => handleClick(item)}>
 
{/* Host Type Badge - Premium Glass */}
{host && item?.type && (
  <div 
    className={`
      absolute top-3 ${item?.trending ? 'right-3' : 'left-3'} z-20 
      px-3 py-1 rounded-full 
      bg-white/10 backdrop-blur-md border border-white/20 
      shadow-lg shadow-black/30
      text-white text-[10px] font-bold uppercase tracking-[0.2em] 
      transition-all duration-300 hover:scale-105 hover:bg-white/20
    `}
  >
    {item.type}
  </div>
)}
 
 {/* Trending Badge */}
 {item?.trending && (
 <div className="absolute top-2 left-2 z-20 flex items-center rounded-lg bg-stone-900/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold tracking-wider text-white">
 <TrendingUp className="mr-1 h-3 w-3 text-amber-400" /> TRENDING
 </div>
 )}

 {/* Sponsored Badge */}
 {item?.isSponsored && (!item?.sponsorUntil || new Date(item.sponsorUntil) > new Date()) && (
	 <div className="absolute top-2 right-2 z-30 flex items-center rounded-lg bg-amber-500 text-black px-2 py-0.5 text-[10px] font-bold tracking-wider">
		 SPONSORED
	 </div>
 )}

 {/* Dynamic Stock Status Bar over media */}
 {!item?.inStock ? (
 <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
 <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">
 Sold Out
 </span>
 </div>
 ) : item?.totalQuantity <= 3 ? (
 <div className="absolute bottom-2 left-2 z-20 rounded-md bg-amber-500/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider animate-pulse">
 Only {item.totalQuantity} Left
 </div>
 ) : null}

 {/* Render Carousel or single media layout */}
{item?.variantId && item?.variants &&  <ImageCarousel images={item?.variants.find(variant => variant.id ===item.variantId)?.images} type="multiple" />}
{!item?.variantId && item?.variants &&  <ImageCarousel images={item?.variants[0]?.images} type="multiple" />}
{!item?.variantId && !item?.variants &&  <ImageCarousel images={item?.thumbnail} type="single" />}


 {/* Embedded Color Swatch Track */}
 {item?.variants?.length > 0 && (
 <div className="absolute bottom-2 right-2 z-20 scale-90 opacity-90 transition-opacity group-hover:opacity-100">
 <ColorCircles data={item?.variants?.length} />
 </div>
 )}
 </div>

 {/* 2. Compact Info Panel */}
 <div className="flex flex-1 flex-col pt-2 px-0.5">
 
 {/* Dynamic Heading Title */}
 <div className="flex items-center gap-2">
 <h3 className="line-clamp-1 text-[11px] font-bold uppercase tracking-tight cursor-pointer transition-colors" onClick={() => handleClick(item)}>
 {item?.name}
 </h3>
 {item?.isSponsored && (!item?.sponsorUntil || new Date(item.sponsorUntil) > new Date()) && (
	 <span className="text-[10px] font-extrabold uppercase tracking-wide rounded-md bg-amber-100 text-amber-700 px-2 py-0.5">Sponsored</span>
 )}
 </div>

 {/* Pricing Layout Structure */}
 <div className="mt-1 flex items-baseline gap-1.5">
 <span className="text-sm font-bold text-slate-500 line-through decoration-gray-500">₹{price}</span>
{item?.salePrice &&  <span className="text-sm font-black">₹{item?.salePrice}</span>}
 {discount > 0 && (
 <span className="text-[10px] font-bold text-red-500">
 ({discount}% OFF)
 </span>
 )}
 </div>

 {/* Premium Deal Row Conditional */}
 {item?.salePrice && price - item.salePrice > 0 && (
 <div className="mt-1 inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[12px] font-extrabold text-emerald-700 w-fit">
 <BadgePercent className="h-3 w-3" />
 <span>Save ₹{Math.round(price - item.salePrice)}</span>
 </div>
 )}

 {/* 3. Action Section pinned cleanly to base boundary */}
 <div className="mt-2.5 flex flex-col justify-end pt-2 border-t border-stone-100">
 <button
 disabled={!item?.inStock}
 onClick={() => {
 dispatch(getSingleProduct(item?.id));
 setOpen(true);
 }}
 className={`flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${
 item?.inStock
 ?'bg-stone-50 text-stone-900 border border-stone-200 hover:bg-stone-950 hover:text-white hover:border-stone-950'
 :'bg-stone-100 text-stone-400 cursor-not-allowed border border-transparent'
 }`}
 >
 <ShoppingBag className="h-3 w-3" />
 <span>{item?.inStock ?"Add to Bag" :"Out of Stock"}</span>
 </button>
 </div>

 </div>
 </article>
 );
};

export default ProductCard;