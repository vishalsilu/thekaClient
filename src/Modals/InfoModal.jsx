import React from'react';
import { useParams, useNavigate } from'react-router-dom';
import { FaTimes, FaAnchor, FaShieldAlt, FaInfoCircle, FaBox } from'react-icons/fa';
import {Information} from'../Utils/db';
import { useSelector } from'react-redux';
import { useTextFavicon } from'../Utils/useTextFavicon';

const InfoModal = () => {
 const { slug } = useParams();
 const navigate = useNavigate();

 const Data = useSelector(state => state.siteData.data)
 
 const legalData = Data?.legalLinks;

 const data = legalData?.find(item => item.link.includes(slug));

 useTextFavicon("CU", `${data?.name ||"Legal Information"}-${Data?.websiteName }` , {
 bgColor:"#10b981", // Dark aesthetic variant
 textColor:"#ffffff"
 });
 
 if (!data) return null;

 return (
 <div className="fixed inset-0 z-[100] flex items-center justify-end p-0 md:p-6 animate-in slide-in-from-right duration-500">
 
 {/* TRANSPARENT BACKDROP (Clicking here closes) */}
 <div 
 className="absolute inset-0 bg-black/20 backdrop-blur-[2px] cursor-pointer"
 onClick={() => navigate(-1)}
 ></div>

 {/* THE MODAL: Clean, Semi-Transparent, Right-Aligned */}
 <div className="relative w-full max-w-2xl h-full md:h-[95dvh] backdrop-blur-2xl shadow-[-20px_0_80px_rgba(0,0,0,0.1)] flex flex-col border-l border-white/50 md:rounded-l-[40px] overflow-hidden">
 
 {/* HEADER: Minimalist */}
 <div className="p-8 md:p-12 flex justify-between items-start">
 <div className="flex items-center gap-4">
 <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/20">
 {data.name ==="Shipping Information" ? <FaBox size={20} /> : <FaAnchor size={20} />}
 </div>
 <div>
 <p className="text-[10px] font-black uppercase tracking-[0.3em]">{data.subtitle}</p>
 <h2 className="text-2xl font-bold tracking-tight">{data.name}</h2>
 </div>
 </div>
 
 <button 
 onClick={() => navigate(-1)}
 className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all"
 >
 <FaTimes size={14} />
 </button>
 </div>

 {/* CONTENT: High Readability */}
 <div className="flex-1 overflow-y-auto px-8 md:px-12 pb-12 custom-scrollbar">
 <div className="max-w-xl space-y-10">
 
 {data.highlight && (
 <div className="py-6 px-8 border-l-2 border-emerald-500 bg-emerald-500/5 rounded-r-2xl italic text-sm">"{data.highlight}"
 </div>
 )}

 {data.methods && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {data.methods.map((m, i) => (
 <div key={i} className="p-5 border border-black/5 rounded-2xl bg-white/50">
 <p className="text-[9px] font-black uppercase tracking-widest">{m.type}</p>
 <p className="font-bold">{m.time}</p>
 </div>
 ))}
 </div>
 )}

 <div className="space-y-10">
 {data.sections?.map((sec) => (
 <section key={sec.id} className="group">
 <div className="flex items-center gap-3 mb-3">
 <span className="text-[10px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-md">{sec.id}</span>
 <h4 className="font-bold uppercase text-xs tracking-widest">{sec.title}</h4>
 </div>
 <p className="text-sm text-gray-500 leading-relaxed pl-10 border-l border-gray-100 group-hover:border-emerald-200 transition-colors">
 {sec.text}
 </p>
 </section>
 ))}
 </div>
 </div>
 </div>

 {/* FOOTER: Static */}
 <div className="p-8 border-t border-black/5 flex items-center gap-3">
 <FaShieldAlt className="text-emerald-500" size={12} />
 <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Secure {Data?.websiteName} Document</span>
 </div>
 </div>
 </div>
 );
};

export default InfoModal;