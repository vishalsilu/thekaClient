// controllers/CollectionController.jsx
import React from'react';
import { useParams } from'react-router-dom';
import { useSelector } from'react-redux';
import CollectionGrid from'../Views/Collection/CollectionGrid';
import AdvertisementBanner from'../Components/Ads/AdvertisementBanner';

const Collection = () => {
 const { type } = useParams();
 const collections = useSelector((state) => state.metaData.collections);

 // Match the active targeted collection context based on dynamic parameters
 const typeCollection = collections?.find(
 (col) => col?.name?.toLowerCase() === type?.toLowerCase()
 );

 // Normalize mapping structure payloads cleanly down into presentation nodes
const displayItems = type
  ? typeCollection?.allCategories?.map((cat) => ({
      ...cat,
      collectionName: typeCollection.name,
      // Helper function to clean path segments
      targetPath: `/collections/${cat.path.split('/').filter(Boolean).map(s => s.replace(/[^a-z0-9]+/g, "-")).join('/')}`,
    }))
  : collections?.map((col) => ({
      ...col,
      targetPath: `/collections/${col.path.split('/').filter(Boolean).map(s => s.replace(/[^a-z0-9]+/g, "-")).join('/')}`,
    }));
console.log(displayItems)

 const displayTitle = type && typeCollection ? typeCollection.name :"Our Collections";

 return (
 <div className="bg-zinc-50 min-h-screen">
 {/* Structural layout insertion points for third-party networks */}
 
 {/* Decoupled view presentation container block rendering */}
 <CollectionGrid 
 title={displayTitle} 
 items={displayItems || []} 
 />
 <AdvertisementBanner location="collection" />
 </div>
 );
};

export default Collection;