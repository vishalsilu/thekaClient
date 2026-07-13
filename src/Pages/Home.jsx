import React from'react';
import { useHomeData } from'../Controllers/Home/useHomeData'; // Imports your data controller hook wrapper
import Hero from'../Views/Home/Hero'; // Assuming you have a Hero component for the top section
import AdvertisementBanner from'../Components/Ads/AdvertisementBanner';
import FeaturedCollection from'../Views/Collection/FeaturedCollections';
import OurStory from'../Components/Home/OurStory';

// Unused structural imports cleaned out to maintain clean processing compilation rules
const Home = () => {
 // Inject the structured data/logic cleanly
 const { data, isLoading } = useHomeData();

 // Optional: Return a clean loading block frame if necessary during async pipeline executions
 if (isLoading && !data) {
 return (
 <div className="w-full h-screen bg-white text-stone-400 flex items-center justify-center font-mono text-xs">
 Synchronizing Workspace Context Engine...
 </div>
 );
 }

 return (
 <div className="h-auto w-full bg-surface">
 {/* HERO PRESENTATION VIEW SECTION */}
 <Hero Data={data?.hero} />
 <AdvertisementBanner location="home" max={1} />
 
 {/* DYNAMIC MARKETING BANNER PIPELINE CONTAINER */}
 
 {/* FEATURED INBOUND ARCHIVE COLLECTION BLOCK */}
 <div className="py-2">
 <FeaturedCollection />
 </div>
{/* <OurStory/> */}
 </div>
 );
};

export default Home;