import React, { useState, useEffect, useRef, useMemo } from'react';
import { 
 FaShoppingBag, FaUser, FaBars, FaSearch, FaTimes, FaLock, 
 FaSignOutAlt, FaSignInAlt, FaArchive, FaShoppingCart, FaLayerGroup, 
 FaRegFrown, FaArrowRight, FaMapMarkerAlt
} from'react-icons/fa';
import NavItems from'./NavItems';
import NavModal from'./NavModal';
import SearchModal from'./SearchModal';
import { FaBagShopping, FaPencil } from'react-icons/fa6';
import { useNavigate, Link } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { selectTotalQuantity } from'../../Redux/slices/cartSlice';
import { handleLogoutProcess } from'../../Redux/controllers/crudUser';
import { MapPin } from'lucide-react';
import { motion, AnimatePresence } from'framer-motion';
import { searchEveryThing } from'../../Redux/controllers/metaDataController';
import { cleanResult } from'../../Redux/slices/metaDataSlice';
import AnnouncementBar from'./AnnouncementBar';

const Navbar = () => {
 const dispatch = useDispatch();
 const [isClick, setIsClick] = useState(false);
 const [isSearchClick, setIsSearchClick] = useState(false);
 const [searchTerm, setSearchTerm] = useState('');
 const [searchCollection, setSearchCollection] = useState('All Collections');
 const [isSearchFocused, setIsSearchFocused] = useState(false);
 const [isSearching, setIsSearching] = useState(false);
 const [isUserHovered, setIsUserHovered] = useState(false); // Hover handler state for user dropdown
 const { isAuthenticated, user } = useSelector((state) => state.auth);
 const totalUnits = useSelector(selectTotalQuantity);
 const navigate = useNavigate();
 
 const [isHeaderVisible, setIsHeaderVisible] = useState(true);
 const [lastScrollY, setLastScrollY] = useState(0);

 const Data = useSelector(state => state.siteData.data);
 const collections = useSelector(state => state.metaData.collections);
 const searchResult = useSelector(state => state.metaData.searchResult);
 const searchRef = useRef(null);

 const topOffers = Data?.topOffers || [];
 const [currentIndex, setCurrentIndex] = useState(0);

 useEffect(() => {
 const handleScroll = () => {
 const currentScrollY = window.scrollY;

 if (currentScrollY <= 60) {
 setIsHeaderVisible(true);
 setLastScrollY(currentScrollY);
 return;
 }

 const scrollDifference = currentScrollY - lastScrollY;
 if (Math.abs(scrollDifference) < 25) return;

 if (scrollDifference > 0) {
 setIsHeaderVisible(false); 
 } else {
 setIsHeaderVisible(true);
 }

 setLastScrollY(currentScrollY);
 };

 window.addEventListener('scroll', handleScroll, { passive: true });
 return () => window.removeEventListener('scroll', handleScroll);
 }, [lastScrollY]);

 useEffect(() => {
 if (topOffers.length <= 1) return;

 const interval = setInterval(() => {
 setCurrentIndex((prevIndex) => (prevIndex + 1) % topOffers.length);
 }, 15000);

 return () => clearInterval(interval);
 }, [topOffers.length]);

 useEffect(() => {
 const listener = (event) => {
 if (searchRef.current && !searchRef.current.contains(event.target)) {
 setIsSearchFocused(false);
 }
 };

 document.addEventListener('mousedown', listener);
 return () => document.removeEventListener('mousedown', listener);
 }, []);

 useEffect(() => {
 if (!searchTerm.trim()) {
 dispatch(cleanResult());
 return;
 }

 setIsSearching(true);
 const timeout = setTimeout(() => {
 dispatch(searchEveryThing({ 
 query: searchTerm.trim(), 
 collection: searchCollection !=='All Collections' ? searchCollection : undefined 
 })).finally(() => setIsSearching(false));
 }, 350);

 return () => clearTimeout(timeout);
 }, [searchTerm, searchCollection, dispatch]);

 const normalizedSearch = useMemo(() => {
 const safeResult = !searchResult || Array.isArray(searchResult) 
 ? { products: [], categories: [], collections: [] } 
 : searchResult;

 if (searchCollection ==='All Collections') {
 return safeResult;
 }

 const normalizedCollection = searchCollection.toLowerCase();

 return {
 products: safeResult.products?.filter(item => item.collectionInfo?.name?.toLowerCase() === normalizedCollection) || [],
 categories: safeResult.categories?.filter(item => item.parentCollection?.name?.toLowerCase() === normalizedCollection) || [],
 collections: safeResult.collections?.filter(item => item.name?.toLowerCase() === normalizedCollection) || [],
 };
 }, [searchCollection, searchResult]);

 const handleCollectionChange = (event) => {
 setSearchCollection(event.target.value);
 };

 const handleSearchSubmit = (e) => {
 e.preventDefault();
 if (searchTerm.trim()) {
 setIsSearchFocused(false);
 navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}&collection=${encodeURIComponent(searchCollection)}`);
 }
 };
 

 return (
 <div 
 className="sticky top-0 z-50 w-full transition-transform duration-300 ease-in-out will-change-transform"
 style={{
 transform: isHeaderVisible
 ?'translateY(0)'
 : `translateY(var(--nav-transform, calc(-100% + 48px)))`
 }}
 >
 <style>{`
 @media (max-width: 1023px) {
 div { --nav-transform: translateY(0) !important; }
 }
 `}</style>
 
 {/* 1. TOP OFFERS BANNER */}
 {topOffers.length > 0 && (
 <AnnouncementBar 
 topOffers={topOffers} 
 currentIndex={currentIndex} 
 isVisible={isHeaderVisible} 
 />
 )}

 {/* 2. MAIN NAVBAR CONTAINER */}
 <div className="h-auto w-full text-primary border-b border-surface shadow-theme bg-surface">
 
 {/* FIRST DIV: Logo, Search, Actions */}
 <div className={`relative flex items-center justify-between lg:gap-3 px-4 py-3 lg:px-6 lg:py-4 lg:transition-opacity lg:duration-200 ${
 isHeaderVisible ?'opacity-100 pointer-events-auto' :'lg:opacity-0 lg:pointer-events-none'
 }`}>
 
 {/* LEFT CONTAINER: Mobile Toggle Button */}
 <div className="flex items-center justify-start z-10 lg:w-auto">
 <div className="flex-shrink-0 flex lg:hidden">
 <button onClick={() => setIsClick(!isClick)} aria-label="Toggle Menu">
 {isClick ? <FaTimes className='h-5 w-5 text-primary' /> : <FaBars className='h-5 w-5 text-primary' />}
 </button>
 </div>
 </div>
 
 {/* CENTER CONTAINER: Brand Logo */}
 <div 
 className="absolute py-2 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[50%] lg:max-w-none lg:static lg:left-0 lg:top-0 lg:translate-x-0 lg:translate-y-0 text-lg font-bold flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer" 
 onClick={() => navigate('/')}
 > 
 {!Data?.websiteName && Data?.logoUrl ? (
 <img 
 src={Data.logoUrl} 
 alt={Data?.websiteName ||"Logo"} 
 className="h-10 lg:h-11 w-auto max-h-full object-contain transition-all duration-300 invert block" 
 />
 ) : (
 <h1 className="text-primary font-signature text-xl lg:text-2xl capitalize tracking-normal antialiased whitespace-nowrap text-ellipsis flex items-center py-1">
 {Data?.websiteName}
 </h1>
 )}
 </div>

 {/* DESKTOP SEARCH BAR */}
 <div className="hidden lg:flex flex-1 justify-center px-4">
 <div ref={searchRef} className="relative w-full max-w-[820px]">
 <form onSubmit={handleSearchSubmit} className="flex h-14 items-center gap-2 rounded-full border border-gray-200 bg-white px-2 text-sm shadow-sm transition-all duration-300">
 <div className="flex w-[170px] items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-700">
 <FaLayerGroup className="h-4 w-4" />
 <span className="truncate">{searchCollection}</span>
 </div>

 <select
 value={searchCollection}
 onChange={handleCollectionChange}
 className="h-full rounded-full border border-gray-200 bg-white px-4 text-xs font-semibold text-slate-700 outline-none transition-colors duration-200 hover:border-gray-300"
 >
 <option>All Collections</option>
 {collections?.map((col , index) => (
 <option key={col.id + index || col._id + index || col.name + index} value={col.name}>{col.name}</option>
 ))}
 </select>

 <input
 type="text"
 placeholder="Search products, collections or categories"
 className="flex-1 bg-white px-4 py-3 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 onFocus={() => setIsSearchFocused(true)}
 />

 <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition hover:bg-zinc-800" aria-label="Submit Search">
 <FaSearch className='h-4 w-4' />
 </button>
 </form>

 <AnimatePresence>
 {isSearchFocused && (
 <motion.div 
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 10 }}
 className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl text-primary max-h-[480px] overflow-y-auto custom-scrollbar"
 >
 {/* 1. LOADING STATE */}
 {isSearching ? (
 <div className="p-8 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
 <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
 <span>Searching...</span>
 </div>
 ) : (
 <div className="space-y-6">
 {/* 2. NO RESULTS / EMPTY STATE */}
 {(!normalizedSearch?.products || normalizedSearch.products.length === 0) && 
 (!normalizedSearch?.categories || normalizedSearch.categories.length === 0) && 
 (!normalizedSearch?.collections || normalizedSearch.collections.length === 0) ? (
 <div className="flex flex-col items-center justify-center py-10 text-center">
 <FaRegFrown size={24} className="text-slate-400 mb-3" />
 <p className="font-bold text-xs text-primary uppercase tracking-wider">No matches found</p>
 <p className="text-xs text-gray-400 mt-1">No results found for"{searchTerm}"</p>
 </div>
 ) : (
 <>
 {/* 3. COLLECTIONS RESULTS SECTION */}
 {normalizedSearch?.collections?.length > 0 && (
 <div>
 <p className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest flex items-center gap-2">
 <FaLayerGroup /> Collections
 </p>
 <div className="grid grid-cols-2 gap-3">
 {normalizedSearch.collections.slice(0, 4).map((col, idx) => {
 const colId = col.id || col._id;
 const colName = col.name || col.label ||"";
 return (
 <Link 
 to={`/collections/${colName.toLowerCase()}`} 
 key={colId + idx || idx} 
 onClick={() => setIsSearchFocused(false)}
 className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-500 hover:text-white transition-all group"
 >
 <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
 <img src={col.image ||""} alt="" className="w-full h-full object-cover" />
 </div>
 <div className="min-w-0 flex-1">
 {col.parentName && <p className="text-[10px] font-bold uppercase opacity-60 truncate">{col.parentName}</p>}
 <p className="text-xs font-bold uppercase truncate">{colName}</p>
 </div>
 </Link>
 );
 })}
 </div>
 </div>
 )}

 {/* 4. CATEGORIES RESULTS SECTION */}
 {normalizedSearch?.categories?.length > 0 && (
 <div>
 <p className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest flex items-center gap-2">
 <FaLayerGroup /> Categories
 </p>
 <div className="grid grid-cols-2 gap-3">
 {normalizedSearch.categories.map((cat, idx) => {
 const catId = cat.id || cat._id;
 return (
 <Link 
 to={`/collections/${cat?.parentCollection?.name ||"all"}/${cat?.name}`} 
 key={catId + idx || idx} 
 onClick={() => setIsSearchFocused(false)}
 className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-500 hover:text-white transition-all group"
 >
 <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
 <img src={cat.image ||""} alt="" className="w-full h-full object-cover" />
 </div>
 <div className="min-w-0 flex-1">
 <p className="text-[10px] font-bold uppercase opacity-60 truncate">{cat.parentCollection?.name ||"Collection"}</p>
 <p className="text-xs font-bold uppercase truncate">{cat.name}</p>
 </div>
 </Link>
 );
 })}
 </div>
 </div>
 )}

 {/* 5. PRODUCTS RESULTS SECTION */}
 {normalizedSearch?.products?.length > 0 && (
 <div className="space-y-2">
 <p className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest">
 Products
 </p>
 <div className="divide-y divide-gray-50">
 {normalizedSearch.products.slice(0, 5).map((prod, index) => {
 const prodId = prod.id || prod._id;
 const productImg = prod.thumbnail || prod.images?.[0];
 const collection = prod.collectionInfo?.name.toLowerCase() ;
 
 const variantQuery = prod.variantId 
 ? `?variant=${prod.variantId}${prod.size ? `&size=${prod.size}` :''}` 
 : prod.selectedColor 
 ? `?color=${encodeURIComponent(prod.selectedColor)}${prod.size ? `&size=${prod.size}` :''}` 
 :'';

 return (
 <Link 
 key={prodId + index} 
 to={`/product/${collection}/${prodId}${variantQuery}`}
 onClick={() => setIsSearchFocused(false)}
 className="flex items-center gap-3 group py-2.5 first:pt-0 last:pb-0"
 >
 <div className="w-12 h-12 overflow-hidden rounded bg-gray-50 flex-shrink-0">
 <img 
 src={productImg} 
 alt={prod.name} 
 className="w-full h-full object-cover" 
 />
 </div>
 
 <div className="flex-1 min-w-0">
 <h4 className="font-bold text-xs uppercase tracking-tight text-slate-900 truncate group-hover:text-emerald-500 transition-colors">
 {prod.name}
 </h4>
 <p className="text-slate-400 text-[10px] font-bold mt-0.5 truncate">
 {prod.type ||'Style'} • {prod.category ||'General'} • ₹{prod.price}
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
 </>
 )}
 </div>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>

 {/* RIGHT CONTAINER: Mobile Search + Cart Actions */}
 <div className="flex items-center justify-end gap-3 z-10 lg:hidden">
 <button onClick={() => setIsSearchClick(true)} aria-label="Search Open" className='flex h-9 w-9 items-center justify-center rounded-full border border-surface bg-surface text-slate-700 transition hover:border-slate-300 hover:bg-surface-strong'>
 <FaSearch className='h-4 w-4' />
 </button>

 <div className="relative cursor-pointer group p-1 flex items-center justify-center h-9 w-9" onClick={() => navigate('/cart')}>
 <FaShoppingCart className='h-5 w-5 text-primary transition-colors duration-300' />
 {totalUnits > 0 && (
 <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-black text-white">
 {totalUnits >= 99 ?'99+' : totalUnits}
 </span>
 )}
 </div>
 </div>

 {/* DESKTOP ACTIONS CONTAINER */}
 <div className="hidden lg:flex items-center justify-end gap-4 lg:w-auto">
 {/* Theme toggle removed per request */}
 
 {/* PERSISTENT DESKTOP CART BUTTON */}
 <div className="relative cursor-pointer group p-2 flex items-center justify-center h-9 w-9 rounded-full hover:bg-gray-100 transition-colors" onClick={() => navigate('/cart')} title="View Cart">
 <FaShoppingCart className='h-5 w-5 text-primary' />
 {totalUnits > 0 && (
 <span className="absolute top-0 right-0 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-emerald-500 px-1 text-[9px] font-black text-white">
 {totalUnits >= 99 ?'99+' : totalUnits}
 </span>
 )}
 </div>
 
 {/* USER PORTAL PROFILE WITH ACCURATE DROPDOWN ON HOVER */}
 <div 
 className="relative py-2"
 onMouseEnter={() => setIsUserHovered(true)}
 onMouseLeave={() => setIsUserHovered(false)}
 >
 {isAuthenticated ? (
 <>
 <div className="flex items-center gap-2 text-sm font-medium text-primary cursor-pointer hover:opacity-80">
 <FaUser className="h-4 w-4" />
 <span className="max-w-[100px] truncate">{user?.fullName ||"User"}</span>
 </div>

 {/* HOVER DROP-DOWN MENU CONTAINER */}
 <AnimatePresence>
 {isUserHovered && (
 <motion.div
 initial={{ opacity: 0, y: 8 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 8 }}
 transition={{ duration: 0.15 }}
 className="absolute right-0 top-full mt-1 w-64 bg-white text-slate-800 rounded-2xl shadow-xl border border-gray-100 p-5 z-50 overflow-hidden"
 >
 {/* Header: User Meta Details */}
 <div className="mb-4">
 <h3 className="text-base font-bold text-slate-900 leading-tight truncate">
 {user?.fullName ||"User"}
 </h3>
 <p className="text-xs text-slate-400 mt-0.5 truncate">
 {user?.email ||"user@example.com"}
 </p>
 </div>

 {/* List Actions Layout matching screenshot */}
 <div className="space-y-3 font-semibold text-sm">
 <Link to="/collections" className="flex items-center gap-3 py-1 text-slate-800 hover:text-emerald-500 transition-colors">
 <FaBagShopping className="h-4 w-4 text-slate-900" />
 <span>Shop</span>
 </Link>
 <Link to={`/profile/${user?.id}`} className="flex items-center gap-3 py-1 text-slate-800 hover:text-emerald-500 transition-colors">
 <FaUser className="h-4 w-4 text-slate-900" />
 <span>Profile</span>
 </Link>
 <Link to="/orders" className="flex items-center gap-3 py-1 text-slate-800 hover:text-emerald-500 transition-colors">
 <FaArchive className="h-4 w-4 text-slate-900" />
 <span>My Orders</span>
 </Link>
 <Link to="/addresses" className="flex items-center gap-3 py-1 text-slate-800 hover:text-emerald-500 transition-colors">
 <FaMapMarkerAlt className="h-4 w-4 text-slate-900" />
 <span>Addresses</span>
 </Link>

 <hr className="border-gray-100 my-2" />

 <button 
 onClick={() => dispatch(handleLogoutProcess())} 
 className="w-full flex items-center gap-3 py-1 text-slate-800 hover:text-red-500 transition-colors text-left"
 >
 <FaSignOutAlt className="h-4 w-4 text-slate-900 rotate-180" />
 <span>Logout</span>
 </button>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </>
 ) : (
 <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-primary text-surface rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
 <FaSignInAlt className="h-4 w-4" />
 <span>Login</span>
 </Link>
 )}
 </div>
 </div>
 </div>

 {/* SECOND DIV: LOWER DESKTOP NAVIGATION LINKS */}
 <div className="hidden lg:flex relative z-40 items-center gap-6 px-4 h-12 border-t border-surface bg-surface text-primary">
 
 {/* DYNAMIC SCROLL LOGO INSERTION */}
 {!isHeaderVisible && (
 <div 
 className="flex items-center gap-2 flex-shrink-0 cursor-pointer pr-2 border-r border-gray-200 animate-fadeIn animate-duration-200" 
 onClick={() => navigate('/')}
 >
 {!Data?.websiteName && Data?.logoUrl ? (
 <img 
 src={Data.logoUrl} 
 alt={Data?.websiteName ||"Logo"} 
 className="h-7 w-auto object-contain invert" 
 />
 ) : (
 <h1 className="text-primary font-signature font-bold text-xl md:text-xl capitalize tracking-normal antialiased whitespace-nowrap">
 {Data?.websiteName}
 </h1>
 )}
 </div>
 )}

 <NavItems isMobile={false} />
 </div>

 {/* Dynamic Modals Layer */}
 {isSearchClick && <SearchModal closeModal={() => setIsSearchClick(false)} />}
 
 <NavModal isClick={isClick} closeModal={() => setIsClick(false)}>
 <NavItems isMobile={true} closeModal={() => setIsClick(false)} />
 </NavModal>
 </div>
 </div>
 );
};

export default Navbar;