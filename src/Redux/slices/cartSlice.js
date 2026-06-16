import { createSlice } from'@reduxjs/toolkit';
import { getCart, syncCartToServer, clearCartOnServer } from'../controllers/cartController';

const initialState = {
 items: [], // The"Full" hydrated items (images, prices, etc.)
 cartToken: null, // Guest token
 bucket:'guest', //'guest' or'user'
 status:'idle', //'idle' |'loading' |'succeeded' |'failed'
 error: null, 
 isAdding: false // Stores error messages from the backend
};

const cartSlice = createSlice({
 name:'cart',
 initialState,
 reducers: {
 // LOCAL UPDATES: These happen instantly in the UI before the sync
 addToCart: (state, action) => {
 const newItem = action.payload;
 const existingItem = state.items.find(
 item => String(item.productId) === String(newItem.productId) &&
 String(item.variantId) === String(newItem.variantId) &&
 String(item.size) === String(newItem.size)
 );

 if (existingItem) {
 existingItem.quantity = Math.min(10, existingItem.quantity + Number(newItem.quantity || 1));
 } else {
 state.items.push({
 ...newItem,
 productId: String(newItem.productId),
 variantId: Number(newItem.variantId),
 size: String(newItem.size),
 quantity: Math.min(10, Number(newItem.quantity))
 });
 }
 },
 replaceCartItem: (state, action) => {
 const { oldKey, newItem } = action.payload;
 const normalizedOldKey = String(oldKey ||'');
 const newItemNormalized = {
 ...newItem,
 productId: String(newItem.productId),
 variantId: Number(newItem.variantId),
 size: String(newItem.size),
 quantity: Number(newItem.quantity)
 };

 let replaced = false;
 state.items = state.items.map(item => {
 const itemKey = String(item.productId) + String(item.variantId) + String(item.size);
 if (itemKey === normalizedOldKey) {
 replaced = true;
 return newItemNormalized;
 }
 return item;
 });


 if (!replaced) {
 state.items.push(newItemNormalized);
 }
 },
 removeFromCart: (state, action) => {
 const { productId, variantId, size } = action.payload;
 const payloadKey = String(productId) + String(variantId) + String(size);

 state.items = state.items.filter(item => {
 const itemKey = String(item.productId || item.id) + String(item.variantId) + String(item.size);
 return itemKey !== payloadKey;
 });
 },
 updateQuantity: (state, action) => {
 const { productId, variantId, size, quantity } = action.payload;
 const payloadKey = String(productId) + String(variantId) + String(size);
 const item = state.items.find(i =>
 String(i.productId || i.id) + String(i.variantId) + String(i.size) === payloadKey
 );
 if (item) {
 item.quantity = Math.max(1, Math.min(10, Number(quantity)));
 }
 },
 // SERVER SYNC: Overwrites local state with the backend's"Truth"
 syncWithServer: (state, action) => {
 state.items = action.payload.items || [];
 state.cartToken = action.payload.cartToken || state.cartToken;
 state.bucket = action.payload.bucket || state.bucket;
 },
 clearLocalCart: (state) => {
 state.items = [];
 state.cartToken = null;
 }
 },
 extraReducers: (builder) => {
 builder
 /**
 * 1. GET CART (router.get'/')
 */
 .addCase(getCart.pending, (state) => {
 state.status ='loading';
 state.error = null;
 })
 .addCase(getCart.fulfilled, (state, action) => {
 state.status ='succeeded';
 // Note: syncWithServer is already dispatched in the thunk
 })
 .addCase(getCart.rejected, (state, action) => {
 state.status ='failed';
 state.error = action.payload;
 })

 /**
 * 2. SYNC CART (router.put'/')
 * Triggered by middleware for Add, Remove, and Update
 */
 .addCase(syncCartToServer.pending, (state) => {
 // We keep status'idle' or'syncing' so the UI doesn't flicker/lock
 state.error = null;
 })
 .addCase(syncCartToServer.fulfilled, (state, action) => {
 state.status ='succeeded';
 state.error = null;
 })
 .addCase(syncCartToServer.rejected, (state, action) => {
 state.status ='failed';
 state.error = action.payload;
 })

 /**
 * 3. CLEAR CART (router.delete'/')
 */
 .addCase(clearCartOnServer.pending, (state) => {
 state.status ='loading';
 })
 .addCase(clearCartOnServer.fulfilled, (state) => {
 state.items = [];
 state.status ='succeeded';
 state.error = null;
 })
 .addCase(clearCartOnServer.rejected, (state, action) => {
 state.status ='failed';
 state.error = action.payload;
 });
 },
});

export const { 
 addToCart, 
 removeFromCart, 
 replaceCartItem,
 updateQuantity, 
 syncWithServer, 
 clearLocalCart 
} = cartSlice.actions;

export default cartSlice.reducer;

export const selectTotalQuantity = (state) => 
 state.cart.items.reduce((total, item) => total + (Number(item.quantity) || 0), 0);