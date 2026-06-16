import { createAsyncThunk } from'@reduxjs/toolkit';
import api from'../../config/api';

export const createOrder = createAsyncThunk('orders/create',
 async ({ items, shippingAddressId, shippingAddress, paymentMethod, coupon }, thunkAPI) => {
 try {
 const { data } = await api.post('/orders',
 { items, shippingAddressId, shippingAddress, paymentMethod, coupon }
 );
 // console.log(data);
 return data.order;
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||'Order failed');
 }
 }
);

export const fetchMyOrders = createAsyncThunk('orders/my',
 async (_, thunkAPI) => {
 try {
 const { data } = await api.get('/orders/my');
 return data.orders;
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||'Failed to load orders');
 }
 }
);

export const submitOrderReviews = createAsyncThunk('orders/submitReviews',
 async ({ orderId, formData }, { rejectWithValue }) => {
 
 try {
 // API call made through the Redux action pipeline
 const response = await api.patch(`/orders/${orderId}/reviews`, formData, {
 headers: {'Content-Type':'multipart/form-data',
 },
 });
 
 return response.data;
 } catch (error) {
 const message = error.response?.data?.error ||'Failed to submit reviews.';
 return rejectWithValue(message);
 }
 }
);



export const fetchOrderById = createAsyncThunk('orders/detail',
 async (orderId, thunkAPI) => {
 try {
 const { data } = await api.get(`/orders/${orderId}?fresh=true`);
 return data.order;
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||'Failed to load order');
 }
 }
);

