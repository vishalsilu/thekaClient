import React from'react';
import { Link } from'react-router-dom';
import ProductCard from'../CategoryProducts/ProductCard';
import { useMoreCollectionsController } from'../../Controllers/Collection/useMoreCollectionsController';

const MoreCollections = () => {
 const c = useMoreCollectionsController();

 // 1. Loading Matrix Display State (Light Only)
 if (c.currentCollection && !c.hasProducts && c.isLoading) {
 return (
 <div className="py-32 text-center bg-white">
 <div className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400 animate-pulse">
 Discovering Collections...
 </div>
 </div>
 );
 }

 // 2. Fallback State: Collection Verification Fault
 if (!c.currentCollection) {
 return (
 <div className="py-32 text-center bg-white">
 <div className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
 Collection not found
 </div>
 </div>
 );
 }

 // 3. Fallback State: Empty Production Row Array Catalog
 if (!c.categorizedProducts.length) {
 return (
 <div className="py-32 text-center bg-white">
 <div className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">
 No products found in this collection
 </div>
 </div>
 );
 }

 // 4. Main Decorative Layout Thread Render
 return (
 <section className="w-full bg-white border-t border-stone-100 selection:bg-stone-900 selection:text-white">
 <div className="max-w-[1300px] mx-auto px-4 md:px-8 py-12 md:py-16">
 
 {/* SECTION HEADER BLOCK */}
 <div className="text-center mb-16 md:mb-24">
 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 mb-4">
 Discovery Tracks
 </p>
 <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-stone-900">
 More from {c.currentCollection.name}
 </h2>
 </div>

 {/* MAPPING CATEGORIES WRAPPER */}
 {c.categorizedProducts.map((category) => (
 <div key={category.name} className="mb-16 md:mb-24 last:mb-0">
 
 {/* CATEGORY GRID SUB-HEADER */}
 <div className="flex items-baseline justify-between mb-8 border-b border-stone-100 pb-4">
 <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-stone-900">
 {category.name}
 </h3>
 <Link 
 to={`/collections/${c.type}/${category.name.toLowerCase().replace(/\s+/g,'-')}`}
 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-950 transition-colors duration-200"
 >
 View All
 </Link>
 </div>

 {/* SYNCED PRODUCT GRID CONTEXT BLOCK */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
 {category.products.map((product) => (
 <ProductCard 
 key={`${product._id || product.id}-${product.variantId ||'base'}`} 
 item={product} 
 type={c.type} 
 />
 ))}
 </div>

 </div>
 ))}
 </div>
 </section>
 );
};

export default React.memo(MoreCollections);