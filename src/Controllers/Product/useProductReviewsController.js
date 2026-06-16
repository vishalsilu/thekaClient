import { useState, useEffect, useMemo } from'react';
import { useSelector } from'react-redux';
import { useSearchParams } from'react-router-dom';
import toast from'react-hot-toast';
import imageCompression from'browser-image-compression';
import api from'../../config/api';

export const useProductReviewsController = (reviews, productId) => {
 const [page, setPage] = useState(1);
 const pageSize = 4; 
 const [isSortOpen, setIsSortOpen] = useState(false);
 const [sortBy, setSortBy] = useState('Newest');
 const [imageViewerOpen, setImageViewerOpen] = useState(false);
 const [activeImageIndex, setActiveImageIndex] = useState(0);
 const [images, setImages] = useState([]);

 const { user } = useSelector((state) => state.auth);
 const [searchParams] = useSearchParams();
 const selectedVariant = searchParams.get('variant') ||'';

 const normalizedReviews = useMemo(() => {
 if (!Array.isArray(reviews) || reviews.length === 0) return [];
 return reviews.map((rev, idx) => ({
 id: rev._id || rev.id || `${rev.user ||'anonymous'}-${rev.date || idx}-${idx}`,
 user: rev.user ||'Anonymous',
 rating: Number(rev.rating) || 0,
 date: rev.date ? rev.date.split('T')[0] : new Date().toISOString().split('T')[0],
 comment: rev.comment || rev.title ||'',
 title: rev.title ||'',
 verified: Boolean(rev.userId),
 helpful: Number(rev.helpful || 0),
 images: Array.isArray(rev.images) ? rev.images.filter(Boolean) : [],
 userId: rev.userId || null,
 productId: rev.productId || null,
 orderId : rev.orderId || null,
 variant: rev.variant ||''
 }));
 }, [reviews]);

 const [allReviews, setAllReviews] = useState(normalizedReviews);
 const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
 const [reviewTitle, setReviewTitle] = useState('');
 const [reviewComment, setReviewComment] = useState('');
 const [reviewRating, setReviewRating] = useState(0);
 const [reviewFiles, setReviewFiles] = useState([]);
 const [editingReview, setEditingReview] = useState(null);
 const [isProcessingImages, setIsProcessingImages] = useState(false);
 const [submittingReview, setSubmittingReview] = useState(false);

 const allReviewImages = useMemo(() => {
 return allReviews.flatMap((review) => (
 (review.images || []).map((img, idx) => ({
 img,
 title: review.title ||'',
 comment: review.comment ||'',
 user: review.user ||'Anonymous',
 date: review.date ||'',
 rating: review.rating,
 reviewId: review.id,
 imageIndex: idx
 }))
 ));
 }, [allReviews]);

 useEffect(() => {
 setAllReviews(normalizedReviews);
 }, [normalizedReviews]);

 useEffect(() => {
 const totalPages = Math.max(1, Math.ceil((allReviews || []).length / pageSize));
 if (page > totalPages) setPage(totalPages);
 if (page < 1) setPage(1);
 }, [allReviews, page, pageSize]);

 const totalReviews = allReviews.length;
 const averageRating = totalReviews ? allReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

 const ratingBreakdown = useMemo(() => {
 const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
 allReviews.forEach((review) => {
 if (counts[review.rating] !== undefined) counts[review.rating] += 1;
 });
 return [5, 4, 3, 2, 1].map((rating) => ({
 rating,
 count: counts[rating],
 percent: totalReviews ? Math.round((counts[rating] / totalReviews) * 100) : 0
 }));
 }, [allReviews, totalReviews]);

 const handleSort = (type) => {
 setSortBy(type);
 setIsSortOpen(false);
 const sorted = [...allReviews].sort((a, b) => {
 if (type ==='Highest') return b.rating - a.rating;
 if (type ==='Lowest') return a.rating - b.rating;
 return new Date(b.date) - new Date(a.date);
 });
 setAllReviews(sorted);
 setPage(1);
 };

 const handleImageClick = (index, imagesToView) => { 
 setActiveImageIndex(index);
 setImageViewerOpen(true);
 setImages(imagesToView);
 };

 const handleDeleteReview = async (rev) => {
 const { id, productId: pId, orderId, userId } = rev;
 if (window.confirm("Are you sure you want to delete this review?")) {
 try {
 const deleted = await api.delete('/product/admin/reviews/remove', {
 data: { id, userId, productId: pId, orderId }
 });
 if (deleted.status === 200) {
 setAllReviews(prev => prev.filter((review) => review.id !== id));
 toast.success('Review removed successfully');
 }
 } catch (err) {
 toast.error('Failed to delete review');
 }
 }
 };

 const handleEditReview = (rev) => {
 setEditingReview(rev);
 setReviewTitle(rev.title ||'');
 setReviewComment(rev.comment ||'');
 setReviewRating(rev.rating || 0);
 setReviewFiles([]);
 setIsReviewModalOpen(true);
 };

 const cancelEditReview = () => {
 setEditingReview(null);
 resetReviewForm();
 setIsReviewModalOpen(false);
 };

 const removeReviewFile = (index) => {
 setReviewFiles((prev) => prev.filter((_, idx) => idx !== index));
 };

 const handleDeleteReviewImage = async (reviewId, imageUrl) => {
 if (!window.confirm('Delete this image from your review?')) return;
 try {
 const formData = new FormData();
 formData.append('removedImages', JSON.stringify([imageUrl]));
 const res = await api.patch(`/product/${productId}/reviews/${reviewId}`, formData);
 const updated = res?.data?.review;
 if (updated) {
 setAllReviews(prev => prev.map(r => r.id === reviewId ? { ...r, images: Array.isArray(updated.images) ? updated.images : [] } : r));
 toast.success('Image removed');
 }
 } catch (err) {
 toast.error('Could not remove image.');
 }
 };

 const handleReplaceReviewImage = async (reviewId, oldUrl, file) => {
 if (!file) return;
 try {
 const formData = new FormData();
 formData.append('removedImages', JSON.stringify([oldUrl]));
 formData.append('images', file);
 const res = await api.patch(`/product/${productId}/reviews/${reviewId}`, formData);
 const updated = res?.data?.review;
 if (updated) {
 setAllReviews(prev => prev.map(r => r.id === reviewId ? { ...r, images: Array.isArray(updated.images) ? updated.images : [] } : r));
 toast.success('Image replaced');
 }
 } catch (err) {
 toast.error('Could not replace image.');
 }
 };

 const handleFileSelection = async (files) => {
 const incomingFiles = Array.from(files || []);
 if (!incomingFiles.length) return;
 if (reviewFiles.length >= 5) return toast.error('You can only upload up to 5 photos.');

 const availableSlots = 5 - reviewFiles.length;
 const selectedFiles = incomingFiles.slice(0, availableSlots);

 setIsProcessingImages(true);
 try {
 const compressionOptions = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
 const compressedFiles = await Promise.all(
 selectedFiles.map(async (file) => {
 if (file.size / 1024 / 1024 <= 1) return file;
 return await imageCompression(file, compressionOptions);
 })
 );
 setReviewFiles((prev) => [...prev, ...compressedFiles].slice(0, 5));
 toast.success('Images successfully compressed.');
 } catch (error) {
 toast.error('Failed to process selected images.');
 } finally {
 setIsProcessingImages(false);
 }
 };

 const resetReviewForm = () => {
 setReviewTitle('');
 setReviewComment('');
 setReviewRating(0);
 setReviewFiles([]);
 };

 const handleSubmitReview = async (event) => {
 event.preventDefault();
 if (!reviewRating) return toast.error('Please select a rating.');
 if (!reviewComment.trim()) return toast.error('Please add a review description.');
 if (!productId) return toast.error('Missing product ID.');
 if (!user) return toast.error('Please login to submit a review.');

 setSubmittingReview(true);
 try {
 const formData = new FormData();
 formData.append('rating', String(reviewRating));
 formData.append('title', reviewTitle.trim());
 formData.append('comment', reviewComment.trim());
 const variantToSend = editingReview?.variant || selectedVariant;
 if (variantToSend) formData.append('variant', variantToSend);
 reviewFiles.forEach((file) => formData.append('images', file));

 const response = editingReview
 ? await api.patch(`/product/${productId}/reviews/${editingReview.id}`, formData)
 : await api.post(`/product/${productId}/reviews`, formData);
 const createdReview = response?.data?.review;
 if (!createdReview) throw new Error('No review data returned by server');

 const normalizedCreatedReview = {
 id: createdReview._id || createdReview.id || `${createdReview.user ||'anonymous'}-${createdReview.date || Date.now()}`,
 user: createdReview.user ||'Anonymous',
 rating: Number(createdReview.rating) || 0,
 date: createdReview.date ? createdReview.date.split('T')[0] : new Date().toISOString().split('T')[0],
 comment: createdReview.comment ||'',
 title: createdReview.title ||'',
 verified: Boolean(createdReview.userId),
 helpful: Number(createdReview.helpful || 0),
 images: Array.isArray(createdReview.images) ? createdReview.images.filter(Boolean) : [],
 userId: createdReview.userId || null,
 productId: createdReview.productId || productId,
 orderId: createdReview.orderId || null,
 variant: createdReview.variant || selectedVariant ||''
 };

 setAllReviews((prev) => {
 if (editingReview) {
 return prev.map((review) => review.id === editingReview.id ? normalizedCreatedReview : review);
 }
 return [normalizedCreatedReview, ...prev];
 });
 resetReviewForm();
 setEditingReview(null);
 setIsReviewModalOpen(false);
 toast.success(editingReview ?'Your review has been updated.' :'Your review has been submitted.');
 } catch (error) {
 toast.error(error?.response?.data?.error || error?.message ||'Failed to submit review.');
 } finally {
 setSubmittingReview(false);
 }
 };

 return {
 page, setPage, pageSize,
 isSortOpen, setIsSortOpen,
 sortBy,
 imageViewerOpen, setImageViewerOpen,
 activeImageIndex,
 images,
 user,
 allReviews,
 isReviewModalOpen, setIsReviewModalOpen,
 reviewTitle, setReviewTitle,
 reviewComment, setReviewComment,
 reviewRating, setReviewRating,
 reviewFiles,
 editingReview,
 isProcessingImages,
 submittingReview,
 allReviewImages,
 totalReviews,
 averageRating,
 ratingBreakdown,
 handleSort,
 handleImageClick,
 handleDeleteReview,
 handleEditReview,
 cancelEditReview,
 removeReviewFile,
 handleDeleteReviewImage,
 handleReplaceReviewImage,
 handleFileSelection,
 handleSubmitReview
 };
};