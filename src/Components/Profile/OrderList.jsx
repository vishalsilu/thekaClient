import React from'react';
import { Package, Star, Eye } from'lucide-react'; // Added Eye for Details
import { useNavigate } from'react-router-dom';
import NoOrders from'./NoOrders';
import { FaStar } from'react-icons/fa';

const OrderList = ({ orders }) => {
 const navigate = useNavigate();
 if (orders.length === 0) return <NoOrders />;
 

 // Adjusted grid for better spacing: ID, Date, Status, Items, Total, Actions
 const gridLayout ="md:grid md:grid-cols-[1.2fr_1.2fr_1.2fr_1.8fr_1fr_1.8fr] md:gap-4 md:items-center";

 return (
 <div className="space-y-4">
 {/* Table Header */}
 <div className={`hidden ${gridLayout} pb-4 border-b border-gray-200 text-[10px] font-bold uppercase tracking-[0.15em] `}>
 <div>Order #</div>
 <div>Date</div>
 <div>Status</div>
 <div>Items</div>
 <div>Total</div>
 <div className="text-right">Actions</div>
 </div>

 {orders.map((order) => {
 const date = new Date(order.createdAt);
 const dateString = `${date.toLocaleString('en-US', { month:'short' })} ${date.getDate()}, ${date.getFullYear()}`;
 const thumbnails = order?.items?.map(item => item.thumbnail) || [];

 const statusStyles = {
 Delivered:'bg-green-50 text-green-700 border-green-200',
 Cancelled:'bg-red-50 text-red-700 border-red-200','Under Process':'bg-blue-50 text-blue-700 border-blue-200',
 default:' border-gray-200',
 };

 return (
 <div 
 key={order.orderId}
 className={`flex flex-col md:flex-row ${gridLayout} p-4 md:px-0 md:py-5 border border-gray-100 md:border-none md:border-b md:border-gray-100 md:bg-transparent rounded-xl md:rounded-none shadow-sm md:shadow-none transition-all `}
 >
 {/* 1. Order ID */}
 <div className="flex items-center justify-between w-full md:w-auto mb-2 md:mb-0">
 <span className="font-bold text-sm">#{order.orderId}</span>
 <span className={`md:hidden px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase border rounded ${statusStyles[order.status] || statusStyles.default}`}>
 {order.status}
 </span>
 </div>

 {/* 2. Date */}
 <div className="text-sm mb-3 md:mb-0">{dateString}</div>

 {/* 3. Status (Desktop Only) */}
 <div className="hidden md:block">
 <span className={`px-2 py-1 text-[9px] font-bold tracking-widest uppercase border rounded ${statusStyles[order.status] || statusStyles.default}`}>
 {order.status}
 </span>
 </div>

 {/* 4. Items (Thumbnails) */}
 <div className="flex flex-wrap gap-1.5 mb-4 md:mb-0">
 {thumbnails.slice(0, 3).map((src, idx) => (
 <img 
 key={idx} 
 src={src} 
 alt="Item" 
 className="w-10 h-12 object-cover rounded border border-gray-200 shadow-sm bg-white" 
 />
 ))}
 {thumbnails.length > 3 && (
 <div className="w-10 h-12 bg-gray-100 flex items-center justify-center rounded border border-gray-200 text-[10px] font-bold">
 +{thumbnails.length - 3}
 </div>
 )}
 </div>

 {/* 5. Total */}
 <div className="flex justify-between items-center md:block mb-4 md:mb-0 border-t border-gray-50 pt-3 md:pt-0 md:border-none">
 <span className="md:hidden text-[10px] uppercase font-bold tracking-wider">Total</span>
 <div className="text-sm font-bold">₹{order.subtotal.toLocaleString()}</div>
 </div>

 {/* 6. Action Buttons */}
 <div className="flex flex-col sm:flex-row gap-2 md:justify-end">
 {order.status ==="Delivered" && (
 <button 
 onClick={() => navigate(`/review/${order.orderId}`, { state: { order } })}
 className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all group"
 >
 <FaStar className="text-emerald-500 group-hover:text-white transition-colors" />
 Rate Us
 </button>
 )}
 
 <button 
 onClick={() => navigate(`/order/${order.orderId}`, { state: { order } })}
 className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-900 rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all"
 >
 Details
 </button>
 </div>
 </div>
 );
 })}
 </div>
 );
};

export default OrderList;