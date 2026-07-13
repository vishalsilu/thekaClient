import React from 'react';
import { useSelector } from 'react-redux';
import { FiArrowRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';

const locationLabels = {
  home: 'Home Special',
  collection: 'Curated Collection',
  product: 'Spotlight Feature',
  cart: 'Exclusive Offer',
  checkout: 'Final Addition',
  all: 'Featured Placement',
};

const AdvertisementBanner = ({ location = 'home', max = 1 , image=null }) => {
    const navigate= useNavigate()
  const ads = useSelector((state) => state.siteData.data?.advertisements || []);

  // 1. Find ads specifically targeted to the current page location
  const specificAds = ads.filter(
    (ad) => (ad.location || 'all').toLowerCase() === location.toLowerCase()
  );

  // 2. Find fallback ads targeted to 'all' locations
  const generalAds = ads.filter(
    (ad) => (ad.location || 'all').toLowerCase() === 'all'
  );

  // 3. Prioritize specific ads. If none exist, use the general 'all' ads.
  const prioritizedAds = specificAds.length > 0 ? specificAds : generalAds;

  // 4. Restrict the output to match the `max` prop limit (default is 1)
  const finalAds = prioritizedAds.slice(0, max);

  if (finalAds.length === 0) {
    return null;
  }

  const handleAdClick = (link) => {
  if (!link) return; // Do nothing if there is no link

  // Check if it is an external website
  if (link.startsWith('http://') || link.startsWith('https://')) {
    // Opens the external link in a new tab (recommended for ads)
    window.open(link, '_blank', 'noopener,noreferrer');
    
    // Alternatively, if you want it to open in the SAME tab, use this instead:
    // window.location.href = link;
  } else {
    // If it is an internal path, use React Router
    navigate(link);
  }
};

  return (
    <div className="mx-auto w-full space-y-8 py-8 sm:px-6 lg:px-8">
      {finalAds.map((ad, index) => (
        <article
          key={`${ad.title || 'ad'}-${index}`}
onClick={()=>handleAdClick(ad?.link)}
          className="cursor-pointer group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.04)] transition-all duration-300 md:flex-row md:items-center"
        >
<div className='absolute hidden group-hover:flex  font-black backdrop-blur-sm bg-black/40 px-8 py-5 z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center gap-y-3'>
<h1 className='text-white'>{ad?.title}</h1>
<h1 className='text-white'>{ad?.description}</h1>
            <button className='bg-black px-12 py-3 rounded-xl text-white hover:bg-emerald-500' onClick={()=>handleAdClick(ad?.link)}>{ad?.buttonText}</button>

</div>
          {/* --- IMAGE SECTION (Responsive, No Cropping) --- */}
          {ad.imageUrl ? (
            <div className="relative flex w-full items-center justify-center overflow-visible rounded-t-2xl border-stone-100 bg-stone-50 md:border-r md:rounded-t-none">
              <img
                src={ad.imageUrl}
                alt={ad.title || `Advertisement ${index + 1}`}
                className="h-auto max-w-full object-contain transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
          ) : null}

          {/* --- CONTENT SECTION --- */}
        </article>
      ))}
    </div>
  );
};

export default AdvertisementBanner;