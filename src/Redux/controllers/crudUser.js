import api from '../../config/api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { logout } from '../slices/authSlice';
import { getCart } from './cartController';

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

// Frontend Thunk
export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const response = await api.get('/users/me');
    
    // Check for explicit backend business logic failure
    if (response.data.success === false) {
      return thunkAPI.rejectWithValue(response.data.error || response.data.alert || "Not authenticated");
    }
    
    return response.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue("Server error");
  }
});

export const sendOTP = createAsyncThunk('auth/sendOTP', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/users/email/send-otp', payload);
    
    if (response.data.success === false) {
      return thunkAPI.rejectWithValue(response.data.error || "Failed to send verification code");
    }
    
    return response.data; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || "Failed to send verification code");
  }
});

export const verifyOTP = createAsyncThunk('auth/verifyOTP', async (otpData, thunkAPI) => {
  try {
    const response = await api.post('/users/email/verify-otp', otpData);

    if (response.data.success === false) {
      return thunkAPI.rejectWithValue(response.data.error || "Verification failed");
    }

    if (response.data.registrationRequired) {
      return response.data;
    }

    const { user, sessionToken } = response.data;
    cacheSessionToken(sessionToken);
    thunkAPI.dispatch(getCart());
    return { user };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || "Verification failed");
  }
});

export const completeRegistration = createAsyncThunk('auth/completeRegistration', async (profileData, thunkAPI) => {
  try {
    const response = await api.post('/users/complete-registration', profileData);
    
    if (response.data.success === false) {
      return thunkAPI.rejectWithValue(response.data.error || "Profile initialization failed");
    }

    const { user, sessionToken } = response.data;
    cacheSessionToken(sessionToken);
    thunkAPI.dispatch(getCart());
    return { user };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || "Profile initialization failed");
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/users/reset-password', payload);
    
    if (response.data.success === false) {
      return thunkAPI.rejectWithValue(response.data.error || "Password reset failed");
    }

    const { user, sessionToken } = response.data;
    cacheSessionToken(sessionToken);
    thunkAPI.dispatch(getCart());
    return { user };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || "Password reset failed");
  }
});

export const updateUser = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
  try {
    const response = await api.patch('/users/update-profile', userData);
    
    if (response.data.success === false) {
      return thunkAPI.rejectWithValue(response.data.error || "Profile update failed");
    }

    const updatedUser = response.data.user;
    return updatedUser;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || "Profile update failed");
  }
});

export const addAddress = createAsyncThunk('address/add', async (userData, thunkAPI) => {
  try {
    const response = await api.post('/users/add-address', userData);
    
    if (response.data.success === false) {
      return thunkAPI.rejectWithValue(response.data.error || "Failed to add address");
    }
    
    return response.data.newAddress;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || "Failed to add address");
  } 
});

export const updateAddress = createAsyncThunk('address/update', async (userData, thunkAPI) => {
  try {
    const response = await api.patch('/users/update-address', userData);
    
    if (response.data.success === false) {
      return thunkAPI.rejectWithValue(response.data.error || "Failed to update address");
    }

    return response.data.updatedAddress;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || "Failed to update address");
  } 
});

export const deleteAddress = createAsyncThunk('address/delete', async (userData, thunkAPI) => {
  try {
    const { userId, id } = userData;
    const response = await api.delete(`/users/delete-address/${userId}/${id}`);
    
    if (response.data.success === false) {
      return thunkAPI.rejectWithValue(response.data.error || "Failed to delete address");
    }

    return response.data.deletedAddress;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.error || "Failed to delete address");
  } 
});

export const handleLogoutProcess = createAsyncThunk('auth/logoutAndPreserve',
  async (_, { dispatch }) => {
    try {
      let cartToken = null;
      try {
        const response = await api.post('/cart/logout-preserve');
        // Check for success flag even on logout preservation
        if (response.data.success !== false) {
          cartToken = response.data?.cartToken;
        }
      } catch (err) {
      }
      
      try {
        await api.post('/users/logout');
        // Removed console.error here. A failed logout shouldn't spam the console.
        // It simply fails silently and cleans up the frontend state.
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
      // Fallback cleanup
      dispatch(logout());
      localStorage.removeItem('x-cart-token');
      clearSessionToken();
    }
  }
);