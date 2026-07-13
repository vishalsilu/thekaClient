import React from'react';
import { Link } from'react-router-dom';
import { useFeaturedCollections } from'../../Controllers/Collection/useFeaturedCollections';
import ProductCard from'../../Components/CategoryProducts/ProductCard';

const FeaturedCollections = () => {
 // Ingest computed datasets from the custom controller model hook
 const { featuredRows, isLoading } = useFeaturedCollections();

 if (!featuredRows.length && !isLoading) return null;

 return (
 <section className="w-full py-4 border-t border-zinc-100">
 <div className="w-full px-6 md:px-12 max-w-[1400px] mx-auto">
 
 {/* COMPONENT COMPLIANCE HEADER CONTAINER */}
 <div className="mb-6">
 <h2 className="text-4xl font-light uppercase tracking-[0.2em]">
 Featured <span className="font-bold">Categories</span>
 </h2>
 </div>

 {/* COLLECTION ROW RENDERING PIPELINE */}
 {featuredRows.map((row) => (
 <div key={row.id} className="mb-5 last:mb-0">
 
 {/* TITLE SUB-HEADER ROW FRAMEWORK */}
 <div className="flex items-end justify-between mb-8 pb-4 border-b border-zinc-100">
 <div>
 <span className="text-[10px] font-bold uppercase tracking-[0.4em] block mb-2 text-zinc-400">
 {row.collectionName}
 </span>
 <h3 className="text-2xl font-bold uppercase tracking-widest">
 {row.categoryName}
 </h3>
 </div>
 
 <Link 
 to={`/collections/${row.slug}/${row.categorySlug}`}
 className="text-[11px] font-bold uppercase tracking-widest hover:opacity-60 transition-opacity border-b border-black pb-1"
 >
 Explore More
 </Link>
 </div>

 {/* HORIZONTAL STREAM DISPLAY MATRIX */}
 <div className="flex gap-4 md:gap-8 overflow-x-auto pb-10 no-scrollbar snap-x snap-mandatory">
 {row.products.map(product => (
 product?.inStock && <div 
 key={`${product._id || product.id}-${product.variantId ||'base'}`} 
 className="min-w-[280px] md:min-w-[350px] snap-start"
 >
 <ProductCard item={product} type={row.slug} />
 </div>
 ))}

 {/* DYNAMIC NAVIGATION CARD ACTION FORWARD */}
 <Link 
 to={`/collections/${row.slug}/${row.categorySlug}`}
 className="min-w-[200px] flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 transition-colors group"
 >
 <div className="text-center">
 <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
 View All {row.categoryName}
 </span>
 <p className="text-xl mt-2 group-hover:translate-x-2 transition-transform">→</p>
 </div>
 </Link>
 </div>

 </div>
 ))}
 </div>
 </section>
 );
};

export default React.memo(FeaturedCollections);