import { createSlice } from'@reduxjs/toolkit';
import { getCollections, getFeaturedCollection,getFeaturedProducts, getProducts, getProductsByCollection, getSingleProduct , searchEveryThing, validateCoupon } from'../controllers/metaDataController';
import Cookies from'js-cookie';
import toast from'react-hot-toast';

const getInitialCoupon = () => {
 const savedCoupon = Cookies.get('appliedCoupon');
 if (savedCoupon) {
 try {
 return JSON.parse(savedCoupon);
 } catch (e) {
 console.error("Error parsing coupon cookie data", e);
 return null;
 }
 }
 return null;
};

const metaDataSlice = createSlice({
 name:'collection',
 initialState : {
 collections : [],
 products : [],
 product : [],
 searchResult : [],
 collectionProducts : [],
 // Keep a map of collectionName(lowercase) -> products array
 collectionProductsMap: {},
 appliedCoupon : getInitialCoupon(),
 featuredCollections : [],
 featuredProducts : [],
 isLoading: false,
 error: null,
 couponError: null
},
 reducers: {
 cleanResult: (state) =>{
state.searchResult = []
 },
 removeAppliedCoupon: (state) => {
 state.appliedCoupon = null;
 Cookies.remove('appliedCoupon');
 }
 },
 extraReducers: (builder) => {
 builder
 .addCase(getCollections.pending , (state,action) => {
 state.isLoading = true
 }) 
 .addCase(getCollections.fulfilled , (state,action) => {
 state.isLoading = false;
 const collectionsPayload = action.payload?.collections || action.payload;
 state.collections = Array.isArray(collectionsPayload) ? collectionsPayload : [];
 state.error = false
 })
 .addCase(getCollections.rejected,(state,action) => {
 state.isLoading = false;
 state.error = action.payload
 })
 .addCase(getProducts.pending , (state,action) => {
 state.isLoading = true
 }) 
 .addCase(getProducts.fulfilled , (state,action) => {
 // console.log(action.payload , 1);
 state.isLoading = false;
 
 state.products = action.payload
 // console.log(state.collections, 2);
 state.error = false
 })
 .addCase(getProducts.rejected,(state,action) => {
 state.isLoading = false;
 state.error = action.payload
 })
 .addCase(getProductsByCollection.pending , (state,action) => {
 state.isLoading = true
 }) 
 .addCase(getProductsByCollection.fulfilled, (state, action) => {
 state.isLoading = false;
 state.error = false;
 // 1. Normalize incoming payload to array
 const incomingProducts = Array.isArray(action.payload) ? action.payload : [action.payload];

 // 2. Attempt to derive the collection key from the returned products (they include `type`)
 const collectionKey = (incomingProducts[0]?.type ||'')
 .toString()
 .toLowerCase()
 .replace(/\s+/g,'-');

 if (collectionKey) {
 // Store the products under the specific collection key
 state.collectionProductsMap = {
 ...(state.collectionProductsMap || {}),
 [collectionKey]: incomingProducts
 };

 // Rebuild the flattened array (preserve previously fetched collections)
 const merged = Object.values(state.collectionProductsMap).flat();

 // Deduplicate by `id` or `_id` and keep first seen
 const seen = new Set();
 state.collectionProducts = merged.filter((p) => {
 const pid = p?.id || p?._id;
 if (!pid) return false;
 if (seen.has(pid)) return false;
 seen.add(pid);
 return true;
 });
 } else {
 // Fallback: merge into flat array (compatibility)
 const currentProducts = Array.isArray(state.collectionProducts) ? state.collectionProducts : [];
 const combined = [...currentProducts, ...incomingProducts];
 state.collectionProducts = combined.filter(
 (product, index, self) => product && index === self.findIndex((p) => p && (p._id === product._id || p.id === product.id))
 );
 }
})
 .addCase(getProductsByCollection.rejected,(state,action) => {
 state.isLoading = false;
 state.error = action.payload
 })
 .addCase(getSingleProduct.pending , (state,action) => {
 state.isLoading = true
 }) 
 .addCase(getSingleProduct.fulfilled , (state,action) => {
 // console.log(action.payload , 1);
 state.isLoading = false;
 state.product = action.payload
 // console.log(state.collections, 2);
 state.error = false
 })
 .addCase(getSingleProduct.rejected,(state,action) => {
 state.isLoading = false;
 state.error = action.payload
 })
 .addCase(searchEveryThing.pending , (state,action) => {
 state.isLoading = true
 }) 
 .addCase(searchEveryThing.fulfilled , (state,action) => {
 // console.log(action.payload , 1);
 state.isLoading = false;
 state.searchResult = action.payload
 // console.log(state.collections, 2);
 state.error = false
 })
 .addCase(searchEveryThing.rejected,(state,action) => {
 state.isLoading = false;
 state.error = action.payload
 })
 .addCase(getFeaturedCollection.pending , (state,action) => {
 state.isLoading = true
 }) 
 .addCase(getFeaturedCollection.fulfilled , (state,action) => {
 // console.log(action.payload , 1);
 state.isLoading = false;
 state.featuredCollections = action.payload
 // console.log(state.collections, 2);
 state.error = false
 })
 .addCase(getFeaturedCollection.rejected,(state,action) => {
 state.isLoading = false;
 state.error = action.payload
 })
 .addCase(getFeaturedProducts.pending , (state,action) => {
 state.isLoading = true
 }) 
 .addCase(getFeaturedProducts.fulfilled, (state, action) => {
 state.isLoading = false;
 state.error = false;
 state.featuredProducts = Array.isArray(action.payload) ? action.payload : [action.payload];

 // // 1. Ensure action.payload is an array before processing
 // const newProducts = Array.isArray(action.payload) ? action.payload : [action.payload];

 // // 2. Combine old products and new products into one temporary array
 // const combinedProducts = [...state.featuredProducts, ...newProducts];

 // // 3. Filter out duplicates by their unique'_id' so products don't repeat
 // state.featuredProducts = combinedProducts.filter(
 // (product, index, self) => index === self.findIndex((p) => p._id === product._id)
 // );
})
 .addCase(getFeaturedProducts.rejected,(state,action) => {
 state.isLoading = false;
 state.error = action.payload
 })
 .addCase(validateCoupon.pending , (state,action) => {
 state.isLoading = true
 }) 
 .addCase(validateCoupon.fulfilled , (state,action) => {
 state.isLoading = false;
 state.appliedCoupon = action.payload; 
 state.couponError = false;

 Cookies.set('appliedCoupon', JSON.stringify(action.payload), { expires: 1 }); 
 })
 .addCase(validateCoupon.rejected,(state,action) => {
 state.isLoading = false;
 toast.error(action.payload ||'Failed to validate coupon');
 state.couponError = action.payload
 })

}

})

export const {cleanResult, removeAppliedCoupon} = metaDataSlice.actions;
export default metaDataSlice.reducer;


