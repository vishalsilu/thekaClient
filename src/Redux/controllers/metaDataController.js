import { createAsyncThunk } from"@reduxjs/toolkit";
import api from"../../config/api";
import { create } from"axios";



export const getCollections = createAsyncThunk('collection/getCollection', async(_,thunkAPI) =>{
 try {
 const response = await api.get('/collections')
 
 return response.data.collections || response.data;
 
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error||"Failed to add collections");
 } 
 
})


export const getFeaturedCollection = createAsyncThunk('collection/featured' ,async (_,thunkAPI) => {
 try {
 const response = await api.get('/collections/featured')
 
 return response.data.data
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error||"Failed to find featured Collections");
 }
})

export const getFeaturedProducts = createAsyncThunk('products/featured' ,async (_,thunkAPI) => {
 try {
 const response = await api.get('/product/featured')
 
 return response.data
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error||"Failed to find featured Products");
 }
})

export const getProducts = createAsyncThunk('products/byCategory' , async(userData,thunkAPI) => {
 
 const {type,category} = userData
 try {
 const response = await api.get(`/product/${type}/${category}`)
 return response.data;
 
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error||"Failed to find Products");
 } 
})
export const getProductsByCollection = createAsyncThunk('products/byType' , async(userData,thunkAPI) => { 

 try {
 
 const response = await api.get(`/product/type/${userData}`)
 
 return response.data;
 
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error||"Failed to find Products");
 } 
})

export const getSingleProduct = createAsyncThunk('products/byId', async(userData,thunkAPI) =>{

 try {
 if(userData) { const response = await api.get(`/product/${userData}`)
 
 return response.data.data;
}
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error||"Failed to find Product");
 } 
})

export const searchEveryThing = createAsyncThunk('everything/byRegex', async (searchData,thunkAPI) => {
 try {
 const query = typeof searchData ==='string' ? searchData : searchData?.query ||'';
 const collection = typeof searchData ==='object' ? searchData?.collection : undefined;
 const params = { q: query };

 if (collection && collection !=='All Collections') {
 params.collection = collection;
 }

 const response = await api.get('/global-search', { params });
 return response.data;
 
 
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error||"Failed to find Product");
 
 }
})

export const validateCoupon = createAsyncThunk('coupon/validate', async (couponData,thunkAPI) => {
 try {
 const response = await api.get('/coupons/validate', {
 params: {
 code: couponData.code,
 subtotal: couponData.subtotal
 }
 });
 return response.data;
 
 
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error||"Failed to validate coupon");
 }
});
