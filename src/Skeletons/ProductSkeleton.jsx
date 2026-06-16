import React from'react';

const ProductSkeleton = () => {
 const skeletonCards = Array(4).fill(0);

 return (
 /* REMOVED: lg:w-5/6 and mx-auto 
 ADDED: col-span-full
 This allows the skeleton's internal grid to align 
 perfectly with the parent grid.
 */
 <div className="col-span-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
 {skeletonCards.map((_, index) => (
 <div 
 key={index} 
 /* Removed max-w-[300px] so it fills the available grid space */
 className="flex flex-col w-full border-2 py-3 animate-pulse rounded-xl"
 >
 {/* Image Container Skeleton */}
 <div className="relative w-full h-[450px] bg-gray-200 rounded-lg overflow-hidden">
 <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_1.5s_infinite]" />
 
 {/* Eye Icon Placeholder */}
 <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-gray-300" />
 
 {/* Button Placeholder */}
 <div className="absolute bottom-12 left-0 right-0 w-5/6 mx-auto bg-gray-300 h-12 rounded-xl" />
 </div>

 {/* Product Details Skeleton */}
 <div className="mt-4 flex flex-col items-center gap-3">
 <div className="h-5 w-3/4 bg-gray-300 rounded-md" />
 <div className="h-4 w-1/4 bg-gray-200 rounded-md" />
 </div>
 </div>
 ))}

 <style jsx>{`
 @keyframes shimmer {
 100% { transform: translateX(100%); }
 }
 .animate-\[shimmer_1\.5s_infinite\] {
 animation: shimmer 1.5s infinite;
 }
 `}</style>
 </div>
 );
};

export default ProductSkeleton;