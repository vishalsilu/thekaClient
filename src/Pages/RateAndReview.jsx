import React from'react';
import { Star, Camera, ChevronLeft, CheckCircle } from'lucide-react'; // Fixed CheckLine to CheckCircle
import { useRateAndReview } from'../Controllers/RateAndReview/useRateAndReview';

const RateAndReview = () => {
 const {
 orderId,
 items,
 reviews,
 reviewFiles,
 submitting,
 navigate,
 handleRating,
 handleHover,
 handleInputChange,
 handleFileChange,
 getRatingLabel,
 handleSubmit
 } = useRateAndReview();

 // Show all items for review so users can submit multiple reviews for same product
 const finalOrders = Array.isArray(items) ? items : [];

 return (
 items && items.length > 0 ? ( 
 <div className="max-w-6xl mx-auto my-4 min-h-screen">
 {/* Header */}
 <div className=" p-4 flex items-center gap-4 border-b border-gray-200 sticky top-0 z-10 shadow-sm">
 <button onClick={() => navigate(-1)} className="hover:bg-gray-100 p-1 rounded-full">
 <ChevronLeft size={24} />
 </button>
 <div>
 <h1 className="text-xl font-medium">Ratings & Reviews</h1>
 <p className="text-sm">Order #{orderId}</p>
 </div>
 </div>

 {/* Content Body */}
 <div className="flex flex-col md:flex-row gap-4 mt-4 px-4 pb-10">
 {/* Side Guidelines */}
 <div className="hidden md:block w-1/4 p-6 shadow-sm self-start sticky top-24">
 <h2 className="text-lg font-medium mb-6">Reviewing Guidelines</h2>
 <div className="space-y-6 text-sm">
 <p><strong>Be honest.</strong> Your feedback helps other shoppers choose the right fit.</p>
 <p><strong>Share details.</strong> Tell us about sizing, fabric, and comfort.</p>
 <p><strong>Upload photos.</strong> Review pictures help others trust your opinion.</p>
 </div>
 </div>

 {/* Review Forms */}
 <div className="flex-1 space-y-6">
 {finalOrders.map((item, index) => {
 const review = reviews[index] || {};
 const selectedFiles = reviewFiles[index] || [];

 return (
 <div key={`${item.productId}-${index}`} className=" shadow-sm border border-gray-500 rounded-sm overflow-hidden">
 {/* Item Header */}
 <div className="p-4 flex items-center gap-4 border-b border-gray-100">
 <img
 src={item.thumbnail || item.images?.[0] ||'/api/placeholder/60/60'}
 alt={item.name}
 className="w-12 h-16 object-cover border"
 />
 <div>
 <h3 className="font-medium text-[15px]">{item.name ||'Product'}</h3>
 <p className="text-xs">Size: {item.size ||'N/A'} • {item.variant ||'Standard'}</p>
 </div>
 </div>

 {/* Star Rating Panel */}
 <div className="p-6 border-b border-gray-100">
 <h2 className="text-sm font-bold uppercase text-gray-400 mb-4 tracking-wider">Rate this product</h2>
 <div className="flex flex-wrap gap-4 items-center">
 <div className="flex gap-2">
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 type="button"
 onMouseEnter={() => handleHover(index, star)}
 onMouseLeave={() => handleHover(index, 0)}
 onClick={() => handleRating(index, star)}
 className="focus:outline-none"
 >
 <Star
 size={28}
 className="transition-colors"
 fill={(review.hover || review.rating) >= star ?'#ffda00' :'#e0e0e0'}
 stroke="none"
 />
 </button>
 ))}
 </div>
 {/* Fixed placement of Rating Text Label */}
 {(review.hover || review.rating) > 0 && (
 <span className="text-green-700 font-medium text-sm ml-2">
 {getRatingLabel(review.hover || review.rating)}
 </span>
 )}
 </div>
 </div>

 {/* Review Text Input Section */}
 <div className="p-6">
 <h2 className="text-sm font-bold uppercase text-gray-400 mb-4 tracking-wider">Review this product</h2>
 <div className="space-y-4">
 <div className="relative border border-gray-200 rounded-sm focus-within:border-blue-500 transition-all">
 <label className="absolute top-2 left-3 text-[11px] uppercase font-bold">Description</label>
 <textarea
 value={review.description ||''}
 onChange={(e) => handleInputChange(index,'description', e.target.value)}
 placeholder="What did you like or dislike about this product?"
 className="w-full pt-7 pb-3 px-3 min-h-[120px] outline-none text-[15px] resize-none"
 />
 </div>

 <div className="relative border border-gray-200 rounded-sm focus-within:border-blue-500 transition-all">
 <label className="absolute top-2 left-3 text-[11px] uppercase font-bold">Title (optional)</label>
 <input
 type="text"
 value={review.title ||''}
 onChange={(e) => handleInputChange(index,'title', e.target.value)}
 placeholder="Summarize your review"
 className="w-full pt-7 pb-3 px-3 outline-none text-[15px]"
 />
 </div>

 <label className="flex items-center gap-3 px-4 py-3 border border-dashed border-gray-300 rounded cursor-pointer hover:bg-surface transition-colors">
 <Camera size={18} className="" />
 <span className="text-sm">Upload photos</span>
 <input
 type="file"
 accept="image/jpeg, image/png, image/webp"
 multiple
 onChange={(e) => handleFileChange(index, e.target.files)}
 className="sr-only"
 />
 </label>

 <p className="text-xs">
 {selectedFiles.length > 0 ? `${selectedFiles.length} photo(s) selected` :'Add up to 5 photos to show the product in real life.'}
 </p>
 </div>
 </div>
 </div>
 );
 })}

 {/* Bottom Floating Action Bar */}
 <div className="bg-surface p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t shadow-lg rounded-sm sticky bottom-4">
 <p className="text-sm">
 Submit reviews for Order #{orderId}
 </p>
 <button
 onClick={handleSubmit}
 disabled={submitting || finalOrders.length <= 0}
 className="bg-[#fb641b] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f4510b] text-white font-bold py-4 px-16 rounded shadow-md transition-all uppercase tracking-wide w-full sm:w-auto"
 >
 {submitting ?'Submitting...' : `Submit Your ${finalOrders.length <= 1 ?"Review" :"All Reviews"}`}
 </button>
 </div>
 </div>
 </div>
 </div>
 ) : ( 
 /* Empty State fallback: Already Reviewed */
 <div className='w-full h-full min-h-[72vh] flex justify-center items-center'> 
 <div className="flex flex-col items-center justify-center gap-6">
 <CheckCircle size={78} className='text-emerald-500' />
 <h1 className='text-2xl mx-auto font-semibold text-emerald-800'>You Have Already Reviewed This Order</h1>
 <button 
 onClick={() => navigate('/orders')} 
 className="bg-gradient-to-r from-emerald-500 via-emerald-700 to-emerald-900 hover:from-emerald-900 hover:via-emerald-700 hover:to-emerald-500 text-white font-bold py-2 px-6 rounded shadow-md transition-all uppercase tracking-wide"
 >
 Go Back
 </button>
 </div>
 </div>
 )
 );
};

export default RateAndReview;