import React, { useMemo, useState } from"react";
import { Minus, Plus } from"lucide-react";
import { FaTrash } from"react-icons/fa";

const CartItem = ({ item, onUpdate, onRemove, onNavigate }) => {
 const [localErr, setLocalErr] = useState("");

 // Resolves the correct variant asset image inline
 const displayImage = useMemo(() => {
 if (item.image) return item.image;

 if (item.variants && item.variantId) {
 const variantData = item.variants.find(v => String(v.id) === String(item.variantId));
 if (variantData && variantData.images?.length > 0) {
 return variantData.images[0];
 }
 }
 return item.images?.[0] || item.thumbnail;
 }, [item.image, item.variants, item.variantId, item.images, item.thumbnail]);

 const effectivePrice = Math.round(item.salePrice || item.price || 0);
 const color = item.color ||"N/A";

 const adjustQty = (delta) => {
 const currentQty = Number(item.quantity) || 0;
 const nextQty = currentQty + delta;

 // Fallback stock checks
 const currentVariant = item.variants?.find(v => String(v.id) === String(item.variantId));
 const sizeData = currentVariant?.sizes?.find(s => String(s.size) === String(item.size));
 const availableStock = sizeData?.stock || item.stock;

 if (delta > 0 && availableStock && nextQty > availableStock) {
 setLocalErr(`Only ${availableStock} available`);
 return setTimeout(() => setLocalErr(""), 2000);
 }

 if (nextQty >= 1) {
 onUpdate(item.productId || item.id, item.variantId, item.size, Number(nextQty));
 }
 };

 return (
 <div className="group flex flex-row py-4 border-b border-zinc-100 last:border-0 gap-4 md:gap-6 bg-white">
 
 {/* Product Image */}
 <div 
 className="w-28 md:w-36 aspect-[3/4] bg-zinc-50 overflow-hidden cursor-pointer flex-shrink-0 relative rounded-xl border border-zinc-100"
 onClick={() => onNavigate(item)}
 >
 <img 
 src={displayImage} 
 alt={item.name} 
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
 />
 </div>

 {/* Info Details */}
 <div className="flex flex-col justify-between flex-1">
 <div className="flex flex-col md:flex-row md:items-start justify-between w-full gap-4">
 <div className="space-y-1">
 <h3 className="text-xs font-black uppercase tracking-wide text-zinc-900 line-clamp-2">
 {item.name}
 </h3>
 
 <div className="flex flex-wrap gap-x-3 gap-y-0.5 pt-1">
 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
 Size: <span className="text-zinc-800">{item.size}</span>
 </span>
 {item.fit && (
 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
 Fit: <span className="text-zinc-800">{item.fit}</span>
 </span>
 )}
 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
 Color: <span className="text-zinc-800">{color}</span>
 </span>
 </div>
 </div>
 
 <div className="md:text-right">
 <p className="text-sm font-black text-zinc-900">
 ₹{(effectivePrice * item.quantity).toLocaleString('en-IN')}
 </p>
 <p className="text-[9px] font-bold tracking-wider text-zinc-400 mt-0.5">
 ₹{effectivePrice.toLocaleString('en-IN')} / UNIT
 </p>
 </div>
 </div>

 {/* Action Elements Row */}
 <div className="flex justify-between items-center mt-4 text-zinc-900">
 <div className="relative">
 {item.quantity >= 10 && (
 <h1 className="absolute -top-4 left-0 text-[9px] font-black text-red-600 uppercase tracking-tight w-64">
 You have added maximum items in the cart
 </h1>
 )}
 {localErr && (
 <p className="absolute top-9 left-0 text-[9px] font-black text-red-600 uppercase tracking-tight w-40">
 {localErr}
 </p>
 )}
 
 <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-zinc-50/50">
 <button 
 onClick={() => adjustQty(-1)} 
 className="px-3 py-2 hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-900 transition-colors"
 >
 <Minus size={11} strokeWidth={3} />
 </button>
 <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
 <button 
 onClick={() => adjustQty(1)} 
 className="px-3 py-2 hover:bg-zinc-200/60 text-zinc-500 hover:text-zinc-900 transition-colors"
 >
 <Plus size={11} strokeWidth={3} />
 </button>
 </div>
 </div>
 
 <button 
 onClick={() => onRemove(item.productId || item.id, item.variantId, item.size)}
 className="flex items-center gap-1.5 group/btn border-0 bg-transparent cursor-pointer"
 >
 <FaTrash size={9} className="text-zinc-300 group-hover/btn:text-red-600 transition-colors" />
 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover/btn:text-red-600 border-b border-transparent group-hover/btn:border-red-600 transition-all">
 Remove
 </span>
 </button>
 </div>

 </div>
 </div>
 );
};

export default CartItem;