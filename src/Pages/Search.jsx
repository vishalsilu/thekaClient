import React, { useEffect, useState } from'react';
import { useSearchParams, Link } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { FaSearch, FaLayerGroup, FaBoxOpen, FaRegFolderOpen } from'react-icons/fa';
import { searchEveryThing } from'../Redux/controllers/metaDataController';
import ProductCard from'../Components/CategoryProducts/ProductCard';

const Search = () => {
 const [searchParams] = useSearchParams();
 const query = searchParams.get('query') ||'';
 const collection = searchParams.get('collection');
 const dispatch = useDispatch();
 const searchResult = useSelector((state) => state.metaData.searchResult);
 const [isSearching, setIsSearching] = useState(false);

 useEffect(() => {
 if (!query.trim()) return;
 setIsSearching(true);
 dispatch(
 searchEveryThing({
 query: query.trim(),
 collection: collection && collection !=='All Collections' ? collection : undefined,
 })
 ).finally(() => setIsSearching(false));
 }, [dispatch, query, collection]);

 const products = searchResult?.products || [];
 const categories = searchResult?.categories || [];
 const collections = searchResult?.collections || [];

 // Skeleton Loader for clean light-mode visual feedback
 const RenderSkeleton = () => (
 <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
 <div className="space-y-6">
 <div className="h-48 w-full animate-pulse rounded-2xl bg-stone-100" />
 <div className="h-48 w-full animate-pulse rounded-2xl bg-stone-100" />
 </div>
 <div className="rounded-3xl border border-stone-200 bg-white p-6">
 <div className="mb-6 h-4 w-32 animate-pulse rounded bg-stone-100" />
 <div className="grid gap-4 sm:grid-cols-2">
 {[1, 2, 3, 4].map((n) => (
 <div key={n} className="space-y-3">
 <div className="aspect-[4/5] w-full animate-pulse rounded-2xl bg-stone-100" />
 <div className="h-4 w-2/3 animate-pulse rounded bg-stone-100" />
 <div className="h-4 w-1/3 animate-pulse rounded bg-stone-100" />
 </div>
 ))}
 </div>
 </div>
 </div>
 );

 return (
 <main className="min-h-screen bg-stone-50/50 px-4 py-12 sm:px-6 lg:px-8 font-inter">
 <div className="mx-auto max-w-7xl">
 
 {/* 1. Header Hero Control Panel */}
 <div className="mb-10 rounded-3xl border border-stone-200/80 bg-white p-6 md:p-8 shadow-sm">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <div>
 <span className="text-[10px] font-black uppercase tracking-[0.25em] text-stone-400">Search Workspace</span>
 <h1 className="mt-1 text-3xl font-black tracking-tight text-stone-900 md:text-4xl font-manrope uppercase">
 {query ? (
 <span>Results for <span className="text-stone-500 font-medium italic capitalize">“{query}”</span></span>
 ) : ('Discover Essentials'
 )}
 </h1>
 {collection && collection !=='All Collections' && (
 <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-bold text-stone-600 border border-stone-200/40">
 <FaLayerGroup className="text-[10px] text-stone-400" /> Collection: {collection}
 </div>
 )}
 </div>

 <div className="self-start rounded-2xl bg-stone-900 px-4 py-2.5 text-[10px] font-black tracking-widest text-white shadow-sm sm:self-center uppercase">
 {isSearching ? (
 <span className="flex items-center gap-2">
 <span className="h-2 w-2 animate-ping rounded-full bg-emerald-400"></span> Indexing...
 </span>
 ) : (
 <span>
 {products.length} Products • {collections.length} Catalogues
 </span>
 )}
 </div>
 </div>
 </div>

 {/* 2. Loading State */}
 {query.trim() && isSearching && <RenderSkeleton />}

 {/* 3. Empty Results State */}
 {!isSearching && query.trim() && products.length === 0 && collections.length === 0 && categories.length === 0 && (
 <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white py-20 px-4 text-center shadow-sm">
 <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-stone-50 text-stone-400 border border-stone-100">
 <FaBoxOpen size={20} />
 </div>
 <h3 className="text-xs font-black uppercase tracking-wider text-stone-900">No matches found</h3>
 <p className="mt-2 max-w-xs text-xs text-stone-400 leading-relaxed">
 We couldn't find anything matching"{query}". Try checking your spelling or exploring other categories.
 </p>
 </div>
 )}

 {/* 4. Active Main Results Grid */}
 {!isSearching && query.trim() && (products.length > 0 || collections.length > 0 || categories.length > 0) && (
 <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
 
 {/* Left Column: Aggregated Taxonomy Metadata */}
 <aside className="space-y-6 order-2 lg:order-1">
 
 {/* Collections Cards */}
 {collections.length > 0 && (
 <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
 <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2 border-b border-stone-100 pb-3">
 <FaRegFolderOpen size={12} className="text-stone-400" /> Matches in Collections
 </h2>
 <div className="space-y-2.5">
 {collections.map((col) => (
 <Link
 key={col.id || col._id || col.name}
 to={`/collections/${col.name?.toLowerCase()}`}
 className="group block rounded-2xl border border-stone-100 bg-stone-50/50 p-4 transition-all duration-300 hover:border-stone-900 hover:bg-white hover:shadow-md"
 >
 <p className="font-bold text-stone-800 group-hover:text-stone-900 transition-colors text-xs uppercase tracking-wider">{col.name}</p>
 {col.parentName && <p className="mt-1 text-[11px] text-stone-400 font-medium">{col.parentName}</p>}
 </Link>
 ))}
 </div>
 </div>
 )}

 {/* Categories Cards */}
 {categories.length > 0 && (
 <div className="rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
 <h2 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 flex items-center gap-2 border-b border-stone-100 pb-3">
 <FaLayerGroup size={12} className="text-stone-400" /> Matches in Categories
 </h2>
 <div className="space-y-2.5">
 {categories.map((cat) => (
 <Link
 key={cat.id || cat._id || cat.name}
 to={`/collections/${cat.parentCollection?.name?.toLowerCase() ||'all'}/${cat.name}`}
 className="group block rounded-2xl border border-stone-100 bg-stone-50/50 p-4 transition-all duration-300 hover:border-stone-900 hover:bg-white hover:shadow-md"
 >
 <p className="font-bold text-stone-800 text-xs uppercase tracking-wider">{cat.name}</p>
 <p className="mt-1 text-[11px] text-stone-400 group-hover:text-stone-500 transition-colors">
 Part of {cat.parentCollection?.name ||'Curated Line'}
 </p>
 </Link>
 ))}
 </div>
 </div>
 )}
 </aside>

 {/* Right Column: Dynamic Products Content Shelf */}
 <section className="order-1 lg:order-2 space-y-6">
 {products.length > 0 ? (
 <div className="rounded-3xl border border-stone-200/80 bg-white p-5 sm:p-6 shadow-sm">
 <div className="mb-6 flex items-center justify-between border-b border-stone-100 pb-4">
 <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
 Curated Products ({products.length})
 </h2>
 </div>
 <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2">
 {products.map((product) => (
 <div key={product.id || product._id} className="transition-transform duration-300 hover:-translate-y-1">
 <ProductCard item={product} type={product.type ||'style'} />
 </div>
 ))}
 </div>
 </div>
 ) : (
 <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white py-14 text-center">
 <FaBoxOpen size={22} className="text-stone-300 mb-2" />
 <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">No direct product matches found.</p>
 </div>
 )}
 </section>
 </div>
 )}

 {/* 5. Initial Passive Landing State */}
 {!query.trim() && (
 <div className="flex flex-col items-center justify-center rounded-3xl border border-stone-200 bg-white py-24 px-4 text-center shadow-sm">
 <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-stone-50 text-stone-400 border border-stone-100">
 <FaSearch size={18} />
 </div>
 <h2 className="text-sm font-black uppercase tracking-wider text-stone-900 font-manrope">What are you looking for?</h2>
 <p className="mt-2 max-w-sm text-xs text-stone-400 leading-relaxed">
 Type your search keywords into the navigation bar above to view live products, matching categories, and custom releases.
 </p>
 </div>
 )}
 </div>
 </main>
 );
};

export default Search;