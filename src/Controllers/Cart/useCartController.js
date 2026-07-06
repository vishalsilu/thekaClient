// controllers/useCartController.js
import { useState, useEffect, useMemo } from'react';
import { useDispatch, useSelector } from'react-redux';
import { useNavigate } from'react-router-dom';
import { updateQuantity, removeFromCart } from'../../Redux/slices/cartSlice';
import { getCart } from'../../Redux/controllers/cartController';
import { getFeaturedProducts } from'../../Redux/controllers/metaDataController';
import { useTextFavicon } from'../../Utils/useTextFavicon';
import { useCoupon } from'../../hooks/useCoupon';
import toast from 'react-hot-toast';

export const useCartController = () => {
 const dispatch = useDispatch();
 const navigate = useNavigate();

 // Model Bindings (Redux Selectors)
 const { items, status, error, cartToken } = useSelector((state) => state.cart);
 const { featuredProducts, couponError } = useSelector((state) => state.metaData);
 const siteData = useSelector((state) => state.siteData.data);
 const { isAuthenticated ,token, isLoading } = useSelector((state) => state.auth);

 // UI View State
 const [couponVisible, setCouponVisible] = useState(false);

 
 // Track unique item error states mapping keys dynamically
 const [localItemErrors, setLocalItemErrors] = useState({});

 // Dynamic View Meta Configurations
 useTextFavicon("CU", `Your Shopping Cart -${siteData?.websiteName}`, {
 bgColor:"#10b981",
 textColor:"#ffffff"
 });

 // Lifecycle Data Ingestion
 useEffect(() => {
 dispatch(getCart());
 dispatch(getFeaturedProducts());
 }, [dispatch]);

 // Data Aggregation logic (M/C Layer boundary)
 const totalUnits = useMemo(
 () => items.reduce((acc, item) => acc + (Number(item.quantity) || 0), 0),
 [items]
 );

 const subtotal = useMemo(() => {
 const rawSubtotal = items.reduce((acc, item) => {
 const price = item.salePrice || item.price || 0;
 return acc + (price * item.quantity);
 }, 0);
 return Math.round(rawSubtotal);
 }, [items]);

 // External Service Processing Hook Integration
 const couponService = useCoupon(subtotal, isAuthenticated);

 const cartRefShort = cartToken ? `...${cartToken.slice(-8)}` : null;

 // View Dispatched Handlers
 const handleUpdateQuantity = (productId, variantId, size, quantity) => {
 dispatch(updateQuantity({ productId, variantId, size, quantity }));
 };

 const handleRemoveFromCart = (item) => {
 dispatch(removeFromCart({ 
 productId: item.productId || item.id, 
 variantId: item.variantId, 
 size: item.size 
 }));
 };

 const handleNavigateToProduct = (item) => {
 const type = item.type?.toLowerCase() ||'style';
 const id = item.productId || item.id;
 navigate(`/product/${type}/${id}/?variant=${item.variantId}&size=${item.size}&oldKey=${String(id)}${String(item.variantId)}${String(item.size)}`);
 };

 const handleNavigateToCheckout = () => {
    if(!isLoading && !isAuthenticated || !token){
        toast.error("Please login to your account to complete order", {id:loadingToast})
        navigate('/login')
    }else{
         navigate('/checkout');
    }
    
 };

 /**
 * SUB-CONTROLLER GENERATOR FOR INDIVIDUAL CART ITEMS
 * Provides computing abstraction layer context for unique items cleanly
 */
 const getItemController = (item) => {
 const itemKey = `${item.productId || item.id}-${item.variantId ||'base'}-${item.size}`;
 const effectivePrice = Math.round(item.salePrice || item.price || 0);
 
 // Find targeted variant asset structures
 const displayImage = (() => {
 if (item.image) return item.image;
 if (item.variants && item.variantId) {
 const variantData = item.variants.find(v => String(v.id) === String(item.variantId));
 if (variantData && variantData.images?.length > 0) {
 return variantData.images[0];
 }
 }
 return item.images?.[0] || item.thumbnail;
 })();

 const adjustQty = (delta) => {
 const currentQty = Number(item.quantity) || 0;
 const nextQty = currentQty + delta;

 const currentVariant = item.variants?.find(v => String(v.id) === String(item.variantId));
 const sizeData = currentVariant?.sizes?.find(s => String(s.size) === String(item.size));
 const availableStock = sizeData?.stock || item.stock;

 if (delta > 0 && availableStock && nextQty > availableStock) {
 setLocalItemErrors(prev => ({ ...prev, [itemKey]: `Only ${availableStock} available` }));
 return setTimeout(() => {
 setLocalItemErrors(prev => ({ ...prev, [itemKey]:"" }));
 }, 2000);
 }

 if (nextQty >= 1) {
 handleUpdateQuantity(item.productId || item.id, item.variantId, item.size, Number(nextQty));
 }
 };

 return {
 displayImage,
 effectivePrice,
 totalPrice: effectivePrice * (item.quantity || 1),
 color: item.color ||"N/A",
 localErr: localItemErrors[itemKey] ||"",
 adjustQty,
 onRemove: () => handleRemoveFromCart(item),
 onNavigate: () => handleNavigateToProduct(item)
 };
 };

 return {
 // Data & States
 items,
 status,
 error,
 featuredProducts,
 couponError,
 couponVisible,
 setCouponVisible,
 cartRefShort,
 totalUnits,
 subtotal,
 // Coupon Values
 ...couponService,
 // Handlers
 handleUpdateQuantity,
 handleRemoveFromCart,
 handleNavigateToProduct,
 handleNavigateToCheckout,
 // Item Controller Ingestion Integration
 getItemController
 };
};