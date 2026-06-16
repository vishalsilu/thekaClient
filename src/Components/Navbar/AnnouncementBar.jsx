import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import copy from 'copy-to-clipboard';

function AnnouncementBar({ topOffers }) {
    // Guard clause if no offer data is available
    if (!topOffers || topOffers.length === 0) return null;

    // Duplicate for seamless infinite loop
    const duplicatedOffers = [...topOffers, ...topOffers, ...topOffers];

const handleCopyCode = (code) => {
    if (!code) return;
    
    // The library handles the modern API, the fallback textarea, 
    // and mobile security permissions automatically.
    const success = copy(code);
    
    if (success) {
       toast.success('Copied!', {
            duration: 2000, // Use 'duration' not 'autoClose'
        });
    } else {
        toast.error('Failed to copy', {
            duration: 2000,
        });
    }
};


return (
    <div className="w-full h-10 bg-slate-800 text-white text-xs font-semibold flex items-center overflow-hidden relative">

        <motion.div
            className="flex items-center gap-12 whitespace-nowrap will-change-transform"
            animate={{ x: ['0%', '-33.333%'] }}
            transition={{
                ease: 'linear',
                duration: 30,
                repeat: Infinity,
                repeatType: 'loop',
            }}
        >
            {duplicatedOffers.map((offer, index) => (
                <div key={index} className="flex items-center gap-4 px-2">
                    <h1 className="inline-flex items-center tracking-wide">
                        <span className="text-stone-300 font-bold uppercase tracking-widest mr-2">
                            {offer.title}
                        </span>
                        <span className="text-stone-400 font-normal">
                            {offer.description}
                        </span>
                        {offer.code && (
                            <span onClick={() => handleCopyCode(offer.code)} className="ml-3 px-2 py-0.5 bg-white text-stone-950 font-mono text-[10px] font-bold uppercase tracking-wider hover:cursor-pointer">
                                {offer.code}
                            </span>
                        )}
                    </h1>

                    {/* Elegant Divider */}
                    <span className="text-stone-700 ml-8 font-light select-none text-sm">/</span>
                </div>
            ))}
        </motion.div>
    </div>
);
}

export default AnnouncementBar;