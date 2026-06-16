import React, { useEffect } from'react';
import { FaCheck, FaCopy, FaBox, FaTruck, FaMapMarkerAlt, FaTimesCircle } from'react-icons/fa';
import { useDispatch, useSelector } from'react-redux';
import { fetchMyOrders } from'../../Redux/thunks/orderThunks';

const MyOrders = () => {
 const dispatch = useDispatch();
 const { isAuthenticated } = useSelector((s) => s.auth);
 const orders = useSelector((s) => s.orders?.orders || []);
 const loading = useSelector((s) => s.orders?.loading);
 const error = useSelector((s) => s.orders?.error);

 useEffect(() => {
 if (isAuthenticated) dispatch(fetchMyOrders());
 }, [dispatch, isAuthenticated]);

 if (!isAuthenticated) {
 return (
 <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
 <h2 className="text-2xl italic mb-4">Login required</h2>
 <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs font-bold">Please login to see your orders.</p>
 <button className="bg-black text-white px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase">Login</button>
 </div>
 );
 }

 if (loading) {
 return (
 <div className="min-h-screen flex items-center justify-center p-6 bg-white">
 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Loading orders…</p>
 </div>
 );
 }

 if (error) {
 return (
 <div className="min-h-screen flex items-center justify-center p-6 bg-white">
 <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">{error}</p>
 </div>
 );
 }

 if (orders.length === 0) {
 return (
 <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
 <h2 className="text-2xl italic mb-4">No orders found</h2>
 <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs font-bold">You haven't placed any orders yet.</p>
 <button className="bg-black text-white px-10 py-4 text-[10px] font-bold tracking-[0.3em] uppercase">Start Shopping</button>
 </div>
 );
 }

 return (
 <div className="bg-white min-h-screen text-[#1a1c1c] pt-16">
 {orders.map((order) => (
 <OrderDetails key={order.orderId} order={order} />
 ))}
 </div>
 );
};

const OrderDetails = ({ order }) => {
 const getStatusColor = (status) => {
 if (status ==='Delivered') return'bg-green-600';
 if (status ==='Cancelled') return'bg-red-600';
 return'bg-amber-500';
 };

 return (
 <div className="mb-20 border-b border-gray-100 last:border-0 pb-20">
 {/* Page Header */}
 <section className="px-6 md:px-20 py-12 bg-[#f9f9f9]">
 <div className="max-w-[1440px] mx-auto">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">Order Details</p>
 <h1 className="text-3xl md:text-5xl font-bold tracking-tighter text-black uppercase">#{order.orderId}</h1>
 <p className="text-xs text-gray-400 mt-2">Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}</p>
 </div>
 <div className="flex items-center gap-3 bg-white px-6 py-3 border border-gray-200">
 <span className={`w-2 h-2 rounded-full ${getStatusColor(order.status)} animate-pulse`}></span>
 <span className="text-[10px] font-bold uppercase tracking-widest">Status: {order.status}</span>
 </div>
 </div>
 </div>
 </section>

 {/* Progress Section - Dynamic logic based on tracking array */}
 <section className="px-6 md:px-20 py-12 border-b border-gray-100">
 <div className="max-w-[1440px] mx-auto">
 <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-y-12">
 <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gray-200 -translate-y-1/2 -z-10"></div>
 
 {['Order Placed','Packed','Shipped','Delivered'].map((step, idx) => {
 const isCompleted = order.tracking?.some(t => t.status === step) || order.status ==='Delivered';
 const isCancelled = order.status ==='Cancelled';
 
 return (
 <div key={step} className={`flex md:flex-col items-center gap-4 bg-white md:px-4 ${!isCompleted && !isCancelled ?'opacity-30' :''}`}>
 <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${isCompleted ?'bg-black text-white' :'bg-white border-gray-300'}`}>
 {isCompleted ? <FaCheck size={12}/> : <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>}
 </div>
 <div className="text-left md:text-center">
 <p className="text-[10px] font-bold uppercase tracking-widest">{step}</p>
 <p className="text-[9px] text-gray-400 uppercase tracking-tighter">
 {order.tracking?.find(t => t.status === step)?.date || (order.status === step ?'Today' :'Pending')}
 </p>
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </section>

 {/* Main Content Grid */}
 <section className="px-6 md:px-20 py-12">
 <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
 
 {/* Left Column: Tracking Log & Info */}
 <div className="lg:col-span-8 space-y-12">
 <div>
 <h2 className="text-xl font-bold uppercase tracking-widest mb-10 border-b border-gray-100 pb-4">Tracking History</h2>
 <div className="space-y-0">
 {order.tracking ? order.tracking.slice().reverse().map((log, index) => (
 <div key={index} className="flex gap-6 pb-8 border-l border-gray-200 ml-3 pl-8 relative">
 <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full bg-black"></div>
 <div className="w-24 shrink-0">
 <p className="text-[10px] font-bold uppercase tracking-tighter">{log.date}</p>
 </div>
 <div>
 <p className="text-sm font-bold uppercase tracking-tight">{log.status}</p>
 <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
 {log.location || log.from ||"Processed at Facility"}
 </p>
 </div>
 </div>
 )) : (
 <p className="text-xs text-gray-400 uppercase italic tracking-widest">No detailed tracking information available for this status.</p>
 )}
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="border border-gray-200 p-8">
 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-gray-100 pb-4 mb-6">Payment Info</h3>
 <div className="space-y-4">
 <div className="flex justify-between">
 <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Method</span>
 <span className="text-xs font-bold uppercase">{order.paymentMethod}</span>
 </div>
 <div className="flex justify-between">
 <span className="text-xs text-gray-400 uppercase font-bold tracking-widest">Transaction</span>
 <span className="text-xs font-bold flex items-center gap-2">#TXN-{Math.floor(Math.random()*10000)} <FaCopy className="cursor-pointer text-gray-300" size={10}/></span>
 </div>
 </div>
 </div>
 <div className="border border-gray-200 p-8">
 <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] border-b border-gray-100 pb-4 mb-6">Delivery Address</h3>
 <div className="space-y-1 text-xs uppercase font-bold tracking-tight">
 <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
 <p className="text-gray-500 font-medium tracking-normal">{order.shippingAddress.address}</p>
 <p className="text-gray-500 font-medium tracking-normal">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
 <p className="text-gray-500 font-medium">{order.shippingAddress.country}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Right Column: Items Summary */}
 <div className="lg:col-span-4 space-y-8">
 <div className="bg-[#f3f3f3] p-8 border border-gray-200">
 <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Items ({order.items.length})</h2>
 <div className="space-y-6">
 {order.items.map((item, idx) => (
 <div key={idx} className="flex gap-4">
 <div className="w-16 h-20 bg-white border border-gray-200 overflow-hidden flex-shrink-0">
 <img alt={item.name} className="w-full h-full object-cover" src={item.images?.[0] || item.thumbnail ||"https://via.placeholder.com/150"}/>
 </div>
 <div className="flex flex-col justify-between py-1">
 <div>
 <p className="text-[10px] font-bold uppercase tracking-tight leading-tight">{item.name}</p>
 <p className="text-[9px] text-gray-400 font-bold uppercase mt-1 tracking-widest">{item.size} / Qty: {item.quantity}</p>
 </div>
 <p className="text-xs font-bold">₹{item.price.toLocaleString('en-IN')}</p>
 </div>
 </div>
 ))}
 </div>
 <div className="mt-8 pt-8 border-t border-gray-200">
 <div className="flex justify-between items-center">
 <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Total Amount</span>
 <span className="text-xl font-bold">₹{order.total.toLocaleString('en-IN')}</span>
 </div>
 </div>
 </div>

 <div className="p-8 border border-gray-200">
 <h3 className="text-lg font-bold uppercase tracking-tighter mb-4">Support</h3>
 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 leading-relaxed">Questions about your delivery? Our studio team is available 24/7.</p>
 <button className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-zinc-800 transition-colors">
 Contact Concierge
 </button>
 </div>
 </div>
 </div>
 </section>
 </div>
 );
};

export default MyOrders;