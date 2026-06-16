import { createAsyncThunk } from'@reduxjs/toolkit';
import api from'../../config/api';
import { syncWithServer } from'../slices/cartSlice';

// 1. GET - Fetches the full cart
export const getCart = createAsyncThunk('cart/fetch',
 async (_, thunkAPI) => {
 try {
 const response = await api.get('/cart');
 thunkAPI.dispatch(syncWithServer(response.data));
 return response.data;
 } catch (error) {
 const message = error.response?.data?.error ||"Failed to fetch cart";
 return thunkAPI.rejectWithValue(message);
 }
 }
);

// 2. PUT - Syncs local changes (Add/Update/Remove) to server
export const syncCartToServer = createAsyncThunk('cart/sync',
 async (items, thunkAPI) => {
 try {
 const thinItems = items.map(item => ({
 productId: item.productId,
 variantId: item.variantId,
 size: item.size,
 quantity: item.quantity
 }));

 // 1. PUT the thin items to the server
 const putRes = await api.put('/cart', { items: thinItems });

 // 2. If the server gave us a guest token, save it
 if (putRes.data.cartToken) {
 localStorage.setItem('x-cart-token', putRes.data.cartToken);
 }

 // 3. GET the full hydrated items
 // NOTE: Your api instance must be configured to pull the token 
 // from localStorage for every request (see step 3 below)
 const getRes = await api.get('/cart');
 
 return getRes.data; 
 
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||"Sync failed");
 }
 }
);
// 3. DELETE - Clears the cart entirely
export const clearCartOnServer = createAsyncThunk('cart/clear',
 async (_, thunkAPI) => {
 try {
 const response = await api.delete('/cart');
 return response.data;
 } catch (error) {
 return thunkAPI.rejectWithValue("Could not clear cart");
 }
 }
);