// views/CartView.jsx
import React from'react';
import CartItem from'../../Components/Cart/CartItem';
import ProductCard from'../../Components/CategoryProducts/ProductCard';
import { RiCoupon4Line, RiErrorWarningLine } from'react-icons/ri';
import AdvertisementBanner from '../../Components/Ads/AdvertisementBanner';
import toast, { Toaster } from 'react-hot-toast';

const SYNC_LABEL = {
 idle:'Ready',
 loading:'Syncing...',
 succeeded:'Saved',
 failed:'Sync Issue'
};

const CartView = ({ controller }) => {
 const {
 items, status, error, featuredProducts,
 couponVisible, setCouponVisible, cartRefShort, totalUnits, subtotal,
 couponInput, setCouponInput, isAnimating, discountAmount, appliedCoupon,
 shipping, couponType, total, handleApplyCoupon, removeCoupon,
 handleUpdateQuantity, handleRemoveFromCart, handleNavigateToProduct, handleNavigateToCheckout,isAuthenticated,token
 } = controller;

 return (
 <div className="min-h-screen bg-white text-zinc-900 selection:bg-zinc-900 selection:text-white antialiased">
   <Toaster position="top-right"/>
 <main className="max-w-[1200px] mx-auto px-4 md:px-8 pt-12 md:pt-16">

 {/* Error Banner Notification */}
 {status ==='failed' && error && (
 <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[11px] font-bold uppercase tracking-wider">
 <RiErrorWarningLine size={18} className="text-red-600" />
 <span>{error}</span>
 </div>
 )}

 {/* Header Block */}
 <header className="mb-8 md:mb-16 border-b border-zinc-100 pb-6">
 <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-400 mb-3">Shopping bag</p>
 <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
 <div>
 <h1 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-900">
 {items.length === 0 ?'Your bag is empty' :'Review your items'}
 </h1>
 {items.length === 0 && (
 <p className="text-zinc-500 my-5 italic text-lg tracking-tight">"The most beautiful collections are built piece by piece."
 </p>
 )}
 <p className="text-[11px] font-bold uppercase tracking-[0.2em] mt-4 text-zinc-600">
 {items.length > 0 && `${items.length} product(s) · ${totalUnits} unit(s)`}
 </p>
 </div>

 {items.length > 0 && (
 <div className="flex flex-col items-start sm:items-end gap-2 text-[10px] uppercase tracking-[0.2em]">
 <div className="flex items-center gap-2 flex-wrap justify-end">
 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold transition-colors ${
 status ==='succeeded' ?'border-green-200 bg-green-50 text-green-700' : 
 status ==='loading' ?'border-amber-200 bg-amber-50 text-amber-800 animate-pulse' :'border-zinc-200 bg-zinc-50 text-zinc-500'
 }`}>
 <span className={`h-1.5 w-1.5 rounded-full bg-current ${status ==='loading' ?'animate-ping' :''}`} />
 {SYNC_LABEL[status] || SYNC_LABEL.idle}
 </span>
 {cartRefShort && <span className="font-mono text-[9px] text-zinc-400">Ref {cartRefShort}</span>}
 </div>
 </div>
 )}
 </div>
 </header>

 {items.length > 0 ? (
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
 
 {/* Cart Line Items Column */}
 <div className="lg:col-span-7 space-y-4">
 {items.map((item , index) => (
 <CartItem
 key={`${item.productId}-${item.variantId}-${item.size}`}
 item={{
 ...item,
 displayPrice: Math.round(item.salePrice || item.price)
 }}
 onUpdate={handleUpdateQuantity}
 onRemove={() => handleRemoveFromCart(item)}
 onNavigate={() => handleNavigateToProduct(item)}
 />
 ))}
 </div>

 {/* Order Summary Sidebar Section */}
 <aside className="lg:col-span-5 lg:sticky lg:top-24 h-fit">
 <div className="border border-zinc-200 bg-white rounded-2xl p-8 md:p-10 shadow-sm">
 <div className="flex flex-col items-start justify-start gap-3">
 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Order summary</h2>
 </div>

 {/* Voucher Rules Interface */}
 <div className="mb-8 mt-4">
 {!appliedCoupon ? (
 <>
 <button
 type="button"
 onClick={() => setCouponVisible(!couponVisible)}
 className="flex items-center gap-2 text-zinc-500 hover:text-black transition-colors"
 >
 <RiCoupon4Line size={18} />
 <span className="text-[10px] font-black uppercase tracking-[0.25em]">Add discount code</span>
 </button>

 {couponVisible && (
 <div className="mt-4 grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
 <input
 type="text"
 placeholder="CODE"
 value={couponInput}
 onChange={(e) => setCouponInput(e.target.value)}
 className="flex-1 bg-zinc-50 col-span-2 text-black border border-zinc-200 text-[11px] font-bold tracking-[0.15em] px-4 py-3 focus:outline-none focus:border-black uppercase rounded-lg"
 />
 <button
 onClick={() => isAuthenticated ? handleApplyCoupon() : toast.error("Please Login to apply coupon code!")}
 className="bg-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] rounded-lg active:scale-95 hover:bg-zinc-800 transition-all"
 >
 Apply
 </button>
 </div>
 )}
 
 </>
 ) : (
 <div className="flex items-center justify-between gap-3 border border-zinc-900 px-4 py-3 rounded-lg bg-zinc-50 animate-in zoom-in-95 duration-200">
 <div className="flex items-center gap-2">
 <RiCoupon4Line className="text-zinc-900" />
 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">{appliedCoupon.code} Applied</span>
 </div>
 {appliedCoupon?.discountAmount !== undefined && (
 <div className="text-[10px] font-semibold text-green-800 bg-green-100 border border-green-200 px-2 py-0.5 rounded ml-2">
 Validated by server
 </div>
 )}
 <button onClick={removeCoupon} className="text-[10px] font-black uppercase underline text-zinc-600 hover:text-black underline-offset-4">
 Remove
 </button>
 </div>
 )}
 </div>

 {/* Calculation Rows */}
 <div className="space-y-4 border-b border-zinc-100 pb-6">
 <div className="flex justify-between text-sm">
 <span className="font-medium text-zinc-600">Subtotal</span>
 <span className="font-black text-zinc-900 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
 </div>
 
 {couponType !=='shipping' && appliedCoupon && discountAmount > 0 && (
 <div className={`flex justify-between text-emerald-600 text-sm font-semibold ${isAnimating ?'animate-bounce' :''}`}>
 <span className="italic">Extra Discount</span>
 <span className="font-black tabular-nums">− ₹{discountAmount.toLocaleString('en-IN')}</span>
 </div>
 )}

 <div className="flex justify-between text-sm">
 <span className="font-medium text-zinc-600">Shipping</span>
 <span className={`font-black tabular-nums ${shipping === 0 ?'text-green-600' :'text-zinc-900'}`}>
 {shipping === 0
 ? appliedCoupon?.type ==='shipping' || appliedCoupon?.code ==='FREESHIP'
 ? `FREE (${appliedCoupon?.code})`
 :'FREE'
 : `₹${shipping}`}
 </span>
 </div>
 </div>

 {/* Final Total Row */}
 <div className="flex justify-between items-baseline py-8">
 <span className="uppercase text-[11px] font-black tracking-[0.25em] text-zinc-500">Total</span>
 <span className="text-3xl font-black tracking-tighter text-zinc-900 tabular-nums">
 ₹{total.toLocaleString('en-IN')}
 </span>
 </div>

 <button
 type="button"
 disabled={status ==='loading'}
 onClick={()=>isAuthenticated  ? handleNavigateToCheckout() : toast.error("Please Login for Secure Checkout")}
 className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-sm ${
 status ==='loading' 
 ?'bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none' 
 :'bg-black text-white hover:bg-zinc-800 shadow-zinc-100'
 }`}
 >
 {status ==='loading' ?'Syncing Cart...' :'Secure Checkout'}
 </button>
 
 </div>
 
 </aside>
 
 </div>
 ) : (
 /* Cross-sell Container: When Cart is Empty */
 featuredProducts?.length > 0 && (
 <div className="mt-2 animate-in fade-in duration-300">
 <h2 className="text-lg md:text-2xl font-bold uppercase tracking-[0.2em] mb-8 text-zinc-900">Start Shopping Now</h2>
  <AdvertisementBanner location="cart"/>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {featuredProducts.map((product,index) => (
 product?.inStock && <ProductCard host="cart" key={product._id + "-" + index} item={product} type={product?.type.toLowerCase()} />
 ))}
 </div>
 </div>
 )
 )}
  


 {/* Cross-sell Container: When Cart has Items */}
 {items.length > 0 && featuredProducts?.length > 0 && (
 <div className="mt-1 pt-1 border-t border-zinc-100">
   <AdvertisementBanner location="cart"/>
 <h2 className="text-lg md:text-2xl font-bold uppercase tracking-[0.2em]  text-zinc-900">You might also like</h2>
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {featuredProducts.map((product,idx) => (
 product?.inStock && <ProductCard host="cart" key={idx} item={product} type={product?.type.toLowerCase()} />
 ))}
 </div>
 </div>
 )}

 </main>
 </div>
 );
};

export default CartView;