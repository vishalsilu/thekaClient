import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryAdvertisement = ({ data }) => {
  const navigate = useNavigate();

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

  const getLayoutConfig = (position) => {
    switch (position) {
      case 'start':
        return {
          wrapper: 'justify-start',
          textAlignment: 'items-start text-left',
          // Darker 'via' point on mobile ensures text spanning the width remains readable
          gradient: 'bg-gradient-to-r from-black/95 via-black/60 sm:via-black/50 to-transparent',
        };
      case 'end':
        return {
          wrapper: 'justify-end',
          textAlignment: 'items-end text-right',
          gradient: 'bg-gradient-to-l from-black/95 via-black/60 sm:via-black/50 to-transparent',
        };
      case 'center':
      default:
        return {
          wrapper: 'justify-center',
          textAlignment: 'items-center text-center',
          gradient: 'bg-gradient-to-t from-black/95 via-black/50 to-black/10',
        };
    }
  };

  const layout = getLayoutConfig(ad?.textPosition);

  return (
    <div className="mx-auto w-[95%] md:w-[90%] py-4 md:py-8">
      <article
        onClick={() => handleAdClick(ad?.url)}
        className="cursor-pointer group relative flex flex-col overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 bg-neutral-900"
      >
        {/* Slightly taller base height on mobile (280px) to ensure tall text blocks don't get crushed */}
        <img
          src={ad?.image}
          alt="Advertisement"
          className="w-full h-[280px] sm:h-[350px] md:h-auto md:min-h-[350px] md:max-h-[500px] object-cover transition-transform duration-[10s] ease-out group-hover:scale-105"
        />

        <div className={`absolute inset-0 pointer-events-none ${layout.gradient}`} />

        {/* Reduced padding on mobile (p-3) */}
        <div className={`absolute inset-0 p-3 sm:p-6 md:p-8 lg:p-10 flex flex-row items-center ${layout.wrapper}`}>
          
          {/* Max-width set to 95% on mobile so text can utilize the screen real estate */}
          <div className={`flex flex-col gap-y-1.5 sm:gap-y-3 md:gap-y-4 max-w-[95%] sm:max-w-md md:max-w-xl lg:max-w-2xl w-full max-h-full overflow-hidden py-1 sm:py-2 ${layout.textAlignment}`}>
            
            {ad?.title && (
              <h2 className="flex-shrink-0 text-yellow-400 text-lg sm:text-2xl md:text-3xl lg:text-5xl font-extrabold tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight">
                {ad.title}
              </h2>
            )}
            
            {ad?.description && (
              <p className="text-[11px] sm:text-sm md:text-base lg:text-lg text-neutral-100 font-medium leading-snug drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] line-clamp-3 sm:line-clamp-4 lg:line-clamp-5">
                {ad.description}
              </p>
            )}
            
            {ad?.code && (
              <div className="py-0.5 sm:py-2 flex-shrink-0 mt-0.5 sm:mt-0">
                <span className="inline-block px-2.5 py-1 sm:px-6 sm:py-3 border border-yellow-500/50 bg-yellow-500/10 backdrop-blur-sm rounded-md sm:rounded-xl text-sm sm:text-3xl md:text-4xl lg:text-5xl text-yellow-400 font-black tracking-widest shadow-[0_0_30px_rgba(234,179,8,0.2)] drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
                  {ad.code}
                </span>
              </div>
            )}
            
            {ad?.buttonText && (
              <button className="flex-shrink-0 mt-1.5 sm:mt-2 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold text-[10px] sm:text-sm md:text-base lg:text-lg px-3 py-1.5 sm:px-8 sm:py-3 rounded-full transition-all duration-300 transform group-hover:-translate-y-1 group-hover:shadow-[0_10px_30px_rgba(234,179,8,0.4)] shadow-md sm:shadow-lg w-fit pointer-events-auto">
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