import { useEffect, useMemo, useRef } from'react';
import { useDispatch, useSelector } from'react-redux';
import { getFeaturedCollection, getProductsByCollection } from'../../Redux/controllers/metaDataController';

export const useFeaturedCollections = () => {
 const dispatch = useDispatch();
 
 const { 
 featuredCollections, 
 collectionProducts, 
 collectionProductsMap, 
 isLoading 
 } = useSelector(state => state.metaData);

 // Track which specific collections have fired off a network dispatch
 const trackedDispatches = useRef(new Set());

 // Helper utility method to normalize variant layers into individual product indices
 const flattenVariantProducts = (products = []) => {
 return products.flatMap((product) => {
 if (Array.isArray(product.variants) && product.variants.length > 0) {
 return product.variants.map((variant, index) => ({
 ...product,
 id: product.id || product._id,
 _id: product._id || product.id,
 variantId: variant.id ?? variant._id ?? `${product.id || product._id}-${index}`,
 thumbnail: variant.images?.[0] || product.thumbnail || product.images?.[0],
 color: variant.color || (Array.isArray(product.color) ? product.color[0] : product.color) ||'Default',
 inStock: variant.sizes?.some((s) => s.stock > 0),
 size: variant.sizes?.[0]?.size ||'',
 }));
 }
 return [{
 ...product,
 id: product.id || product._id,
 _id: product._id || product.id,
 }];
 });
 };

 // Fetch collections layout payload baseline structure
 useEffect(() => {
 dispatch(getFeaturedCollection());
 }, [dispatch]);

 // Dispatch queries dynamically targeting un-cached records exclusively
 useEffect(() => {
 if (featuredCollections?.length > 0) {
 featuredCollections.forEach(col => {
 if (col.name) {
 const lowerCaseName = col.name.toLowerCase();
 
 if (!trackedDispatches.current.has(lowerCaseName)) {
 trackedDispatches.current.add(lowerCaseName);
 dispatch(getProductsByCollection(col.name));
 }
 }
 });
 }
 }, [dispatch, featuredCollections]);

 // Compute presentation row coordinates cleanly
 const featuredRows = useMemo(() => {
 if (!Array.isArray(featuredCollections)) return [];

 const productsArray = (Array.isArray(collectionProducts) && collectionProducts.length > 0)
 ? collectionProducts
 : Object.values(collectionProductsMap || {}).flat();

 return featuredCollections.flatMap((col) => {
 if (!Array.isArray(col?.featured)) return [];

 const colName = col.name ||"";
 const typeSlug = colName.toLowerCase().replace(/\s+/g,'-');

 return col.featured.map((featEntry) => {
 const categoryName = featEntry?.featuredCategory?.name;
 const categoryId = featEntry?.featuredCategory?._id;
 
 if (!categoryName || !categoryId) return null;

 const matchedProducts = productsArray.filter((p) => {
 if (!p) return false;
 const productCol = p.collectionInfo?.name || p.type ||""; 
 const productCat = p.categoryInfo?.name || p.category ||"";
 
 return (
 productCol.toLowerCase() === colName.toLowerCase() &&
 productCat.toLowerCase() === categoryName.toLowerCase()
 );
 });

 const flattened = flattenVariantProducts(matchedProducts);

 // Ensure non-variant products have an explicit `inStock` flag and preserve original order
 const withStock = flattened.map((prod, idx) => ({
 ...prod,
 inStock: Boolean(
 prod.inStock ||
 (prod.sizes && prod.sizes.some((s) => s.stock > 0)) ||
 prod.stock > 0 ||
 prod.quantity > 0 ||
 prod.inStock === true
 ),
 __origIndex: idx,
 }));

 // Move sold-out items to the end while preserving relative ordering
 withStock.sort((a, b) => {
 const aStock = a.inStock ? 1 : 0;
 const bStock = b.inStock ? 1 : 0;
 if (aStock !== bStock) return bStock - aStock;
 return a.__origIndex - b.__origIndex;
});

 const productsForRow = withStock.map(({ __origIndex, ...rest }) => rest);

 return {
 id: `${col._id}-${categoryId}`,
 collectionName: colName,
 categoryName: categoryName,
 slug: typeSlug,
 categorySlug: categoryName.toLowerCase().replace(/\s+/g,'-'),
 products: productsForRow
 };
 });
 })
 .filter((row) => row !== null && row.products.length > 0); 
 }, [featuredCollections, collectionProducts, collectionProductsMap]);

 return {
 featuredRows,
 isLoading
 };
};