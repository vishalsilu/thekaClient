// controllers/useCheckoutController.js
import { useState, useEffect, useMemo, useRef } from'react';
import { useLocation, useNavigate } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { clearLocalCart } from'../../Redux/slices/cartSlice';
import { createOrder } from'../../Redux/thunks/orderThunks';
import { removeAppliedCoupon } from'../../Redux/slices/metaDataSlice';
import { useCoupon } from'../../hooks/useCoupon';

export const useCheckoutController = () => {
 const dispatch = useDispatch();
 const location = useLocation();
 const navigate = useNavigate();

 // Model Bindings (Redux Selectors)
 const reduxCart = useSelector((state) => state.cart.items);
 const { isAuthenticated, user } = useSelector((state) => state.auth);
 const { couponError } = useSelector((state) => state.metaData);
 const siteData = useSelector((state) => state.siteData.data || {});
 
 // Guard references to prevent multi-submissions
 const isOrderCompleting = useRef(false);

 // View States
 const [addressChoice, setAddressChoice] = useState('saved');
 const [selectedAddressId, setSelectedAddressId] = useState("");
 const [paymentMethod, setPaymentMethod] = useState('');
 const [cartItems, setCartItems] = useState([]);
 const [placing, setPlacing] = useState(false);
 const [placeErr, setPlaceErr] = useState(null);
 const [pendingOrder, setPendingOrder] = useState(null);

 const passedCart = location.state?.cart;
 const lineItems = Array.isArray(passedCart) && passedCart.length > 0 ? passedCart : reduxCart;

 const paymentOptions = useMemo(() => {
   const configured = Array.isArray(siteData?.payment?.paymentOptions) ? siteData.payment.paymentOptions : [];
   const defaults = [
     {
       id: 'razorpay',
       label: 'Secure Payment (Razorpay)',
       description: 'Supports Credit/Debit Cards, UPI, Net Banking & Wallets.',
       enabled: siteData?.payment?.onlinePaymentEnabled !== false,
     },
     {
       id: 'cod',
       label: 'Cash on Delivery',
       description: 'Pay when you receive your order.',
       enabled: siteData?.payment?.codEnabled !== false,
     }
   ];

   return defaults.map((base) => {
     const saved = configured.find((item) => String(item.id || '').trim() === base.id);
     return {
       id: base.id,
       label: String(saved?.label || base.label).trim(),
       description: String(saved?.description || base.description).trim(),
       enabled: saved?.enabled !== undefined ? saved.enabled !== false : base.enabled,
     };
   });
 }, [siteData]);

 const enabledPaymentOptions = useMemo(() => paymentOptions.filter((opt) => opt.enabled), [paymentOptions]);

 useEffect(() => {
   if (enabledPaymentOptions.length === 0) {
     if (paymentMethod !== '') setPaymentMethod('');
     return;
   }

   if (!enabledPaymentOptions.some((opt) => opt.id === paymentMethod)) {
     setPaymentMethod(enabledPaymentOptions[0].id);
   }
 }, [enabledPaymentOptions, paymentMethod]);

 // Data Loading & Empty Cart Redirect
 useEffect(() => {
 if (isOrderCompleting.current) return;
 if (!lineItems || lineItems.length === 0) {
 navigate('/cart');
 return;
 }
 setCartItems(lineItems);
 }, [lineItems, navigate]);

 // Initialize Default User Address
 useEffect(() => {
 if (!isAuthenticated) return;
 const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
 if (defaultAddr?._id) setSelectedAddressId(String(defaultAddr._id));
 }, [isAuthenticated, user?.addresses]);

 // Base Subtotal Computations
 const subtotal = useMemo(() => {
 return cartItems.reduce((acc, item) => acc + ((item.salePrice || item.price) * item.quantity), 0);
 }, [cartItems]);

 // Pricing Hook Integration
 const couponService = useCoupon(subtotal, isAuthenticated);

 // Main Event Handlers
 const handlePayment = async () => {
 setPlaceErr(null);
 if (!isAuthenticated) { navigate('/login'); return; }
 if (placing) return;

 const selectedAddress = user?.addresses?.find(
    (addr) => String(addr._id) === String(selectedAddressId)
  );

 if (enabledPaymentOptions.length === 0) {
   setPlaceErr('No payment methods are currently available. Please contact support.');
   return;
 }
 if (!paymentMethod) {
   setPlaceErr('Please select a payment method.');
   return;
 }
 if (addressChoice ==='new') { setPlaceErr('Please save address in profile first, then select it here'); return; }
 if (!selectedAddress?._id && addressChoice ==='saved') { setPlaceErr('Please select an address'); return; }

 setPlacing(true);
 try {
 const orderItems = cartItems.map(item => ({
 productId: String(item.productId),
 variantId: Number(item.variantId || 0),
 size: String(item.size),
 quantity: Number(item.quantity)
 }));

 const couponPayload = couponService.appliedCoupon
 ? {
 code: couponService.appliedCoupon.code,
 discountValue: couponService.discountAmount,
 type: couponService.appliedCoupon.type
 }
 : null;

 const order = await dispatch(
 createOrder({
 items: orderItems,
 shippingAddressId: addressChoice ==='saved' ? String(selectedAddress?._id) : null,
 shippingAddress: null,
 paymentMethod,
 coupon: couponPayload
 })
 ).unwrap();

 // For Razorpay, keep order pending and show payment modal
 if (paymentMethod === 'razorpay') {
 setPendingOrder(order);
 setPlacing(false);
 return;
 }

 // For COD, complete immediately
 isOrderCompleting.current = true;
 dispatch(clearLocalCart());
 dispatch(removeAppliedCoupon());
 navigate('/thank-you', { state: { order, handlingTime: couponService.handlingTime } });
 } catch (error) {
 setPlaceErr(typeof error ==='string' ? error : error?.message ||'Order failed');
 setPlacing(false);
 }
 };

 const handlePaymentSuccess = (paymentData) => {
 isOrderCompleting.current = true;
 dispatch(clearLocalCart());
 dispatch(removeAppliedCoupon());
 navigate('/thank-you', { state: { order: pendingOrder, handlingTime: couponService.handlingTime, payment: paymentData } });
 };

 const handlePaymentFailure = (error) => {
 setPlaceErr(error || 'Payment failed. Please try again.');
 setPendingOrder(null);
 };

 const handleAddressSaved = (newId) => {
 setAddressChoice('saved');
 setSelectedAddressId(String(newId));
 };

 const handleAddressClose = () => {
 setAddressChoice('saved');
 };

 return {
 // Shared parameters & Data states
 user,
 isAuthenticated,
 addressChoice,
 setAddressChoice,
 selectedAddressId,
 setSelectedAddressId,
 paymentMethod,
 setPaymentMethod,
 cartItems,
 placing,
 placeErr,
 subtotal,
 navigate,
 couponError,
 pendingOrder,
 paymentOptions,
 enabledPaymentOptions,
 paymentInstructions: siteData?.payment?.paymentInstructions || '',
 // Spread structural variables from useCoupon hook system
 ...couponService,

 // Functional actions
 handlePayment,
 handlePaymentSuccess,
 handlePaymentFailure,
 handleAddressSaved,
 handleAddressClose
 };
};