import React from'react';
import { useSelector } from'react-redux';
import { FiArrowRight } from'react-icons/fi';
import { Link } from'react-router-dom';

const locationLabels = {
 home:'Home Special',
 collection:'Curated Collection',
 product:'Spotlight Feature',
 cart:'Exclusive Offer',
 checkout:'Final Addition',
 all:'Featured Placement',
};

const AdvertisementBanner = ({ location ='home' }) => {
 const ads = useSelector((state) => state.siteData.data?.advertisements || []);
 
 const filteredAds = ads.filter((ad) => {
 const adLocation = (ad.location ||'all').toLowerCase();
 return adLocation ==='all' || adLocation === location;
 });

 if (filteredAds.length === 0) {
 return null;
 }

 return (
 <div className="mx-auto w-full space-y-8 py-8  sm:px-6 lg:px-8 max-w-7xl">
 {filteredAds.map((ad, index) => (
 <article
 key={`${ad.title ||'ad'}-${index}`}
 className="group relative overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all duration-300  flex flex-col md:flex-row md:items-center"
 >
 {/* --- IMAGE SECTION (Responsive, No Cropping) --- */}
 {ad.imageUrl ? (
 <div className="relative w-full md:w-6/12 bg-stone-50 flex items-center justify-center overflow-visible md:border-r border-stone-100 rounded-t-2xl md:rounded-t-none">
 <img
 src={ad.imageUrl}
 alt={ad.title || `Advertisement ${index + 1}`}
 className="max-w-full h-auto object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
 />
 </div>
 ) : null}

 {/* --- CONTENT SECTION --- */}
 <div className="flex flex-1 flex-col justify-between p-8 sm:p-10 lg:p-12 bg-white">
 <div className="space-y-4">
 {/* Badge */}
 <div className="inline-flex items-center gap-2">
 <span className="w-1.5 h-1.5 rounded-full bg-stone-900 animate-pulse" />
 <p className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
 {locationLabels[location] ||'Advertisement'}
 </p>
 </div>

 {/* Title */}
 <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 leading-tight">
 {ad.title ||'Sponsored placement'}
 </h2>

 {/* Description */}
 <p className="text-sm leading-relaxed text-stone-600 max-w-2xl">
 {ad.description ||'Promote a collection, product, or offer at this location.'}
 </p>
 </div>

 {/* Action Link Button */}
 {ad.link ? (
 <div className="pt-6 sm:pt-8">
 <Link
 to={ad.link}
 className="inline-flex items-center justify-center gap-2 rounded-none bg-stone-950 text-white px-6 py-3 text-xs font-black uppercase tracking-widest transition-all duration-200 hover:opacity-90 active:scale-[0.98] shadow-sm"
 >
 <span>{ad.buttonText ||'Learn More'}</span>
 <FiArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
 </Link>
 </div>
 ) : null}
 </div>

 </article>
 ))}
 </div>
 );
};

export default AdvertisementBanner;