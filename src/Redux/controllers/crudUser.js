import api from'../../config/api';
import { createAsyncThunk } from'@reduxjs/toolkit';
import { logout } from'../slices/authSlice';
import { getCart } from'./cartController';

const cacheSessionToken = (token) => {
  if (!token) return;
  try {
    localStorage.setItem('x-session-token', token);
  } catch (e) {
  }
};

const clearSessionToken = () => {
  try {
    localStorage.removeItem('x-session-token');
  } catch (e) {
  }
};

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
 try {
 const response = await api.get('/users/me');
 return response.data.user;
 } catch (error) {
	return thunkAPI.rejectWithValue("Session expired");
 }
});


export const sendOTP = createAsyncThunk('auth/sendOTP', async (payload, thunkAPI) => {
 try {
 const response = await api.post('/users/email/send-otp', payload);
 return response.data; 
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||"Failed to send verification code");
 }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (otpData, thunkAPI) => {
 try {
 const response = await api.post('/users/email/verify-otp', otpData);

 if (response.data.registrationRequired) {
	 return response.data;
 }

 const { user, sessionToken } = response.data;
 cacheSessionToken(sessionToken);
 thunkAPI.dispatch(getCart());
 return { user };
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||"Verification failed");
 }
});

export const completeRegistration = createAsyncThunk('auth/completeRegistration', async (profileData, thunkAPI) => {
 try {
 const response = await api.post('/users/email/complete-registration', profileData);
 const { user, sessionToken } = response.data;
 cacheSessionToken(sessionToken);
 thunkAPI.dispatch(getCart());
 return { user };
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||"Profile initialization registration failed");
 }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, thunkAPI) => {
 try {
 const response = await api.post('/users/email/reset-password', payload);
 const { user, sessionToken } = response.data;
 cacheSessionToken(sessionToken);
 thunkAPI.dispatch(getCart());
 return { user };
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||"Password reset failed");
 }
});

export const updateUser = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
 try {
 const response = await api.patch('/users/update-profile', userData);
 const updatedUser = response.data.user;
 return updatedUser;
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||"Profile update failed");
 }
});

export const addAddress = createAsyncThunk('address/add', async (userData, thunkAPI) => {
 try {
 const response = await api.post('/users/add-address', userData);
 return response.data.newAddress;
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||"Failed to add address");
 } 
});

export const updateAddress = createAsyncThunk('address/update', async (userData, thunkAPI) => {
 try {
 const response = await api.patch('/users/update-address', userData);
 return response.data.updatedAddress;
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||"Failed to update address");
 } 
});

export const deleteAddress = createAsyncThunk('address/delete', async (userData, thunkAPI) => {
 try {
 const { userId, id } = userData;
 const response = await api.delete(`/users/delete-address/${userId}/${id}`);
 return response.data.deletedAddress;
 } catch (error) {
 return thunkAPI.rejectWithValue(error.response?.data?.error ||"Failed to delete address");
 } 
});

export const handleLogoutProcess = createAsyncThunk('auth/logoutAndPreserve',
 async (_, { dispatch }) => {
 try {

 let cartToken = null;
 try {
	 const logoutRes = await api.post('/users/logout');
 } catch (err) {
	 console.error('[LOGOUT] Server logout error:', err?.response?.data || err?.message);
 }

 try {
	 const response = await api.post('/cart/logout-preserve');
	 cartToken = response.data?.cartToken;
 } catch (err) {
 }

 dispatch(logout());

 if (api.defaults.headers.common['Authorization']) {
 delete api.defaults.headers.common['Authorization'];
 }

 clearSessionToken();

 if (cartToken) {
 localStorage.setItem('x-cart-token', cartToken);
 } else {
 localStorage.removeItem('x-cart-token');
 }

 dispatch(getCart());
 } catch (error) {
 dispatch(logout());
 localStorage.removeItem('x-cart-token');
 clearSessionToken();
 }
 }
);

