import React, { useEffect, useState } from'react'
import { FaChevronRight, FaUser, FaMoon, FaSun, FaTimes } from'react-icons/fa';
import ActiveSubMenu from'./ActiveSubMenu';
import { useNavigate } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { logout } from'../../Redux/slices/authSlice';
import NavItems from'./NavItems';

const NavModal = ({ isClick, closeModal }) => {
 const { isAuthenticated, user } = useSelector(state => state.auth)
 const dispatch = useDispatch()
 const navigate = useNavigate()
 const [activeSubMenu, setActiveSubMenu] = useState(null);
 const data = useSelector(state => state?.siteData.data.websiteName);

 useEffect(() => {
 if (!isClick) {
 const timer = setTimeout(() => setActiveSubMenu(null), 300);
 return () => clearTimeout(timer);
 }
 }, [isClick]);

 return (
 <div className={`fixed top-0 left-0 w-full sm:w-[75%] max-w-[400px] h-screen bg-surface border-r border-surface shadow-2xl 
 transition-transform duration-300 ease-in-out lg:hidden flex flex-col z-50
 ${isClick ?'translate-x-0' :'-translate-x-full'}`}>
 
 {/* 1. STICKY MOBILE CLOSE HEADER */}
 <div className="flex items-center justify-between p-4 border-b border-surface bg-surface text-primary">
 <span onClick={()=>{navigate('/');closeModal()}} className="font-signature tracking-[0.2em] font-bold text-md">{data ||'Site Name'}</span>
 <button 
 onClick={closeModal} 
 aria-label="Close Menu"
 className="p-2 rounded-full hover:bg-surface-strong transition-colors duration-200 text-primary"
 >
 <FaTimes className="h-5 w-5" />
 </button>
 </div>
 
 {/* 2. SCROLLABLE CONTENT AREA */}
 <div className="flex-1 overflow-y-auto p-6 pb-24 overscroll-contain bg-surface text-primary" style={{ WebkitOverflowScrolling:'touch' }}>
 {activeSubMenu ? (
 <ActiveSubMenu 
 data={activeSubMenu} 
 closeModal={closeModal} 
 backModal={() => setActiveSubMenu(null)} 
 />
 ) : (
 <NavItems 
 isMobile={true} 
 closeModal={closeModal} 
 onSelectSubMenu={(menuData) => setActiveSubMenu(menuData)} 
 />
 )}
 </div>

 {/* 3. FIXED BOTTOM BUTTONS AREA (COMPACT GRID) */}
 <div className="sticky bottom-4 p-4 border-t border-surface bg-surface text-primary" style={{ paddingBottom:'env(safe-area-inset-bottom)' }}>
 {isAuthenticated && user ? (
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => { navigate(`/profile/${user?.id || user?._id ||'USER-001'}`); closeModal() }}
 className='flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-black text-white text-sm font-semibold transition-transform duration-150 active:scale-95'
 aria-label="Open Profile"
 >
 <FaUser className="h-4 w-4" /> Profile
 </button>

 <button
 onClick={() => { navigate('/orders'); closeModal() }}
 className='flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-transparent border border-gray-200 text-primary text-sm font-semibold hover:bg-surface-strong transition-colors duration-150'
 aria-label="My Orders"
 >
 <FaChevronRight className="h-3 w-3" /> Orders
 </button>

 <button
 onClick={() => { navigate('/addresses'); closeModal() }}
 className='flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-transparent border border-gray-200 text-primary text-sm font-semibold hover:bg-surface-strong transition-colors duration-150'
 aria-label="Addresses"
 >
 <FaChevronRight className="h-3 w-3" /> Addresses
 </button>

 <button
 onClick={() => {
    if (window.confirm('Are you sure you want to log out?')) {
        dispatch(logout()); closeModal()
      }
  }}
 className='flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-red-50 text-red-600 text-sm font-semibold transition-colors duration-150'
 aria-label="Logout"
 >
 Logout
 </button>

 {/* Theme toggle removed for mobile nav */}
 </div>
 ) : (
 <div className="grid grid-cols-2 gap-3">
 <button
 onClick={() => { navigate("/login"); closeModal() }}
 className='flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-black text-white text-sm font-semibold transition-transform duration-150 active:scale-95'
 aria-label="Login"
 >
 Login
 </button>

 <button
 onClick={() => { navigate("/signup"); closeModal() }}
 className='flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-transparent border border-gray-200 text-primary text-sm font-semibold hover:bg-surface-strong transition-colors duration-150'
 aria-label="Sign Up"
 >
 Sign Up
 </button>

 {/* Theme toggle removed for mobile nav */}
 </div>
 )}
 </div>
 </div>
 )
}

export default NavModal;