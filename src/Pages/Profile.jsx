import React from'react';
import { useNavigate } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { useTextFavicon } from'../Utils/useTextFavicon';
import { User, Mail, Phone, Shield, MapPin, ShoppingBag, Edit3, Check, X, BadgeAlert, Eye } from"lucide-react";
import { useState } from'react';
import { updateUser } from'../Redux/controllers/crudUser';

const Profile = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const { user, error } = useSelector((state) => state.auth);
 const data = useSelector((state) => state.siteData.data);

 const [isEditing, setIsEditing] = useState(false);
 const [formData, setFormData] = useState({
 firstName: user?.firstName ||"",
 lastName: user?.lastName ||"",
 });

 const handleSave = () => {
 dispatch(updateUser(formData)); 
 setIsEditing(false);
 };

 useTextFavicon('CU',
 `${user?.firstName} ${user?.lastName} - ${data?.websiteName}`,
 { bgColor:'#10b981', textColor:'#ffffff' }
 );

 return (
 <div className="max-w-7xl mx-auto px-4 py-12 min-h-screen bg-white">
 
 {/* --- Top Banner & Header --- */}
 <div className="relative border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm bg-white overflow-hidden mb-8">
 <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
 
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mt-2">
 <div className="flex items-center gap-5">
 <div className="w-20 h-20 rounded-2xl bg-indigo-50/70 flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-inner">
 <User size={38} strokeWidth={1.5} />
 </div>
 <div>
 <h1 className="text-3xl font-black tracking-tight text-zinc-900 flex items-center gap-3">
 {user?.fullName || `${user?.firstName} ${user?.lastName}`}
 <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
 <Shield size={12} /> {user?.role ||"Customer"}
 </span>
 </h1>
 <p className="text-xs font-medium text-zinc-500 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
 <span className="flex items-center gap-1.5 text-zinc-700"><Mail size={14} className="text-zinc-400" /> {user?.email}</span>
 <span className="text-zinc-200 hidden sm:inline">•</span>
 <span className="flex items-center gap-1.5 text-zinc-700"><Phone size={14} className="text-zinc-400" /> {user?.phone}</span>
 </p>
 </div>
 </div>

 {/* Quick Edit Toggle Trigger */}
 {!isEditing && (
 <button
 onClick={() => setIsEditing(true)}
 className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm active:scale-98"
 >
 <Edit3 size={14} /> Edit Name
 </button>
 )}
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 
 {/* --- Left Column: Edit Name Component --- */}
 <div className="lg:col-span-1 border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm h-fit">
 <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 mb-1">Personal Details</h3>
 <p className="text-xs text-zinc-400 mb-6">Keep your account identification identity up to date.</p>
 
 {error && (
 <div className="mb-4 text-red-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2 bg-red-50 border border-red-100 p-3 rounded-xl">
 <BadgeAlert size={16} /> {error}
 </div>
 )}

 <div className="space-y-5">
 <div>
 <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
 First Name
 </label>
 <input
 type="text"
 disabled={!isEditing}
 value={formData.firstName}
 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 disabled:bg-zinc-50/50 disabled:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:text-zinc-900 transition-colors text-xs font-semibold shadow-sm"
 placeholder="Enter first name"
 />
 </div>

 <div>
 <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">
 Last Name
 </label>
 <input
 type="text"
 disabled={!isEditing}
 value={formData.lastName}
 onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
 className="w-full px-4 py-3 rounded-xl border border-zinc-200 disabled:bg-zinc-50/50 disabled:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:text-zinc-900 transition-colors text-xs font-semibold shadow-sm"
 placeholder="Enter last name"
 />
 </div>

 {isEditing && (
 <div className="flex items-center gap-3 pt-2">
 <button
 onClick={handleSave}
 className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
 >
 <Check size={14} /> Save Changes
 </button>
 <button
 onClick={() => {
 setFormData({ firstName: user?.firstName, lastName: user?.lastName });
 setIsEditing(false);
 }}
 className="inline-flex items-center justify-center p-3 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
 >
 <X size={16} />
 </button>
 </div>
 )}
 </div>
 </div>

 {/* --- Right Column: Structured Metadata Overview --- */}
 <div className="lg:col-span-2 space-y-8">
 
 {/* Section: Addresses */}
 <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
 <MapPin size={16} className="text-zinc-400" /> Saved Addresses
 </h3>
 <div className="flex items-center gap-3">
 <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-50 px-2.5 py-1 border border-zinc-100">
 {user?.addresses?.length || 0} Registered
 </span>
 <button 
 onClick={() => navigate('/addresses')} 
 className="text-zinc-400 hover:text-zinc-900 transition-colors"
 title="Manage Addresses"
 >
 <Edit3 size={15} />
 </button>
 </div>
 </div>

 {user?.addresses && user.addresses.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {user.addresses.map((addr, idx) => (
 <div 
 key={idx} 
 className={`p-5 rounded-xl border transition-all ${
 addr.isDefault 
 ?'border-indigo-200 bg-indigo-50/10 relative shadow-sm' 
 :'border-zinc-100 bg-zinc-50/50'
 }`}
 >
 {addr.isDefault && (
 <span className="absolute top-4 right-4 text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded bg-indigo-600 text-white">
 Default
 </span>
 )}
 <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 border rounded mb-3 inline-block ${
 addr?.isDefault 
 ?'text-amber-700 bg-amber-50 border-amber-200/60' 
 :'text-zinc-400 bg-zinc-100 border-zinc-200'
 }`}>
 {addr.type}
 </span>
 <p className="text-xs font-bold text-zinc-900">{addr.firstName} {addr.lastName}</p>
 <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
 {addr.street}{addr.apartment ? `, ${addr.apartment}` :""}<br />
 {addr.address}, {addr.city}, {addr.state} - <span className=" font-bold text-zinc-700">{addr.zip}</span>
 </p>
 <p className="text-xs text-zinc-400 font-medium mt-3 flex items-center gap-1">
 <span>Mobile:</span> <strong className="text-zinc-700 font-semibold">{addr.mobile}</strong>
 </p>
 </div>
 ))}
 </div>
 ) : (
 <div className="text-center py-10 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/30">
 <p className="text-xs text-zinc-400 font-medium">No saved addresses found.</p>
 </div>
 )}
 </div>

 {/* Section: Active Shopping Cart */}
 <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
 <div className="flex items-center justify-between mb-6">
 <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-2">
 <ShoppingBag size={16} className="text-zinc-400" /> Active Bag
 </h3>
 <div className="flex items-center gap-3">
 <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 bg-zinc-50 px-2.5 py-1 border border-zinc-100">
 {user?.cart?.length || 0} Items
 </span>
 <button 
 onClick={() => navigate('/cart')} 
 className="text-zinc-400 hover:text-zinc-900 transition-colors"
 title="View Cart Metrics"
 >
 <Eye size={15} />
 </button>
 </div>
 </div>

 {user?.cart && user.cart.length > 0 ? (
 <div className="border border-zinc-100 rounded-xl divide-y divide-zinc-100 overflow-hidden bg-zinc-50/20">
 {user.cart.map((item, idx) => (
 <div key={idx} className="p-4 flex items-center justify-between hover:bg-zinc-50/60 transition-colors">
 <div className="space-y-1">
 <p className="text-xs font-bold text-zinc-800">
 SKU Ref: <span className="font-mono text-zinc-500 font-normal">{item.productId}</span>
 </p>
 <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-400">
 <span className="flex items-center gap-1">Size: <strong className="text-zinc-700 font-bold">{item.size}</strong></span>
 <span className="text-zinc-200">|</span>
 <span>Variant Key: <strong className="text-zinc-700 font-semibold font-mono">{item.variantId}</strong></span>
 </div>
 </div>
 <div className="text-right">
 <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold bg-white border border-zinc-200 text-zinc-700 shadow-sm">
 Qty: {item.quantity}
 </span>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="text-center py-10 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/30">
 <p className="text-xs text-zinc-400 font-medium">Your cart is not synced with the server.</p>
 </div>
 )}
 </div>

 </div>
 </div>
 </div>
 );
};

export default Profile;