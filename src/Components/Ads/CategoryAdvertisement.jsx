import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryAdvertisement = ({ data }) => {
  const navigate = useNavigate();

  // Safety fallback if the ad data is nested inside fullData from your useEffect, or just passed directly
  const ad = data?.fullData || data;

  if (!ad || !ad.image) return null;

  const handleAdClick = (link) => {
    if (!link) return;
    if (link.startsWith('http://') || link.startsWith('https://')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  };

  // Maps your backend textPosition to the perfect flexbox and gradient classes
  const getLayoutConfig = (position) => {
    switch (position) {
      case 'start': // Text on the LEFT
        return {
          wrapper: 'justify-start',
          textAlignment: 'items-start text-left',
          gradient: 'bg-gradient-to-r from-black/90 via-black/50 to-transparent',
        };
      case 'end': // Text on the RIGHT
        return {
          wrapper: 'justify-end',
          textAlignment: 'items-end text-right',
          gradient: 'bg-gradient-to-l from-black/90 via-black/50 to-transparent',
        };
      case 'center': // Text in the CENTER
      default:
        return {
          wrapper: 'justify-center',
          textAlignment: 'items-center text-center',
          gradient: 'bg-gradient-to-t from-black/90 via-black/40 to-black/10',
        };
    }
  };

  const layout = getLayoutConfig(ad?.textPosition);

  return (
    // Slightly wider on mobile (95%) and standard on desktop (90%)
    <div className="mx-auto w-[95%] md:w-[90%] py-4 md:py-8">
      <article
        onClick={() => handleAdClick(ad?.url)}
        className="cursor-pointer group relative flex flex-col overflow-hidden rounded-2xl md:rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 bg-neutral-900"
      >
        {/* --- LAYER 1: STRUCTURAL IMAGE --- */}
        {/* On mobile: forced to 250px height so text fits. On desktop: auto-height to perfectly wrap the image */}
        <img
          src={ad?.image}
          alt="Advertisement"
          className="w-full h-[250px] sm:h-[300px] md:h-auto md:min-h-[300px] object-cover transition-transform duration-[10s] ease-out group-hover:scale-105"
        />

        {/* --- LAYER 2: DYNAMIC GRADIENT MASK --- */}
        <div className={`absolute inset-0 pointer-events-none ${layout.gradient}`} />

        {/* --- LAYER 3: DYNAMIC TEXT CONTENT --- */}
        <div className={`absolute inset-0 p-4 sm:p-6 md:p-12 lg:p-16 flex flex-row items-center ${layout.wrapper}`}>
          
          <div className={`flex flex-col gap-y-2 sm:gap-y-3 md:gap-y-5 max-w-[90%] sm:max-w-md md:max-w-lg w-full ${layout.textAlignment}`}>
            
            {ad?.title && (
              <h2 className="text-yellow-400 text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight">
                {ad.title}
              </h2>
            )}
            
            {ad?.description && (
              // line-clamp-2 prevents text overflow on very small phones
              <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-neutral-100 font-medium leading-snug drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] line-clamp-2 md:line-clamp-none">
                {ad.description}
              </p>
            )}
            
            {ad?.code && (
              <div className="py-1 md:py-2">
                <span className="inline-block px-3 py-1.5 md:px-6 md:py-3 border border-yellow-500/50 bg-yellow-500/10 backdrop-blur-sm rounded-lg md:rounded-xl text-xl sm:text-3xl md:text-5xl lg:text-6xl text-yellow-400 font-black tracking-widest shadow-[0_0_30px_rgba(234,179,8,0.2)] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                  {ad.code}
                </span>
              </div>
            )}
            
            {ad?.buttonText && (
              <button className="mt-1 md:mt-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-xs sm:text-sm md:text-lg px-4 py-2 md:px-10 md:py-4 rounded-full transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_rgba(234,179,8,0.4)] shadow-lg w-fit pointer-events-auto">
                {ad.buttonText}
              </button>
            )}

          </div>
        </div>
      </article>
    </div>
  );
};

export default CategoryAdvertisement;