import React, { useEffect } from'react';
import { Route, Routes } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';

// Layout & Pages
import ProtectedRoute from'./Utils/ProtectedRoute';

import Navbar from'./Components/Navbar/Navbar';
import Footer from'./Components/Footer/Footer';
import Home from'./Pages/Home';
import About from'./Pages/About';
import Collection from'./Pages/Collection';
import Models from'./Pages/CategoryProducts';
import Product from'./Pages/Product';
import Search from'./Pages/Search';
import ContactUs from'./Pages/ContactUs';
import Cart from'./Pages/Cart';
import Profile from'./Pages/Profile';
import Auth from'./Pages/Auth';
import CheckoutPage from'./Pages/Checkout';
import OrdersPage from'./Pages/Orders';
import Addresses from'./Pages/Addresses';
import OrderDetail from'./Components/Profile/OrderDetail';
import ThankYou from'./Components/Profile/ThankYou';

// Modals & Utils
import InfoModal from'./Modals/InfoModal';
import ScrollToTop from'./Utils/ScrollToTop';

// Redux Controllers
import { getMe } from'./Redux/controllers/crudUser';
import { getCollections } from'./Redux/controllers/metaDataController';
import ProductDetail from'./Components/Products/ProductDetailModal';
import { getCart } from'./redux/controllers/cartController';
import { Toaster } from'react-hot-toast';
import { fetchSiteData } from'./Redux/thunks/siteDataThunks';
import RateAndReview from'./Pages/RateAndReview';
import HomeSkeleton from'./Components/Home/HomeSkeleton';
import { useOnlineStatus } from'./Utils/useOnlineStatus';

const App = () => {
 const { token, isAuthenticated } = useSelector((state) => state.auth);
 const {data,isLoading} = useSelector((state) => state.siteData);
 const dispatch = useDispatch();

 const isOnline = useOnlineStatus();

 useEffect(() => {
 dispatch(getCollections());
 }, [dispatch]);
 useEffect(() => {
 dispatch(fetchSiteData());
 }, []);


 useEffect(() => {
 dispatch(getMe());
 dispatch(getCart());
 }, [dispatch]);

 useEffect(() => {
 const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
 
 if (isIOS) {
 const metaViewport = document.querySelector('meta[name=viewport]');
 if (!metaViewport) return;

 const originalContent = metaViewport.getAttribute('content');

 const addMaximumScaleToMeta = (e) => {
 if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) {
 metaViewport.setAttribute('content','width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
 );
 }
 };

 const removeMaximumScaleFromMeta = (e) => {
 if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) {
 setTimeout(() => {
 metaViewport.setAttribute('content', originalContent);
 }, 100);
 }
 };

 document.addEventListener('focusin', addMaximumScaleToMeta);
 document.addEventListener('focusout', removeMaximumScaleFromMeta);

 return () => {
 document.removeEventListener('focusin', addMaximumScaleToMeta);
 document.removeEventListener('focusout', removeMaximumScaleFromMeta);
 metaViewport.setAttribute('content', originalContent);
 };
 }
}, []);

 if(!data || isLoading ){
 return(
 <HomeSkeleton/>
 )
}

 return (
 <>
 {!isOnline && (
 <div style={{ backgroundColor:'red', color:'white', textAlign:'center', padding:'10px' }}>
 You are currently offline. Some features may be unavailable.
 </div>
 )}
 
 <ScrollToTop />
 
 <Navbar />

 <Toaster position="top-right" />
 <Routes>
 {/* Core Pages */}
 <Route path="/" element={<Home />} />
 <Route path="/about-us" element={<About />} />
 <Route path="/contact-us" element={<ContactUs />} />
 {/* <Route path="/contact-us" element={<WhatsAppContactExample />} /> */}
 
 {/* Collection & Product Logic */}
 <Route path="/product/:type/:id" element={<Product/>}/>
 <Route path="/search" element={<Search />} />
 <Route path="/collections" element={<Collection />} />
 <Route path="/collections/:type/:category" element={<Models />} />
 <Route path="/collections/:type" element={<Collection />} />
 <Route path="/products" element={<Collection />} />
 <Route path="/review/:orderId" element={<ProtectedRoute><RateAndReview /></ProtectedRoute>} />
 
 {/* User & Checkout */}
 <Route path="/cart" element={<Cart />} />
 <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
 <Route path="/thank-you" element={<ProtectedRoute><ThankYou /></ProtectedRoute>} />
 <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
 <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />
 <Route path="/order/:orderId" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
 <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
 
 {/* Auth */}
 <Route path="/login" element={<Auth type="login" />} />
 <Route path="/signup" element={<Auth type="register" />} />
 
 {/* Information & Legal */}
 <Route path="/info/:slug" element={<InfoModal />} />
 
 {/* 404 Fallback */}
 <Route 
 path="*" 
 element={
 <div className="min-h-[60vh] flex items-center justify-center">
 <h1 className="text-2xl font-light uppercase tracking-widest text-zinc-400">
 404 <span className="mx-4 text-zinc-200">|</span> Page Not Found
 </h1>
 </div>
 } 
 />
 </Routes>

 <Footer />
 </>
 );
};

export default App;