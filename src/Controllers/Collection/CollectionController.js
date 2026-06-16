// controllers/CollectionController.jsx
import React from'react';
import { useParams } from'react-router-dom';
import { useSelector } from'react-redux';
import { useTextFavicon } from'../../Utils/useTextFavicon';
import AdvertisementBanner from'../../Components/Ads/AdvertisementBanner';
import CollectionGrid from'../../Views/Collection/CollectionGrid';

const CollectionController = () => {
 const { type } = useParams();
 const collections = useSelector(state => state.metaData.collections);
 const data = useSelector((state) => state.siteData.data);

 // Match the active dynamic collection from global store
 const activeCollection = collections?.find(
 col => col?.name?.toLowerCase() === type?.toLowerCase()
 );

 // Normalize mapping schemas: Categorized line items vs high-level groups
 const displayItems = activeCollection 
 ? activeCollection.allCategories.map(cat => ({
 ...cat,
 collectionName: activeCollection.name,
 targetPath: `/collections/${cat.path}`
 }))
 : collections?.map(col => ({
 ...col,
 targetPath: `/collections/${col.name?.toLowerCase()}`
 }));

 const displayTitle = activeCollection ? activeCollection.name :"Our Collections";

 // Dynamic system hook initialization for custom tab favicons
 useTextFavicon("CU", `${displayTitle ||"COLLECTION"} - ${data?.websiteName}`, {
 bgColor:"#10b981", 
 textColor:"#ffffff"
 });

 return (
 <div className="bg-zinc-50 min-h-screen">
 {/* Structural system placement for contextual marketplace banners */}
 <AdvertisementBanner location="collection" />
 
 {/* Inject presentation parameters directly down into view container context */}
 <CollectionGrid 
 title={displayTitle} 
 items={displayItems || []} 
 />
 </div>
 );
};

export default CollectionController;