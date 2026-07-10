import React, { useState, useEffect } from'react'
import * as Icons from"react-icons/fa6";
import { FaArrowRight } from'react-icons/fa6'
import { Pages, Information, OurStore, PaymentMethods } from'../../Utils/db'
import { useNavigate } from'react-router-dom';
import { use } from'react';
import { useSelector } from'react-redux';
import { ArrowRight, CheckCircle2, Loader2, Mail, MailOpen, MapPin, MapPinCheck, PhoneCall } from'lucide-react';
import api from'../../config/api';
import toast from'react-hot-toast';

const Footer = () => {
 const navigate = useNavigate()
 const Data = useSelector((state) => state.siteData.data);
 const OurStore = Data?.OurStore || [];
 const { isAuthenticated, user } = useSelector((state) => state.auth);
 const [subscribed, setSubscribed] = useState(null);


const Address = (add) => {
    const {other,appartment,street,city,state,pin} = add;
 const completeAdd = `${other} ,${appartment} ,${street} ,${city} ,${state} ,${pin}` 
 return completeAdd; 
}
 useEffect(() => {
 let mounted = true;
 const check = async () => {
 if (!isAuthenticated || !user?.email) {
 if (mounted) setSubscribed(false);
 return;
 }
 try {
 if (mounted) setSubscribed(null);
 const { data } = await api.get(`/subscribers/check?email=${encodeURIComponent(user.email)}`);
 if (mounted) setSubscribed(!!data?.subscribed);
 } catch (err) {
 if (mounted) setSubscribed(false);
 }
 };
 check();
 return () => { mounted = false; };
 }, [isAuthenticated, user?.email]);

 const handleSubscribe = async () => {
 try {
 if (!isAuthenticated || !user?.email) return toast.error('Please login to subscribe');
 const email = String(user.email).trim().toLowerCase();
 const { data } = await api.post('/subscribers', { email, source:'footer' });
 if (data?.success) {
 toast.success('Subscribed — thanks!');
 setSubscribed(true);
 } else {
 toast.success(data.message ||'Subscribed');
 setSubscribed(true);
 }
 } catch (err) {
 toast.error(err.response?.data?.error ||'Failed to subscribe');
 }
 };

 const handleUnsubscribe = async () => {
 try {
 if (!isAuthenticated || !user?.email) return toast.error('Please login to unsubscribe');
 const email = String(user.email).trim().toLowerCase();
 const { data } = await api.delete(`/subscribers?email=${encodeURIComponent(email)}`);
 if (data?.success) {
 toast.success('Unsubscribed');
 setSubscribed(false);
 } else {
 toast.error(data?.message ||'Failed to unsubscribe');
 }
 } catch (err) {
 toast.error(err.response?.data?.error ||'Failed to unsubscribe');
 }
 };

 return (
 <footer className='w-full bg-surface pt-20 pb-10 border-2'>
 {/* 75% Width Container - Same as About Page */}
 <div className='w-full md:w-[75%] mx-auto px-6'>
 
 <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16 border-b border-white/10 pb-12">
 
 {/* 1. BRAND & NEWSLETTER */}
 <div className="md:col-span-1">
 <h1 className="text-2xl font-signature mb-4">{Data?.websiteName}</h1> 
 
 {!isAuthenticated ? (
 <div className="text-[11px] text-gray-500">Please sign in to manage newsletter subscription.</div>
 ) : (
 /* Vertically stacked version to fit nicely into Column 1 */
 <div className="flex flex-col gap-3 p-4 bg-gray-50/60 border border-gray-200/80 rounded-2xl backdrop-blur-sm transition-all duration-300 hover:shadow-sm">
 
 {/* Branding/Context Context */}
 <div className="flex items-center gap-3">
 <div className="flex items-center justify-center w-8 h-8 bg-black rounded-xl text-white shadow-sm shrink-0">
 <Mail className="w-4 h-4" />
 </div>
 <div>
 <h4 className="text-xs font-bold tracking-wider uppercase text-gray-900">Newsletter</h4>
 <p className="text-[10px] text-gray-500 mt-0.5">Get product updates</p>
 </div>
 </div>

 {/* Conditional Action States Framework */}
 <div className="flex w-full pt-1">
 {subscribed === null ? (
 /* --- STATE: CHECKING STATUS --- */
 <div className="flex items-center gap-2 w-full justify-center px-3 py-2 bg-gray-100 rounded-xl text-gray-500 text-xs font-medium animate-pulse">
 <Loader2 className="animate-spin h-3.5 w-3.5 text-gray-400" />
 Syncing Status...
 </div>
 ) : subscribed ? (
 /* --- STATE: ACTIVE SUBSCRIBER --- */
 <div className="flex flex-col gap-2 w-full bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
 <div className="flex flex-col">
 <span className="text-[9px] text-emerald-700 font-bold uppercase tracking-wide">Active Subscriber</span>
 <span className="text-xs font-medium text-gray-700 truncate max-w-full">{user?.email}</span>
 </div>
 <button 
 onClick={handleUnsubscribe} 
 className="w-full py-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 hover:border-red-300 font-semibold rounded-lg text-xs transition-all duration-200 shadow-sm"
 >
 Unsubscribe
 </button>
 </div>
 ) : (
 /* --- STATE: NOT SUBSCRIBER --- */
 <button 
 onClick={handleSubscribe} 
 className="group flex items-center justify-center gap-1.5 w-full px-4 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl text-xs tracking-wide transition-all duration-200 active:scale-95 shadow-sm"
 >
 Subscribe Now
 <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
 </button>
 )}
 </div>
 </div>
 )}
 </div>

 {/* 2. NAVIGATION */}
 <div>
 <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-5">Navigation</h3>
 <ul className="space-y-4">
 {Data?.navigationLinks?.map((page, i) => (
 <li 
 key={i} 
 onClick={() => navigate(page.path)} 
 className="text-[11px] font-bold uppercase tracking-widest cursor-pointer hover:text-gray-400 transition-colors"
 >
 {page.label}
 </li>
 ))}
 </ul>
 </div>

 {/* 3. SUPPORT */}
 <div>
 <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-5">Support</h3>
 <ul className="space-y-4">
 {Data?.legalLinks?.map((info, i) => (
 <li 
 key={i} 
 onClick={() => navigate(`info/${info?.link}`)} 
 className="text-[11px] font-bold uppercase tracking-widest cursor-pointer hover:text-gray-400 transition-colors"
 >
 {info?.name}
 </li>
 ))}
 </ul>
 </div>

 {/* 4. THE STUDIO */}
 <div>
 <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-5">The Studio</h3>
 
 <div className="space-y-4">
 <div className="flex flex-col gap-3 text-[11px] font-bold uppercase">
 <p className="text-[11px] font-bold leading-relaxed flex items-center gap-3">
 <span className='text-gray-400'><MapPin size={16}/></span> {Address(Data?.contact?.address)}
 </p>
 <p className="text-[11px] font-bold leading-relaxed flex items-center gap-3">
 <span className='text-gray-400'><PhoneCall size={16}/></span> {Data?.contact?.phone}
 </p>
 <p className="text-[11px] font-bold leading-relaxed flex items-center gap-3">
 <span className='text-gray-400'><MailOpen size={16}/></span> {Data?.contact?.email}
 </p>
 </div>
 
 {/* Minimal Social Icons */}
 <div className="flex gap-5">
 {Data?.contact?.socials?.map((social, sIndex) => {
 const Icon = Icons[`Fa${social.label}`];
 return Icon ? (
 <a key={sIndex} href={social.url} className="hover:opacity-50 transition-opacity">
 <Icon size={16} />
 </a>
 ) : null;
 })}
 </div>
 </div>
 </div>
 </div>

 {/* BOTTOM BAR */}
 <div className="flex items-center justify-between">
 <div className="pt-1 flex flex-col md:flex-row justify-between items-center gap-6">
 <small className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500">
 This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">Privacy Policy</a> and <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">Terms of Service</a> apply.
 </small>
 <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500">
 {Data?.websiteName} {Data?.footerText}
 </p>
 </div>
 </div>
 </div>
 </footer>
 )
}

export default Footer