import React from'react';
import { FaStar, FaCheckCircle, FaChevronDown } from'react-icons/fa';
import { Trash2, Edit3, X, Upload, MessageSquare } from'lucide-react';
import ImageViewer from'../../Modals/ImageViewer';
import { useProductReviewsController } from'../../Controllers/Product/useProductReviewsController';

const ProductReviews = ({ reviews = [], productId }) => {
 const c = useProductReviewsController(reviews, productId);

 return (
 <section className="w-full bg-white border-t border-zinc-100 py-10">
 <div className="max-w-[1300px] mx-auto px-4 md:px-8">
 
 {/* IMAGE VIEWER PORTAL */}
 {c.imageViewerOpen && (
 <ImageViewer 
 images={c.images}
 initialIndex={c.activeImageIndex}
 onClose={() => c.setImageViewerOpen(false)}
 />
 )}

 {/* WRITE / EDIT MODAL */}
 {c.isReviewModalOpen && (
 <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-[2px] flex items-center justify-center p-4">
 <div className="w-full max-w-2xl bg-white rounded-none border border-zinc-200 shadow-2xl overflow-hidden">
 <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
 <div>
 <div className="flex items-center gap-3">
 <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-900">
 {c.editingReview ?'Edit Your Experience' :'Write a Review'}
 </h2>
 {c.editingReview && (
 <button
 type="button"
 onClick={c.cancelEditReview}
 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 transition-colors"
 >
 (Cancel Edit)
 </button>
 )}
 </div>
 <p className="text-[11px] text-zinc-400 mt-1">Share genuine context with your structural metrics.</p>
 </div>
 <button
 type="button"
 onClick={c.cancelEditReview}
 className="text-zinc-400 hover:text-zinc-900 transition-colors"
 >
 <X size={18} />
 </button>
 </div>

 <form onSubmit={c.handleSubmitReview} className="p-6 space-y-6">
 {!c.user && (
 <div className="border border-red-500 bg-red-50 px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-red-600 text-center">
 Authentication is required to log feedback metrics.
 </div>
 )}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Metric Weight (Rating)</label>
 <div className="flex items-center gap-1.5">
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 type="button"
 onClick={() => c.setReviewRating(star)}
 className="transition-transform active:scale-95"
 >
 <FaStar size={20} className={`${c.reviewRating >= star ?'text-amber-500' :'text-zinc-200'} transition-colors`} />
 </button>
 ))}
 </div>
 </div>
 <div className="space-y-2">
 <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Headline Summary</label>
 <input
 value={c.reviewTitle}
 onChange={(e) => c.setReviewTitle(e.target.value)}
 className="w-full bg-zinc-50/50 border border-zinc-200 rounded-none px-4 py-2.5 text-xs tracking-wide text-zinc-900 placeholder:text-zinc-400/60 focus:outline-none focus:border-black transition-colors"
 placeholder="e.g., Exceptional Material Definition"
 />
 </div>
 </div>

 <div className="space-y-2">
 <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-400">Elaborated Critique</label>
 <textarea
 value={c.reviewComment}
 onChange={(e) => c.setReviewComment(e.target.value)}
 rows={4}
 className="w-full bg-zinc-50/50 border border-zinc-200 rounded-none px-4 py-3 text-xs tracking-wide text-zinc-900 placeholder:text-zinc-400/60 focus:outline-none focus:border-black transition-colors"
 placeholder="Provide authentic details regarding fit, texture, and execution tracks..."
 />
 </div>

 <div className="space-y-2">
 <label className="flex flex-col items-center justify-center w-full min-h-[90px] border border-dashed border-zinc-200 bg-zinc-50/30 cursor-pointer hover:bg-zinc-50 hover:border-zinc-400 transition-all">
 <div className="flex flex-col items-center justify-center pt-3 pb-3">
 <Upload size={16} className="text-zinc-400 mb-2" />
 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Upload Media Assets</p>
 <p className="text-[9px] text-zinc-400/80 mt-0.5">JPEG, PNG, WEBP Track (Max 5 Files)</p>
 </div>
 <input
 type="file"
 multiple
 accept="image/png,image/jpeg,image/webp"
 onChange={(e) => void c.handleFileSelection(e.target.files)}
 className="hidden"
 />
 </label>

 {c.isProcessingImages && (
 <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest animate-pulse">Processing Image Matrices...</div>
 )}

 {!c.isProcessingImages && c.reviewFiles.length > 0 && (
 <div className="flex flex-wrap gap-2 pt-2">
 {c.reviewFiles.map((file, idx) => (
 <div key={idx} className="relative bg-zinc-50 border border-zinc-200 pl-3 pr-8 py-1.5 text-[10px] font-mono text-zinc-500 flex items-center">
 <span className="truncate max-w-[120px]">{file.name}</span>
 <button
 type="button"
 onClick={() => c.removeReviewFile(idx)}
 className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-900"
 >
 <X size={12} />
 </button>
 </div>
 ))}
 </div>
 )}
 </div>

 <div className="pt-2">
 <button
 type="submit"
 disabled={c.submittingReview || c.isProcessingImages}
 className="w-full bg-black text-white py-3.5 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
 >
 {c.submittingReview ?'Submitting Core...' :'Publish Feedback Track'}
 </button>
 </div>
 </form>
 </div>
 </div>
 )}

 {/* CORE LAYOUT RESOLUTION */}
 {c.totalReviews === 0 ? (
 <div className="w-full bg-zinc-50 border border-zinc-200 px-5 py-3 flex flex-row items-center justify-between gap-4 transition-all">
 <div className="flex items-center gap-3">
 <MessageSquare size={14} className="text-zinc-400 shrink-0" strokeWidth={2} />
 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">
 No reviews yet
 </span>
 <span className="hidden sm:inline text-zinc-400 text-xs border-l border-zinc-200 pl-3">
 Be the inaugural client to record observations.
 </span>
 </div>
 <button 
 onClick={() => c.setIsReviewModalOpen(true)}
 className="bg-black text-white px-4 py-2 text-[9px] font-black uppercase tracking-[0.15em] hover:bg-zinc-800 transition-colors shrink-0"
 >
 Write First Review
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-4">
 
 {/* LEFT SIDE: SUMMARY OVERVIEW */}
 <div className="lg:col-span-4">
 <div className="sticky top-24 border border-zinc-200 p-8 bg-zinc-50/50">
 <h2 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-zinc-400">Client Feedback</h2>
 <div className="flex items-baseline gap-4 mb-2">
 <span className="text-6xl font-light tracking-tighter text-zinc-900">{c.averageRating.toFixed(1)}</span>
 <div className="flex gap-0.5 text-zinc-900">
 {[...Array(5)].map((_, i) => (
 <FaStar key={i} size={11} className={i < Math.round(c.averageRating) ?'text-zinc-900' :'text-zinc-200'} />
 ))}
 </div>
 </div>
 <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8">
 Based on {c.totalReviews} certified review{c.totalReviews === 1 ?'' :'s'}
 </p>
 
 <div className="space-y-3">
 {c.ratingBreakdown.map(({ rating, percent }) => (
 <div key={rating} className="flex items-center gap-4 group cursor-default">
 <span className="text-[9px] font-bold w-2 text-zinc-900">{rating}</span>
 <div className="flex-1 h-[2px] bg-zinc-100 overflow-hidden">
 <div 
 className="h-full bg-black transition-all duration-700" 
 style={{ width: `${percent}%` }}
 />
 </div>
 <span className="text-[9px] font-bold text-zinc-400 group-hover:text-zinc-900 transition-colors">
 {percent}%
 </span>
 </div>
 ))}
 </div>

 <button 
 onClick={() => c.setIsReviewModalOpen(true)}
 className="w-full mt-10 bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all active:scale-[0.98]"
 >
 Write a Review
 </button>
 </div>
 </div>

 {/* RIGHT SIDE: REVIEWS SUBMISSIONS LIST & GALLERY */}
 <div className="lg:col-span-8">
 {c.allReviewImages.length > 0 && (
 <div className="mb-12 border border-zinc-200 p-4">
 <div className="mb-4">
 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900">Review Media Assets</h3>
 <p className="text-[10px] text-zinc-400 mt-0.5">Aggregated visual submissions directly from users.</p>
 </div>
 <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-200">
 {c.allReviewImages.map((item, idx) => (
 <button
 key={`${item.reviewId}-${idx}`}
 type="button"
 onClick={() => c.handleImageClick(idx, c.allReviewImages)}
 className="w-20 h-24 shrink-0 overflow-hidden bg-zinc-50 border border-zinc-200 transition hover:opacity-80"
 >
 <img
 src={item.img}
 alt={`Media track ${idx + 1}`}
 className="h-full w-full object-cover"
 />
 </button>
 ))}
 </div>
 </div>
 )}

 {/* FILTERS TOOLBAR */}
 <div className="flex justify-between items-baseline mb-10 pb-4 border-b border-zinc-100 relative">
 <div className="text-[10px] font-black uppercase tracking-widest text-zinc-900">
 Showing {Math.min((c.page - 1) * c.pageSize + 1, c.allReviews.length)}-{Math.min(c.page * c.pageSize, c.allReviews.length)} of {c.allReviews.length} Records
 </div>
 
 <div className="relative">
 <button 
 onClick={() => c.setIsSortOpen(!c.isSortOpen)}
 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
 >
 Sort By: {c.sortBy} <FaChevronDown className={`transition-transform duration-300 ${c.isSortOpen ?'rotate-180' :''}`} size={7} />
 </button>
 
 {c.isSortOpen && (
 <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-zinc-200 shadow-xl z-20">
 {['Newest','Highest','Lowest'].map((type) => (
 <button 
 key={type}
 onClick={() => c.handleSort(type)}
 className="w-full text-left px-4 py-3 text-[9px] font-bold uppercase tracking-wider text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 border-b border-zinc-100 last:border-0 transition-colors"
 >
 {type} Feed
 </button>
 ))}
 </div>
 )}
 </div>
 </div>

 {/* DYNAMIC REVIEWS FEED ROW LOOP */}
 <div className="space-y-12">
 {c.allReviews.slice((c.page - 1) * c.pageSize, c.page * c.pageSize).map((rev) => (
 <div key={rev.id} className="border-b border-zinc-100 pb-12 last:border-0 last:pb-0">
 <div className="flex justify-between items-start mb-4">
 <div>
 <div className="flex items-center gap-2 mb-1.5">
 <span className="text-xs font-bold text-zinc-900">{rev.user}</span>
 {rev.verified && (
 <span className="inline-flex items-center gap-1 text-[8px] font-black text-zinc-500 bg-zinc-100 px-1.5 py-0.5 uppercase tracking-wider rounded-none">
 <FaCheckCircle size={8} /> Verified Look
 </span>
 )}
 </div>
 <div className="flex gap-0.5 text-zinc-900">
 {[...Array(5)].map((_, i) => (
 <FaStar key={i} size={9} className={i < rev.rating ?"text-zinc-900" :"text-zinc-200"} />
 ))}
 </div>
 </div>

 <div className="flex items-center gap-4">
 <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{rev.date}</span>
 {c.user && (String(rev.userId) === String(c.user.id) || c.user.role ==='Admin') && (
 <div className="flex items-center gap-2 pt-0.5">
 <button
 type="button"
 onClick={() => c.handleEditReview(rev)}
 className="text-zinc-400 hover:text-zinc-900 transition-colors"
 title="Modify Entry"
 >
 <Edit3 size={14} />
 </button>
 <button
 type="button"
 onClick={() => c.handleDeleteReview(rev)}
 className="text-zinc-400 hover:text-red-600 transition-colors"
 title="Purge Feedback"
 >
 <Trash2 size={14} />
 </button>
 </div>
 )}
 </div>
 </div>

 {rev.title && (
 <h4 className="text-xs font-black uppercase mb-2 tracking-wide text-zinc-900">{rev.title}</h4>
 )}
 <p className="text-zinc-500 text-xs leading-relaxed max-w-2xl">"{rev.comment}"
 </p>

 {/* IMAGE ATTACHMENTS RE-ENGAGEMENT MARGIN */}
 {rev.images?.length > 0 && (
 <div className="mt-4 flex flex-wrap gap-2">
 {rev.images.map((img, idx) => (
 <div key={idx} className="relative group w-16 h-20 bg-zinc-50 border border-zinc-200 overflow-hidden">
 <img
 src={img}
 onClick={() => c.handleImageClick(idx, rev.images.map((image) => ({
 img: image,
 title: rev.title,
 comment: rev.comment,
 user: rev.user,
 date: rev.date
 })))}
 alt="Client attachment track"
 className="h-full w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
 />

 {c.user && (String(rev.userId) === String(c.user.id) || c.user.role ==='Admin') && (
 <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity p-1">
 <button
 type="button"
 onClick={() => {
 const input = document.createElement('input');
 input.type ='file';
 input.accept ='image/png,image/jpeg,image/webp';
 input.onchange = (e) => {
 const f = e.target.files && e.target.files[0];
 if (f) c.handleReplaceReviewImage(rev.id, img, f);
 };
 input.click();
 }}
 className="w-full bg-white text-[8px] font-bold uppercase tracking-tighter text-zinc-900 py-0.5 text-center hover:bg-zinc-50"
 >
 Swap
 </button>
 <button
 type="button"
 onClick={() => c.handleDeleteReviewImage(rev.id, img)}
 className="w-full bg-black text-[8px] font-bold uppercase tracking-tighter text-white py-0.5 text-center hover:bg-zinc-800"
 >
 Drop
 </button>
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>

 {/* PAGINATION INTERFACES */}
 {c.allReviews.length > c.pageSize && (
 <div className="mt-16 flex items-center justify-between pt-6 border-t border-zinc-100">
 <button
 type="button"
 onClick={() => c.setPage((p) => Math.max(1, p - 1))}
 disabled={c.page <= 1}
 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
 >
 &larr; Previous Track
 </button>
 <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
 Track {c.page} / {Math.max(1, Math.ceil(c.allReviews.length / c.pageSize))}
 </div>
 <button
 type="button"
 onClick={() => c.setPage((p) => Math.min(Math.max(1, Math.ceil(c.allReviews.length / c.pageSize)), p + 1))}
 disabled={c.page >= Math.ceil(c.allReviews.length / c.pageSize)}
 className="text-[10px] font-black uppercase tracking-widest text-zinc-900 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
 >
 Next Track &rarr;
 </button>
 </div>
 )}
 </div>

 </div>
 )}
 </div>
 </section>
 );
};

export default ProductReviews;