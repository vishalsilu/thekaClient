import { createAsyncThunk } from'@reduxjs/toolkit';
import api from'../../config/api';

export const fetchSiteData = createAsyncThunk('siteData/fetch',
 async (_, thunkAPI) => {
 try {
 const { data } = await api.get('/site');
 return data.siteData ?? {};
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||'Failed to load site data');
 }
 }
);

export const updateSiteData = createAsyncThunk('siteData/update',
 async (siteDataPayload, thunkAPI) => {
 try {
 const { data } = await api.patch('/site', siteDataPayload);
 return data.siteData ?? {};
 } catch (error) {
 console.error("UPDATE ERROR:", error.response?.data);
 return thunkAPI.rejectWithValue(error.response?.data?.error ||'Failed to save site data');
 }
 }
);