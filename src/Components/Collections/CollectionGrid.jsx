import React from'react';
import { useNavigate, useParams } from'react-router-dom';
import { useSelector } from'react-redux';
import { useTextFavicon } from'../../Utils/useTextFavicon';

const CollectionGrid = () => {
 const navigate = useNavigate();
 const { type } = useParams(); // This gets'men','women', etc.
 const {collections} = useSelector(state => state.metaData)
 const data = useSelector((state) => state.siteData.data);

 // 1. Find the specific collection based on the URL param
 const activeCollection = collections?.find(col => col.name.toLowerCase() === type);

 // 2. Simple Logic: 
 // If'type' exists and matches something in DB -> show only those categories.
 // If no'type' exists -> show all categories from every collection.
const displayItems = activeCollection 
 ? activeCollection.allCategories.map(cat => ({
 ...cat,
 collectionName: activeCollection.name // Replace .name with your actual field (e.g., .title)
 }))
 : collections;

 const displayTitle = activeCollection ? activeCollection.name :"Our Collections";
 useTextFavicon("CU", `${displayTitle ||"COLLECTION"} - ${data?.websiteName }` , {
 bgColor:"#10b981", // Dark aesthetic variant
 textColor:"#ffffff"
 });

 
 return (
 <div className="w-full bg-surface">
 {/* Header */}
 <div className="pt-16 pb-5 flex flex-col items-center border-b border-gray-100">

 <h1 className="text-3xl md:text-5xl font-light tracking-[0.15em] uppercase mb-4">
 {displayTitle}
 </h1>
 <nav className="flex items-center gap-2 text-[10px] tracking-widest text-gray-400 uppercase">
 <span className="cursor-pointer hover:text-black" onClick={() => navigate('/')}>Home</span>
 <span>{'>'}</span>
 <span className=" font-bold">{displayTitle}</span>
 </nav>
 </div>

 {/* Grid */}
 <div className="w-full md:w-[75%] mx-auto px-4 py-5 pb-20">
 <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-8">
 {displayItems?.map((item, index) => (
 <div 
 key={index} 
 className="group cursor-pointer flex flex-col items-center text-center"
 onClick={() => navigate(`/collections/${item.path}`)}
 >
 <div className="w-full aspect-[3/4] overflow-hidden bg-[#f7f7f7] mb-5 relative">
 {/* {activeCollection ? <h1 className='absolute top-2 left-3 text-white z-50 bg-black/50 rounded-xl px-3 py-1 font-bold'>{item?.collectionName}</h1> : null} */}
 <img 
 src={item?.image} 
 alt={item?.name}
 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
 />
 </div>
 <h3 className="text-[11px] md:text-[13px] font-bold uppercase tracking-[0.1em]">
 {item?.name}
 </h3>
 </div>
 ))}
 </div>
 </div>
 </div>
 );
};

export default CollectionGrid;