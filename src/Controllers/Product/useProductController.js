import { useEffect } from"react";
import { useState } from"react";
import { useDispatch, useSelector } from"react-redux";
import { useNavigate, useParams, useSearchParams } from"react-router-dom";
import { getSingleProduct } from"../../Redux/controllers/metaDataController";
import { useMemo } from"react";
import { addToCart, replaceCartItem } from"../../Redux/slices/cartSlice";
import toast from'react-hot-toast';
import { use } from"react";

export const useProductController = () => {
 const { id } = useParams();
 const [addStatus,setaddStatus]=useState(false)
 const dispatch = useDispatch();
 const navigate = useNavigate();
 const [searchParams] = useSearchParams();
 const initialCartKey = searchParams.get('oldKey');

 const product = useSelector(state => state.metaData.product);
 const isLoading = useSelector(state => state.metaData.isLoading);
 const cartItems = useSelector(state => state.cart.items);
 const siteData = useSelector(state => state.siteData.data);

 const [selectedColor, setSelectedColor] = useState(null);
 const [selectedSize, setSelectedSize] = useState(null);
 const [qty, setQty] = useState(1);
 const [isAdding, setIsAdding] = useState(false);

 const shippingTime = siteData?.shipping?.handlingTime ||"2-5 business days";

 // 1. Fetch Product Data
 useEffect(() => {
 if(id){
 dispatch(getSingleProduct(id));
 }
 }, [id, dispatch]);

 // 2. Initial Sync Logic (URL -> State)
 useEffect(() => {
 const variantIdFromUrl = searchParams.get('variant');
 const sizeFromUrl = searchParams.get('size');

 if (product?.variants?.length > 0) {
 const targetVariant =
 product.variants.find(v => String(v.id) === String(variantIdFromUrl)) ||
 product.variants.find(v => v.isDefault) ||
 product.variants[0];

 if (targetVariant) {
 setSelectedColor(targetVariant.color);

 const urlSizeExists = targetVariant.sizes?.find(
 s => s.size === sizeFromUrl && s.stock > 0
 );

 const firstAvailableSize = targetVariant.sizes?.find(s => s.stock > 0)?.size || null;

 if (urlSizeExists) {
 setSelectedSize(sizeFromUrl);
 } else {
 setSelectedSize(firstAvailableSize);
 }
 }
 }
 }, [product]); // Removed searchParams to prevent infinite loops if navigating internally

 // 3. Derived Data
 const currentVariant = useMemo(() =>
 product?.variants?.find(v => v.color === selectedColor) || product?.variants?.[0],
 [product, selectedColor]
 );

 const currentSizeData = useMemo(() =>
 currentVariant?.sizes?.find(s => s.size === selectedSize),
 [currentVariant, selectedSize]
 );

 const variantsMap = useMemo(() => {
 const map = {};
 if (!product?.variants) return map;
 for (const v of product.variants) {
 const key = String(v.color || v.colorCode || v.id || v.name).toLowerCase();
 map[key] = v;
 }
 return map;
 }, [product]);

 // FIXED: Logic to calculate how many more the user can add
 const { availableToAdd, inBag } = useMemo(() => {
 if (!currentVariant || !selectedSize) return { availableToAdd: 0, inBag: 0 };

 const stock = currentSizeData?.stock || 0;

 // Find item in cart using the same logic as our Redux Slice
 const itemInCart = cartItems.find(item => 
 String(item.productId) === String(id) && 
 String(item.variantId) === String(currentVariant.id) && 
 String(item.size) === String(selectedSize)
 );

 const inBagCount = itemInCart?.quantity || 0;
 const MAX_PER_VARIANT = 10;
 const remainingByLimit = Math.max(0, MAX_PER_VARIANT - inBagCount);
 const remainingByStock = Math.max(0, stock - inBagCount);

 return { 
 inBag: inBagCount,
 availableToAdd: Math.min(remainingByLimit, remainingByStock)
 };
 }, [currentVariant, selectedSize, cartItems, id, currentSizeData]);

 // 4. Handlers
 const handleColorClick = (v) => {
 setSelectedColor(v.color);
 const firstAvailableSize = v.sizes.find(s => s.stock > 0)?.size || null;
 setSelectedSize(firstAvailableSize);
 setQty(1);
 };

 const handleAddToCart = () => {
 if (!selectedSize) {
 toast.error('Please select a size before adding to cart');
 return;
 }

 if (availableToAdd <= 0) {
 toast.error('You have reached the maximum allowed quantity for this variant/size');
 return;
 }

 if (qty > availableToAdd) {
 toast.error(`You can only add ${availableToAdd} more of this selection`);
 return;
 }

 setIsAdding(true);

 const newItem = {
 productId: String(product?.id),
 variantId: Number(currentVariant?.id),
 size: String(selectedSize),
 quantity: Number(qty),
 name: product?.name,
 color: currentVariant?.color,
 image: currentVariant?.images?.[0] || product?.images?.[0],
 price: Number(product?.price || 0),
 fit: product?.fit,
 salePrice: Number(product?.salePrice || product?.price || 0),
 discountDisplay: product?.discountDisplay,
 stock: Number(currentSizeData?.stock || 0),
 inStock: Boolean(currentSizeData?.stock > 0),
 type: product?.type || product?.category ||'products',
 category: product?.category || product?.type ||'products',
 collectionInfo: product?.collectionInfo || null
 };

 if (initialCartKey) {
 dispatch(replaceCartItem({
 oldKey: initialCartKey,
 newItem
 }));
 } else {
 dispatch(addToCart(newItem));
 setaddStatus(true)
 }

 setTimeout(() => {
 setIsAdding(false);
 }, 500);
 };

 return {
 id,
 product,
 isLoading,
 selectedColor,
 selectedSize,
 setSelectedSize,
 qty,
 setQty,
 isAdding,
 currentVariant,
 currentSizeData,
 availableToAdd,
 inBag, // Added this so your UI can show"You have 2 in bag"
 handleColorClick,
 handleAddToCart,
 navigate,
 addStatus,
 shippingTime,
 variantsMap
 };
};