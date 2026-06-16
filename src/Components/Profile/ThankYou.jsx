import React, { useEffect } from'react';
import { FaCheckCircle, FaRegCheckCircle } from'react-icons/fa';
import { useLocation, useNavigate } from'react-router-dom';
import { useSelector } from'react-redux';
import { BadgeCheck , Pencil , Ban, Headphones } from'lucide-react';

const ThankYou = () => {
 const location = useLocation();
 const navigate = useNavigate();
 const user = useSelector((state) => state.auth.user);
 const siteData = useSelector((state) => state.siteData?.data || {});

 // Extract order data from navigation state
 const order = location.state?.order;
 const handlingTime = location.state?.handlingTime || siteData?.shipping?.handlingTime ||'N/A';

 const getSupportPhone = () => {
 const phone = siteData?.contact?.phone || siteData?.supportPhone ||'';
 return phone.toString().replace(/\D/g,'');
 };

 const handleContactSupport = () => {
 const supportPhone = getSupportPhone();
 const customerMobile = order?.shippingAddress?.mobile || order?.phone ||'N/A';
 const userIdValue = user?.id || user?._id || order?.userId ||'N/A';
 const message = ['Hello team,','I need help with my order.',
 `Order ID: ${order?.orderId ||'N/A'}`,
 `User ID: ${userIdValue}`,
 `Customer Mobile: ${customerMobile}`,'','Please assist with a return or order support.',
 ].join('\n');

 const encodedMessage = encodeURIComponent(message);
 const whatsappUrl = supportPhone
 ? `https://wa.me/${supportPhone}?text=${encodedMessage}`
 : `https://api.whatsapp.com/send?text=${encodedMessage}`;

 window.open(whatsappUrl,'_blank');
 };

 // Safety Redirect: If no order data exists (e.g. manual URL visit), go home
 useEffect(() => {
 
 if (!order) {
 console.warn('⚠️ No order data found, redirecting to home');
 navigate('/', { replace: true });
 }
 }, [order, navigate]);

 if (!order) {
 return null;
 }
 

 return (
 <div className=" min-h-screen text-on-surface font-['Inter'] antialiased">
 {/* HEADER SECTION */}
 <header className="py-16 px-6 text-center space-y-4">
 <div className="flex justify-center mb-6">
 <div className="w-10 h-10 rounded-full flex items-center justify-center">
 <span className="material-symbols-outlined scaling-icon"><BadgeCheck className='w-20 h-20 text-emerald-500'/></span>
 </div>
 </div>
 <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary font-['Manrope']">
 Thank You for Your Order!
 </h1>
 <p className="text-zinc-400 max-w-lg mx-auto text-sm leading-relaxed">
 We've received your order and we're getting it ready for shipment. You'll receive a confirmation email shortly.
 </p>

 {/* REAL-TIME ORDER ID */}
 <div className="inline-block mt-8 border border-zinc-100 p-4 px-8 text-center shadow-sm">
 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Order Number</p>
 <p className="text-sm font-bold tracking-tight">#{order.orderId}</p>
 </div>
 </header>

 <main className="max-w-6xl mx-auto px-6 md:px-12 pb-24">
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
 
 {/* LEFT COLUMN: REAL ITEMS */}
 <div className="lg:col-span-7 space-y-16">
 <section>
 <h3 className="text-xs font-bold uppercase tracking-widest border-b border-zinc-100 pb-4 mb-8">Order Details</h3>
 <div className="space-y-10">
 {order.items.map((item, index) => (
 <div key={index} className="flex gap-6 items-center">
 <div className="w-20 h-24 bg-zinc-50 flex-shrink-0">
 <img src={item.images?.[0] || item.thumbnail || item.image} alt={item.name} className="w-full h-full object-cover" />
 </div>
 <div className="flex-1 space-y-1">
 <div className="flex justify-between items-start">
 <h4 className="text-sm font-bold uppercase tracking-tight">{item.name}</h4>
 <div className="flex flex-col items-center justify-between gap-3">
 <p className="text-sm font-bold">₹{item.price.toLocaleString('en-IN')}</p>
 <div className="flex items-center gap-2">
 <p className="text-sm font-bold">Total</p>
 <p className="text-sm font-bold">₹{item.price * item.quantity}</p>
 </div>
 </div>
 </div>
 <p className="text-[10px] text-zinc-400 font-bold uppercase">{item.size ? `Size: ${item.size}` :''}</p>
 <p className="text-[10px] text-zinc-400 font-bold uppercase pt-4">Quantity: {item.quantity}</p>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* ADDRESS & METHOD GRID */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-zinc-100 pt-10">
 <section className="space-y-4">
 <h3 className="text-xs font-bold uppercase tracking-widest">Shipping Address</h3>
 <div className="text-[13px] leading-relaxed">
 <p className="font-bold mb-1">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
 <p>{order.shippingAddress.mobile}</p>
 <p>{order.shippingAddress.street} , {order.shippingAddress.apartment} , {order.shippingAddress.address}</p>
 <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
 <p>{order.shippingAddress.country}</p>
 </div>
 </section>

 <section className="space-y-4">
 <h3 className="text-xs font-bold uppercase tracking-widest">Delivery Method</h3>
 <div className="text-[13px] leading-relaxed">
 <p className="font-bold mb-1">Express Courier</p>
 <p>Estimated Arrival: {handlingTime}</p>
 <div className="flex items-center gap-2 mt-4 text-[11px] italic">
 <span className="material-symbols-outlined text-sm"><Pencil/></span>
 Signature required upon delivery
 </div>
 </div>
 </section>
 </div>
 </div>

 {/* RIGHT COLUMN: REAL TOTALS */}
 <div className="lg:col-span-5">
 <div className="bg-surface p-8 md:p-10 space-y-8">
 <h3 className="text-xs font-bold uppercase tracking-widest">Order Summary</h3>
 
 <div className="space-y-4 border-b border-zinc-200 pb-6">
 <div className="flex justify-between text-sm">
 <span className="text-zinc-400">Subtotal</span>
 <span className="font-bold">₹{order.subtotal.toLocaleString('en-IN')}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-zinc-400">Shipping</span>
 <span className="font-bold">
 {order.shipping === 0 ?"FREE" : `₹${order.shipping.toLocaleString('en-IN')}`}
 </span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-zinc-400">Discount {order?.coupon?.code && order.coupon.code}</span>
 <span className="font-bold">
 {order.discount ? `-₹${order.discount.toLocaleString('en-IN')}` : <Ban className='w-4 h-4 text-zinc-400'/>}
 </span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="text-zinc-400">Estimated Tax</span>
 <span className="font-bold">₹{order.tax.toLocaleString('en-IN')}</span>
 </div>
 </div>

 <div className="flex justify-between text-lg items-baseline">
 <span className="text-zinc-400 text-sm">Total</span>
 <span className="font-black text-2xl">₹{order.total.toLocaleString('en-IN')}</span>
 </div>

 <div className="space-y-4 pt-4">
 <button 
 onClick={() => navigate('/')}
 className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all"
 >
 Continue Shopping
 </button>
 <button className="w-full text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-black transition-colors py-2">
 Track Your Order
 </button>
 </div>

 <div className="mt-12 border border-zinc-100 p-8 text-center space-y-3 flex flex-col items-center">
 <p className="text-[13px] text-zinc-400">Need help with your order?</p>
 <button
 onClick={handleContactSupport}
 className="text-[10px] flex items-center gap-3 font-bold uppercase tracking-widest underline decoration-zinc-200 underline-offset-4 hover:decoration-black transition-all"
 >
 <Headphones className='font-black'/> Contact Support
 </button>
 </div>
 </div>
 </div>
 </div>
 </main>
 </div>
 );
};

export default ThankYou;