import { useEffect, useMemo, useState } from'react';
import { useLocation, useNavigate, useParams } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { toast } from'react-hot-toast';
import { fetchOrderById, submitOrderReviews } from'../../Redux/thunks/orderThunks';
import imageCompression from'browser-image-compression';

export const useRateAndReview = () => {
 const location = useLocation();
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const { orderId: routeOrderId } = useParams();

 const orderFromState = location.state?.order || null;
 const currentOrder = useSelector((state) => state.orders.currentOrder);
 const loadingOrder = useSelector((state) => state.orders.detailLoading);
 const submitting = useSelector((state) => state.orders.submittingReview);

 // Sync and memoize active order reference
 const order = useMemo(() => {
 if (routeOrderId && currentOrder?.orderId === routeOrderId) return currentOrder;
 if (orderFromState?.orderId === routeOrderId) return orderFromState;
 return orderFromState || currentOrder;
 }, [routeOrderId, currentOrder, orderFromState]);

 const orderId = routeOrderId || order?.orderId ||'N/A';
 const items = order?.items || [];

 

 const [reviews, setReviews] = useState({});
 const [reviewFiles, setReviewFiles] = useState({});
const [isCompressing, setIsCompressing] = useState(false);

 // Fetch target order dataset if missing from state pipeline
 useEffect(() => {
 if (routeOrderId && (!currentOrder || currentOrder.orderId !== routeOrderId)) {
 dispatch(fetchOrderById(routeOrderId));
 }
 }, [dispatch, routeOrderId, currentOrder]);

 // Synchronize dynamic lists of review text and scores against order elements
 useEffect(() => {
 if (items.length === 0) return;

 const initial = items.reduce((acc, item, idx) => {
 acc[idx] = {
 rating: 0,
 hover: 0,
 description:'',
 title:'',
 productId: item.productId,
 variant: item.variant,
 size: item.size
 };
 return acc;
 }, {});

 setReviews((prev) => ({
 ...initial,
 ...Object.keys(prev).reduce((acc, key) => {
 if (prev[key] && initial[key]) {
 acc[key] = {
 ...initial[key],
 rating: prev[key].rating || 0,
 hover: 0,
 description: prev[key].description ||'',
 title: prev[key].title ||''
 };
 }
 return acc;
 }, {})
 }));
 }, [items]);

 const handleRating = (index, val) => {
 setReviews((prev) => ({ ...prev, [index]: { ...prev[index], rating: val } }));
 };

 const handleHover = (index, val) => {
 setReviews((prev) => ({ ...prev, [index]: { ...prev[index], hover: val } }));
 };

 const handleInputChange = (index, field, value) => {
 setReviews((prev) => ({ ...prev, [index]: { ...prev[index], [field]: value } }));
 };

const handleFileChange = (index, files) => {
 if (!files) return;

 // Convert to an explicit array of fresh, isolated File instances
 const selected = Array.from(files)
 .slice(0, 5)
 .map(file => new File([file], file.name, { type: file.type }));

 setReviewFiles((prev) => ({ 
 ...prev, 
 [index]: selected 
 }));
};

 const getRatingLabel = (val) => {
 const labels = { 1:'Poor', 2:'Fair', 3:'Good', 4:'Very Good', 5:'Excellent' };
 return labels[val] ||'';
 };

const buildFormData = async () => {
 const formData = new FormData();
 const payload = [];

 const compressionOptions = {
 maxSizeMB: 1,
 maxWidthOrHeight: 1024,
 useWebWorker: true
 };

 for (let index = 0; index < items.length; index++) {
 const item = items[index];
 const review = reviews[index];
 if (!review || !review.rating) continue;

 payload.push({
 productId: item.productId,
 rating: review.rating,
 title: review.title.trim(),
 comment: review.description.trim(),
 variant: item.variant,
 size: item.size
 });

 const files = reviewFiles[index] || [];
 for (const file of files) {
 // ✅ SAFETY CHECK: Verify it's a real File object and has an image MIME type
 if (file && file.type && file.type.startsWith('image/')) {
 try {
 const compressedFile = await imageCompression(file, compressionOptions);
 formData.append(`images[${index}]`, compressedFile, compressedFile.name);
 } catch (err) {
 console.warn("Compression dropped, uploading original file configuration", err);
 formData.append(`images[${index}]`, file);
 }
 } else if (file) {
 // If it's a file but type isn't implicitly"image/*", append it directly without compression
 console.warn("Skipping compression for non-standard image type:", file.type);
 formData.append(`images[${index}]`, file);
 }
 }
 }

 formData.append('reviews', JSON.stringify(payload));
 return { formData, payload };
};
 const handleSubmit = async () => {
 if (!items.length) {
 toast.error('No order items available to review.');
 return;
 }

 // 1. Instantly trigger local loading state for image processing
 setIsCompressing(true);

 try {
 // 2. Run the asynchronous compression process
 const { formData, payload } = await buildFormData();

 if (payload.length === 0) {
 toast.error('Please rate at least one item before submitting.');
 setIsCompressing(false);
 return;
 }

 // 3. Hand off the payload to Redux (Redux then manages `submittingReview` state)
 const resultAction = await dispatch(submitOrderReviews({ orderId, formData }));
 
 if (submitOrderReviews.fulfilled.match(resultAction)) {
 toast.success('Reviews submitted successfully.');
 navigate('/orders');
 } else {
 toast.error(resultAction.payload ||'Failed to submit reviews.');
 }
 } catch (error) {
 console.error("Submission pipeline failed:", error);
 toast.error("An unexpected error occurred during image processing.");
 } finally {
 // 4. Always clean up local loading state
 setIsCompressing(false);
 }
};

const isButtonLoading = isCompressing || submitting;

 return {
 order,
 orderId,
 items,
 reviews,
 reviewFiles,
 loadingOrder,
 submitting : isButtonLoading,
 navigate,
 handleRating,
 handleHover,
 handleInputChange,
 handleFileChange,
 getRatingLabel,
 handleSubmit
 };
};