import { useEffect, useMemo } from'react';
import { useDispatch, useSelector } from'react-redux';
import { useParams } from'react-router-dom';
import { getCollections, getProductsByCollection } from'../../Redux/controllers/metaDataController';

export const useMoreCollectionsController = () => {
 const { type } = useParams();
 const dispatch = useDispatch();

 // Redux Selectors
 const collections = useSelector(state => state.metaData.collections);
 const collectionProducts = useSelector(state => state.metaData.collectionProducts);
 const isLoading = useSelector(state => state.metaData.isLoading);

 const normalizedType = useMemo(
 () => decodeURIComponent(type ||'').toLowerCase().trim(),
 [type]
 );

 const normalizeForMatch = (value ='') =>
 value.toLowerCase().trim().replace(/[-\s]+/g,'-');

 // Match collection layout context matching current route parameters
 const currentCollection = useMemo(() => {
 if (!collections?.length || !normalizedType) return null;

 return collections.find(collection =>
 normalizeForMatch(collection.name ||'') === normalizeForMatch(normalizedType)
 );
 }, [collections, normalizedType]);

 const normalizedCollectionProducts = useMemo(() => {
 if (Array.isArray(collectionProducts)) return collectionProducts;
 if (Array.isArray(collectionProducts?.data)) return collectionProducts.data;
 return [];
 }, [collectionProducts]);

 // Sync state tracking if collections array catalog is empty
 useEffect(() => {
 if (!collections?.length) {
 dispatch(getCollections());
 }
 }, [collections?.length, dispatch]);

 // Dispatch API pipeline requests when tracking variant differences
 useEffect(() => {
 if (currentCollection?.name) {
 dispatch(getProductsByCollection(currentCollection.name));
 }
 }, [currentCollection?.name, dispatch]);

 // Grouping mapping calculation engine
 const categorizedProducts = useMemo(() => {
 if (!currentCollection?.allCategories?.length || !normalizedCollectionProducts.length) {
 return [];
 }

 return currentCollection.allCategories
 .map(category => {
 const categoryName = typeof category ==='string' ? category : category?.name;
 if (!categoryName) return null;

 const categoryProducts = normalizedCollectionProducts
 .filter(product =>
 (typeof product.category ==='string'
 ? product.category
 : product.category?.name
 )?.toLowerCase() === categoryName.toLowerCase()
 )
 .slice(0, 4); // Limit row item render lengths strictly to 4

 return categoryProducts.length > 0 ? {
 ...(typeof category ==='object' ? category : {}),
 name: categoryName,
 products: categoryProducts
 } : null;
 })
 .filter(Boolean);
 }, [currentCollection, normalizedCollectionProducts]);

 return {
 type,
 isLoading,
 currentCollection,
 categorizedProducts,
 hasProducts: normalizedCollectionProducts.length > 0
 };
};