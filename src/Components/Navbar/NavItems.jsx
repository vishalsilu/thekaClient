import { useEffect, useRef, useState } from"react";
import { Pages } from"../../Utils/db";
import { Link, useLocation } from"react-router-dom";
import { FaChevronDown, FaChevronRight } from"react-icons/fa";
import ActiveSubMenu from"./ActiveSubMenu";
import { useSelector } from"react-redux";

const NavItems = ({ isMobile, closeModal }) => {
 const { data } = useSelector((state) => state.siteData);
 const { isAuthenticated } = useSelector((state) => state.auth);
 
 /* FIX: Removed'overflow-x-auto' and'scrollbar-hide' from desktopStyle. 
 Added'relative z-50' to keep link layers clean, static, and on top of page contents. */
 const desktopStyle ="hidden lg:flex flex-wrap items-center gap-6 relative z-50";
 const mobileStyle ="flex w-full justify-start items-center flex-col gap-4 h-auto";
 const [activeSubMenu, setActiveSubMenu] = useState(null);
 const navRef = useRef(null);
 const { collections } = useSelector((state) => state.metaData);
 const location = useLocation();

 // 1. SPLIT THE PAGES
 const homePage = data?.navigationLinks?.find(p => p?.label.toLowerCase() ==='home');
 const otherPages = data?.navigationLinks?.filter(p => p?.label.toLowerCase() !=='home' && p?.label.toLowerCase() !=='collections');

 const renderNavBox = (item, isCollection = false) => {
 const name = item?.label || item?.name ||"";
 const path = isCollection ? `/collections/${name.toLowerCase()}` : item.path;
 const hasSubmenu = isCollection ? item.allCategories : item.categories;
 const isActive = path ==='/' 
 ? location.pathname ==='/' 
 : location.pathname.startsWith(path);

 const linkStyle = `${isActive ?'text-emerald-500' :'text-primary'}`;
 
 // Check if this specific item is the currently open submenu
 const isThisMenuOpen = activeSubMenu && (activeSubMenu === item || (activeSubMenu.label === name || activeSubMenu.name === name));

 return (
 <div
 key={name}
 /* Ensured absolute/relative anchor bindings work nicely together on desk rows */
 className="relative group w-full lg:w-auto flex items-center justify-between border-b lg:border-none border-surface"
 onMouseEnter={() => !isMobile && hasSubmenu && setActiveSubMenu(item)}
 onMouseLeave={() => !isMobile && setActiveSubMenu(null)}
 >
 <Link
 to={path}
 onClick={closeModal}
 className={`${linkStyle} flex-grow text-left py-4 lg:py-3 text-md font-medium relative`}
 >
 <span>{name}</span>
 <span className={`hidden lg:flex absolute bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all duration-500 ${isActive ?'w-full' :'group-hover:w-full'}`}></span>
 </Link>

 {hasSubmenu && (
 <div
 onClick={(e) => {
 e.preventDefault();
 e.stopPropagation();
 setActiveSubMenu(item);
 }}
 className="p-4 cursor-pointer flex items-center justify-center text-primary hover:text-emerald-500"
 >
 {isMobile ? <FaChevronRight /> : <FaChevronDown className="transition-transform duration-200 group-hover:rotate-180" />}
 </div>
 )}

 {/* DESKTOP DROPDOWN RENDERING */}
 {!isMobile && hasSubmenu && (
 <ActiveSubMenu 
 data={item} 
 isCollection={isCollection} 
 closeModal={() => setActiveSubMenu(null)} 
 />
 )}
 </div>
 );
 };

 if (isMobile && activeSubMenu) {
 return (
 <div className={mobileStyle}>
 <ActiveSubMenu 
 data={activeSubMenu} 
 isCollection={!!activeSubMenu.allCategories}
 closeModal={closeModal} 
 backModal={() => setActiveSubMenu(null)} 
 />
 </div>
 );
 }

 return (
 <div ref={navRef} className={isMobile ? mobileStyle : desktopStyle}>
 {/* 1. Render Home First */}
 {homePage && renderNavBox(homePage)}

 {/* 2. Render Dynamic Collections Second */}
 {collections?.length > 0 && collections?.map((col) => renderNavBox(col, true))}

 {/* 3. Render Remaining Pages Last */}
 {otherPages?.map((page) => renderNavBox(page))}
 </div>
 );
};

export default NavItems;