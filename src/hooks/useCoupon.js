import { useState, useMemo } from'react';
import { useDispatch, useSelector } from'react-redux';
import { validateCoupon } from'../Redux/controllers/metaDataController';
import { removeAppliedCoupon } from'../Redux/slices/metaDataSlice';

export const useCoupon = (subtotal, isAuthenticated = true) => {
 const [couponInput, setCouponInput] = useState("");
 const [couponLoading, setCouponLoading] = useState(false);
 const [isAnimating, setIsAnimating] = useState(false);

 const dispatch = useDispatch();

 const { appliedCoupon } = useSelector((state) => state.metaData);
 const siteData = useSelector((state) => state.siteData.data);

 const handlingTime = siteData?.shipping?.handlingTime || 0;

 const shippingConfig = useMemo(() => {
 const rawCost = Number(siteData?.shipping?.defaultCost ?? NaN);
 return {
 defaultCost: rawCost > 0 ? rawCost : 99,
 freeShippingThreshold:
 typeof siteData?.shipping?.freeShippingThreshold ==='number' && siteData.shipping.freeShippingThreshold > 0
 ? siteData.shipping.freeShippingThreshold
 : Infinity
 };
 }, [siteData]);

 // Compute calculated values dynamically 
const discountAmount = useMemo(() => {
 if (!appliedCoupon) return 0;

 // Prefer backend-calculated discountAmount when provided (authoritative)
 if (appliedCoupon.discountAmount !== undefined && appliedCoupon.discountAmount !== null) {
 return Number(appliedCoupon.discountAmount || 0);
 }

 // Fallback to client-side calculation when backend value is not present
 if (appliedCoupon.type ==='percentage') {
 return Math.round(subtotal * (Number(appliedCoupon.value || 0) / 100));
 }

 if (appliedCoupon.type ==='fixed' || appliedCoupon.type ==='amount') {
 return Number(appliedCoupon.value || 0);
 }

 return 0;
}, [appliedCoupon, subtotal]);

 const shipping = useMemo(() => {
 const discountedSubtotal = subtotal - discountAmount;
 if (
 subtotal === 0 ||
 appliedCoupon?.type ==='shipping' ||
 discountedSubtotal >= shippingConfig.freeShippingThreshold
 ) {
 return 0;
 }

 return shippingConfig.defaultCost;
 }, [subtotal, discountAmount, appliedCoupon, shippingConfig]);

 const total = useMemo(() => {
 return Math.max(0, subtotal - discountAmount) + shipping;
 }, [subtotal, discountAmount, shipping]);

 const couponType = useMemo(() => {
 if (!appliedCoupon) return null;
 if (appliedCoupon.type ==='percentage') return'percentage';
 if (appliedCoupon.type ==='fixed' || appliedCoupon.type ==='amount') return'amount';
 if (appliedCoupon.type ==='shipping') return'shipping';
 return null;
 }, [appliedCoupon]);
 // Handle validating and attaching the coupon
 const handleApplyCoupon = async (explicitCode = null) => {
 const targetCode = (explicitCode || couponInput).toUpperCase().trim();

 dispatch(validateCoupon({ code: targetCode, subtotal }))
 setIsAnimating(true);
 
 setTimeout(() => setIsAnimating(false), 800);
 }

 // Clear cookie tracking records and states
 const removeCoupon = () => {
 setIsAnimating(true);
dispatch(removeAppliedCoupon())
 setTimeout(() => setIsAnimating(false), 800);
 };

 return {
 couponInput,
 setCouponInput,
 appliedCoupon,
 couponLoading,
 isAnimating,
 discountAmount,
 shipping,
 handlingTime,
 couponType,
 total,
 handleApplyCoupon,
 removeCoupon
 };
};