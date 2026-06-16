import React, { useState, useEffect } from'react';
import { FaSearch, FaTimes, FaRegFrown, FaArrowRight, FaLayerGroup } from"react-icons/fa";
import { Link, useNavigate } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { searchEveryThing } from'../../Redux/controllers/metaDataController';
import { cleanResult } from'../../Redux/slices/metaDataSlice';

const SearchModal = ({ closeModal }) => {
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedCollection, setSelectedCollection] = useState('All Collections');
 const [isSearching, setIsSearching] = useState(false);
 
 const dispatch = useDispatch();
 const navigate = useNavigate();

 const searchResult = useSelector(state => state.metaData.searchResult);
 const collections = useSelector(state => state.metaData.collections);

 useEffect(() => {
 if (!searchTerm.trim()) {
 dispatch(cleanResult());
 setIsSearching(false);
 return;
 }

 setIsSearching(true);
 const delayDebounceFn = setTimeout(() => {
 dispatch(searchEveryThing({ 
 query: searchTerm.trim(), 
 collection: selectedCollection ==='All Collections' ? undefined : selectedCollection 
 })).finally(() => setIsSearching(false));
 }, 400);

 return () => clearTimeout(delayDebounceFn);
 }, [searchTerm, selectedCollection, dispatch]);

 const handleSearchRedirect = () => {
 if (!searchTerm.trim()) return;
 closeModal();
 navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}&collection=${encodeURIComponent(selectedCollection)}`);
 };
 

 return (
 <div className='z-[1000] fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start'>
 <div className='w-full lg:w-[700px] bg-white lg:mt-10 lg:rounded-3xl flex flex-col shadow-2xl max-h-[100dvh] lg:max-h-[85vh] overflow-hidden animate-in slide-in-from-top-5 duration-300'>
 
 <form 
 onSubmit={(e) => {
 e.preventDefault();
 handleSearchRedirect();
 }}
 className="p-4 border-b border-gray-200"
 >
 <div className="flex w-full items-center gap-2 rounded-3xl border border-gray-200 bg-gray-50 px-3 py-1.5">
 
 <select
 value={selectedCollection}
 onChange={(e) => setSelectedCollection(e.target.value)}
 className="rounded-full border border-transparent bg-transparent px-2 py-2 text-sm font-semibold text-slate-700 outline-none transition cursor-pointer max-w-[150px] truncate"
 >
 <option>All Collections</option>
 {collections?.map((cat,index) => (
 <option key={cat.id + index || cat._id + index || cat.name + index} value={cat.name}>{cat.name}</option>
 ))}
 </select>
 
 <input
 autoFocus
 type="text"
 placeholder='Search styles or collections...'
 className='flex-1 bg-transparent py-2 text-base font-medium outline-none text-slate-900 placeholder:text-slate-400'
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />

 <div className="flex items-center justify-center min-w-[40px]">
 {!searchTerm.trim() ? (
 <button 
 type="button"
 onClick={closeModal} 
 className='rounded-full bg-slate-100 p-2 text-slate-500 transition-all duration-200 hover:bg-slate-200'
 >
 <FaTimes size={16} />
 </button>
 ) : (
 <button
 type="submit"
 className="rounded-full bg-emerald-500 p-2 text-white transition-all duration-200 hover:bg-emerald-600 shadow-md flex items-center justify-center animate-in fade-in zoom-in-75 duration-200"
 title="Search"
 >
 <FaSearch size={14} />
 </button>
 )}
 </div>
 </div>
 </form>

 <div className='flex-1 overflow-y-auto bg-white p-4 custom-scrollbar'>
 
 {!searchTerm && !isSearching && (
 <div className="py-10 text-center">
 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Quick Search</p>
 <div className="flex flex-wrap justify-center gap-2 mt-4">
 {collections?.map((cat, index) => (
 <button 
 type="button"
 key={cat?.id + index || cat?.name + index}
 onClick={() => setSearchTerm(cat?.name)}
 className="px-4 py-2 bg-gray-100 rounded-full text-xs font-bold text-slate-700 transition hover:bg-emerald-500 hover:text-white"
 >
 {cat?.name}
 </button>
 ))}
 </div>
 </div>
 )}

 {isSearching && (
 <div className="py-12 flex flex-col items-center justify-center gap-3">
 <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
 <p className="text-xs text-gray-400 font-medium animate-pulse">Searching matching assets...</p>
 </div>
 )}

 {!isSearching && searchTerm && (
 <div className="space-y-8">
 
 {searchResult?.collections?.length > 0 && (
 <div>
 <p className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest flex items-center gap-2">
 <FaLayerGroup /> Collections
 </p>
 <div className="grid grid-cols-2 gap-3">
 {searchResult.collections.map((cat, idx) => (
 <Link 
 to={`/collections/${cat?.name?.toLowerCase()}`} 
 key={cat.id + idx || cat._id + idx || idx} 
 onClick={closeModal}
 className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-500 hover:text-white transition-all group"
 >
 <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
 <img src={cat.image} alt="" className="w-full h-full object-cover" />
 </div>
 <div className="min-w-0 flex-1">
 {cat.parentName && <p className="text-[10px] font-bold uppercase opacity-60 truncate">{cat.parentName}</p>}
 <p className="text-xs font-bold uppercase truncate">{cat.name}</p>
 </div>
 </Link>
 ))}
 </div>
 </div>
 )}

 {searchResult?.categories?.length > 0 && (
 <div>
 <p className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest flex items-center gap-2">
 <FaLayerGroup /> Categories
 </p>
 <div className="grid grid-cols-2 gap-3">
 {searchResult.categories.map((cat, idx) => (
 <Link 
 to={`/collections/${cat?.parentCollection?.name ||"all"}/${cat?.name}`} 
 key={cat.id + idx || cat._id + idx || idx} 
 onClick={closeModal}
 className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-500 hover:text-white transition-all group"
 >
 <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
 <img src={cat.image} alt="" className="w-full h-full object-cover" />
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-[10px] font-bold uppercase opacity-60 truncate">{cat.parentCollection?.name ||"Collection"}</p>
 <p className="text-xs font-bold uppercase truncate">{cat.name}</p>
 </div>
 </Link>
 ))}
 </div>
 </div>
 )}

 {searchResult?.products?.length > 0 && (
 <div className="space-y-2">
 <p className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest">
 Products
 </p>
 <div className="flex flex-col gap-1">
 {searchResult.products.map((product , index) => {
 const prodId = product.id || product._id;
 const collection = product?.collectionInfo?.name
 const variantQuery = product.variantId 
 ? `?variant=${product.variantId}${product.size ? `&size=${product.size}` :''}` 
 : product.selectedColor 
 ? `?color=${encodeURIComponent(product.selectedColor)}${product.size ? `&size=${product.size}` :''}` 
 :'';

 return (
 <Link 
 key={prodId + index} 
 to={`/product/${collection}/${prodId}${variantQuery}`}
 onClick={closeModal}
 className="flex items-center gap-3 group py-2 rounded-xl px-2 hover:bg-gray-100 transition-colors"
 >
 <div className="w-12 h-12 overflow-hidden rounded bg-gray-200 flex-shrink-0">
 <img 
 src={product.thumbnail || product.images?.[0]} 
 alt={product.name} 
 className="w-full h-full object-cover" 
 />
 </div>
 
 <div className="flex-1 min-w-0">
 <h4 className="font-bold text-xs uppercase tracking-tight text-slate-900 truncate group-hover:text-emerald-500 transition-colors">
 {product.name}
 </h4>
 <p className="text-slate-400 text-[10px] font-bold mt-0.5 truncate">
 {product.type ||'Style'} • {product.category ||'General'} • ₹{product.price}
 </p>
 </div>

 <FaArrowRight 
 size={12} 
 className="text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all mr-2 flex-shrink-0" 
 />
 </Link>
 );
 })}
 </div>
 </div>
 )}

 {(!searchResult?.products || searchResult.products.length === 0) && 
 (!searchResult?.collections || searchResult.collections.length === 0) && 
 (!searchResult?.categories || searchResult.categories.length === 0) && (
 <div className="flex flex-col items-center justify-center py-16 text-center">
 <FaRegFrown size={24} className="text-slate-400 mb-4" />
 <p className="font-bold text-sm text-slate-800 uppercase tracking-wider">No matches found</p>
 <p className="text-xs text-gray-400 mt-1">We couldn't find items matching"{searchTerm}"</p>
 </div>
 )}
 </div>
 )}
 </div>
 </div>
 </div>
 );
};

export default SearchModal;