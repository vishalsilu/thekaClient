import React from'react';
import { FaHome, FaTimes } from'react-icons/fa';
import { SlidersHorizontal, Info, Sparkles } from'lucide-react';

import { useCategoryProductsData } from'../Controllers/CategoryProducts/useCategoryProductsData';
import ProductCard from'../Components/CategoryProducts/ProductCard';
import FilterSidebar from'../Components/CategoryProducts/FilterSidebar';
import CustomSort from'../Components/CategoryProducts/CustomSort';
import FeaturedCollection from'../Views/Collection/FeaturedCollections';

const CategoryProducts = () => {
 const {
 type,
 category,
 navigate,
 products,
 loading,
 sortBy,
 isMobileFilterOpen,
 setIsMobileFilterOpen,
 filterOptions,
 activeFilters,
 sortOptions,
 flattenedProducts,
 filteredProducts,
 handleSortChange,
 handleFilterChange,
 clearFilters,
 } = useCategoryProductsData();

 return (
 <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300">
 
 {/* --- MOBILE FILTER SIDE DRAWER PANEL --- */}
 <div className={`fixed inset-0 z-[100] transition-all duration-300 ${isMobileFilterOpen ?'visible' :'invisible'}`}>
 <div
 className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMobileFilterOpen ?'opacity-100' :'opacity-0'}`}
 onClick={() => setIsMobileFilterOpen(false)}
 />
 <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isMobileFilterOpen ?'translate-x-0' :'translate-x-full'}`}>
 <div className="flex flex-col h-full">
 <div className="p-6 border-b border-gray-100 flex justify-between items-center">
 <span className="font-black uppercase tracking-[0.2em] text-xs">Filters</span>
 <button className="p-1 text-gray-500 hover:text-black transition-colors" onClick={() => setIsMobileFilterOpen(false)}>
 <FaTimes size={16} />
 </button>
 </div>
 <div className="flex-1 overflow-y-auto p-6">
 <FilterSidebar filterOptions={filterOptions} activeFilters={activeFilters} onFilterChange={handleFilterChange} onClear={clearFilters} />
 </div>
 <div className="p-4 border-t border-gray-100">
 <button
 onClick={() => setIsMobileFilterOpen(false)}
 className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-[0.2em]"
 >
 View {filteredProducts.length} Products
 </button>
 </div>
 </div>
 </div>
 </div>

 <div className="mx-auto max-w-[1400px] px-4 md:px-8">
 
 {/* --- BREADCRUMBS --- */}
 <div className="flex items-center gap-3 py-6 text-[10px] font-bold uppercase tracking-[0.2em] border-b border-gray-100">
 <FaHome className="text-gray-400 hover:text-black cursor-pointer transition-colors" onClick={() => navigate('/')} />
 <span className="text-gray-300">/</span>
 <span className="text-gray-400 cursor-pointer hover:text-black transition-colors" onClick={() => navigate(`/collections/${type}`)}>
 {type}
 </span>
 <span className="text-gray-300">/</span>
 <p className="text-black">{category}</p>
 </div>

 {products.length > 0 ? (
 <>
 {/* --- SEARCH HEADER VIEWPORT --- */}
 <header className="text-center">
 <h1 className="text-4xl md:text-6xl font-extralight uppercase tracking-[0.25em] text-gray-900">{category}</h1>
 <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mt-4 max-w-md mx-auto leading-relaxed">
 Explore our curated selection of {type}'s {category} design essentials
 </p>
 </header>

 {/* --- DYNAMIC UTILITY AND CONTROLS BAR --- */}
 <div className="flex justify-between items-center py-4 border-t border-b border-gray-100 mb-8">
 <button
 onClick={() => setIsMobileFilterOpen(true)}
 className="lg:hidden flex items-center gap-2 border border-black px-5 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95"
 >
 <SlidersHorizontal size={12} /> Filters
 </button>
 <div className="hidden lg:block w-[280px]">
 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{flattenedProducts.length} Styles Available</p>
 </div>
 <CustomSort options={sortOptions} value={sortBy} onChange={handleSortChange} />
 </div>

 {/* --- CENTRAL CORE PRESENTATION LAYOUT GRID --- */}
 <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 pb-20">
 <aside className="hidden lg:block sticky top-6 h-fit">
 <FilterSidebar filterOptions={filterOptions} activeFilters={activeFilters} onFilterChange={handleFilterChange} onClear={clearFilters} />
 </aside>
 <main>
 {loading ? (
 <div className="flex justify-center items-center h-72">
 <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-black" />
 </div>
 ) : flattenedProducts.length > 0 ? (
 <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-12">
 {flattenedProducts.map((item) => (
 <ProductCard key={`${item.id}-${item.variantId ||'base'}`} item={item} type={type} />
 ))}
 </div>
 ) : (
 /* ACTIVE FILTER SEARCH EMPTY STATE VIEW */
 <div className="text-center py-20 px-4 bg-gray-50/60 rounded-2xl border border-dashed border-gray-200">
 <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4 text-gray-400">
 <SlidersHorizontal size={20} />
 </div>
 <h3 className="text-sm font-bold uppercase tracking-widest text-gray-800">No Filter Matches</h3>
 <p className="text-xs text-gray-400 max-w-xs mx-auto mt-2 leading-relaxed">
 We couldn't find any items matching your active specifications. Try resetting your choices.
 </p>
 <button onClick={clearFilters} className="mt-6 inline-flex px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-black text-white rounded-md active:scale-95">
 Reset Filters
 </button>
 </div>
 )}
 </main>
 </div>
 </>
 ) : (
 <div className="w-full pt-6 pb-20">
 <div className="w-full bg-zinc-50 border border-zinc-200/60 rounded-xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12 shadow-sm">
 <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
 <div className="p-2.5 bg-blue-500/10 text-blue-600 rounded-full shrink-0">
 <Info size={20} />
 </div>
 <div>
 <h2 className="text-xs font-black uppercase tracking-wider text-zinc-800">
 {category} Inventory Alert
 </h2>
 <p className="text-xs text-zinc-500 mt-0.5">
 We currently don't have any matching products in this specific category loop. Restocking and new seasonal lines are deploying soon!
 </p>
 </div>
 </div>
 <button 
 onClick={() => navigate('/')} 
 className="shrink-0 px-4 py-2 border border-zinc-300 hover:border-black text-[10px] font-black uppercase tracking-widest rounded transition-colors bg-white shadow-sm"
 >
 Back To Store
 </button>
 </div>

 {/* RE-ENGAGEMENT PRESENTATION LAYER GRID */}
 <div className="w-full">
 <div className="flex items-center gap-2 mb-8 justify-center sm:justify-start">
 <Sparkles size={16} className="text-amber-500" />
 <h3 className="text-sm font-black uppercase tracking-[0.25em] text-zinc-800">
 Instead, Check Out Our Featured Collections
 </h3>
 </div>
 <div className="w-full">
 <FeaturedCollection />
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 );
};

export default CategoryProducts;