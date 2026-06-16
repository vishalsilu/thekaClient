import { createSlice } from'@reduxjs/toolkit';
import { 
 sendOTP, 
 verifyOTP,
 resetPassword,
 completeRegistration, // 👈 Import new controller thunk hook
 getMe, 
 updateUser, 
 addAddress, 
 updateAddress, 
 deleteAddress,
} from'../controllers/crudUser';

const authSlice = createSlice({
 name:'auth',
 initialState: {
 user: null,
 token: null,
 isAuthenticated: false,
 // Start in loading state while we call /users/me to validate any existing cookie session
 isLoading: true,
 otpSent: false, 
 registrationRequired: false, // Tracks if frontend must switch to field details capture form
 registrationToken: null, // Temporarily houses short-lived verified signature
 resetPasswordRequired: false,
 resetEmail: null,
 error: null,
 },
 reducers: {
 logout: (state) => {
 state.user = null;
 state.token = null;
 state.isAuthenticated = false;
 state.otpSent = false;
 state.registrationRequired = false;
 state.registrationToken = null;
 state.error = null;

 },
 clearError: (state) => {
 state.error = null;
 }
 },
 extraReducers: (builder) => {
 builder
 // SEND OTP ACTION BUILDERS (STEP 1)
 .addCase(sendOTP.pending, (state) => { 
 state.isLoading = true; 
 state.error = null;
 })
 .addCase(sendOTP.fulfilled, (state) => { 
 state.isLoading = false; 
 state.otpSent = true; 
 state.error = null;
 })
 .addCase(sendOTP.rejected, (state, action) => { 
 state.isLoading = false; 
 state.error = action.payload; 
 })

 // VERIFY OTP ACTION BUILDERS (STEP 2)
 .addCase(verifyOTP.pending, (state) => { 
 state.isLoading = true; 
 state.error = null;
 })
 .addCase(verifyOTP.fulfilled, (state, action) => {
 state.isLoading = false;
 if (action.payload.registrationRequired) {
 // Stop login lifecycle and divert layout path execution flags
 state.registrationRequired = true;
 state.registrationToken = action.payload.registrationToken;
 state.otpSent = false;
 } else if (action.payload.resetFlow) {
 state.isAuthenticated = false;
 state.otpSent = false;
 state.registrationRequired = false;
 state.resetPasswordRequired = true;
 state.resetEmail = action.payload.email;
		} else {
			// Normal Profile login logic chain configuration mapping
			state.isAuthenticated = true;
			state.otpSent = false;
			state.user = action.payload.user;
		}
 state.error = null;
 })
 .addCase(verifyOTP.rejected, (state, action) => {
 state.isLoading = false;
 state.error = action.payload;
 })

 // COMPLETE REGISTRATION BUILDERS (STEP 3)
 .addCase(completeRegistration.pending, (state) => {
 state.isLoading = true;
 state.error = null;
 })
 .addCase(completeRegistration.fulfilled, (state, action) => {
 state.isLoading = false;
 state.isAuthenticated = true;
 state.registrationRequired = false;
 state.registrationToken = null;
 state.resetPasswordRequired = false;
 state.resetEmail = null;
 state.user = action.payload.user;
 state.error = null;
 })
 .addCase(resetPassword.pending, (state) => {
 state.isLoading = true;
 state.error = null;
 })
 .addCase(resetPassword.fulfilled, (state, action) => {
 state.isLoading = false;
 state.isAuthenticated = true;
 state.resetPasswordRequired = false;
 state.resetEmail = null;
 state.user = action.payload.user;
 state.error = null;
 })
 .addCase(resetPassword.rejected, (state, action) => {
 state.isLoading = false;
 state.error = action.payload;
 })
 .addCase(completeRegistration.rejected, (state, action) => {
 state.isLoading = false;
 state.error = action.payload;
 })

 // USER ACCOUNT SYNCHRONIZATION (GETME)
 .addCase(getMe.pending, (state) => {
 state.isLoading = true;
 })
 .addCase(getMe.fulfilled, (state, action) => {
 state.isLoading = false;
 state.user = action.payload;
 state.isAuthenticated = true;
 })
 .addCase(getMe.rejected, (state) => {
 state.isLoading = false;
 state.isAuthenticated = false;
 state.user = null;
 state.token = null;
 })

 // UPDATE PROFILE PROFILE DETAILS
 .addCase(updateUser.pending, (state) => {
 state.isLoading = true;
 })
 .addCase(updateUser.fulfilled, (state, action) => {
 state.isLoading = false;
 state.error = null;
 state.user = action.payload; 
 })
 .addCase(updateUser.rejected, (state, action) => {
 state.isLoading = false;
 state.error = action.payload; 
 })

 // ADDRESS LOGISTIC TRACKING BUILDERS
 .addCase(addAddress.pending, (state) => {
 state.isLoading = true;
 })
 .addCase(addAddress.fulfilled, (state, action) => {
 state.isLoading = false;
 state.error = null;
 if (!state.user) {
 state.user = { addresses: [] };
 }
 state.user.addresses = state.user.addresses || [];
 state.user.addresses.push(action.payload);
 })
 .addCase(addAddress.rejected, (state, action) => {
 state.isLoading = false;
 state.error = action.payload;
 })
 .addCase(updateAddress.fulfilled, (state, action) => {
 state.isLoading = false;
 state.error = null;
 const updatedAddr = action.payload?.updatedAddress || action.payload;
 if (updatedAddr && updatedAddr._id && state.user?.addresses) {
 state.user.addresses = state.user.addresses.map((addr) => {
 if (!addr) return addr;
 if (addr._id === updatedAddr._id) return updatedAddr;
 if (updatedAddr.isDefault === true) return { ...addr, isDefault: false };
 return addr;
 });
 
 }
 })
 .addCase(updateAddress.rejected, (state, action) => {
 state.isLoading = false;
 state.error = action.payload;
 })
 .addCase(deleteAddress.pending, (state) => {
 state.isLoading = true;
 })
 .addCase(deleteAddress.fulfilled, (state, action) => {
 state.isLoading = false;
 state.error = null;
 if (state.user?.addresses) {
 state.user.addresses = state.user.addresses.filter(
 (address) => address && address._id !== action.payload
 );
 }
 })
 .addCase(deleteAddress.rejected, (state, action) => {
 state.isLoading = false;
 state.error = action.payload;
 });
 }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
// import { createSlice } from'@reduxjs/toolkit';
// import { 
// sendOTP, 
// verifyOTP, 
// getMe, 
// updateUser, 
// addAddress, 
// updateAddress, 
// deleteAddress,
// setSession 
// } from'../controllers/crudUser'; // Pointing directly to your thunks layer file

// const authSlice = createSlice({
// name:'auth',
// initialState: {
// user: JSON.parse(localStorage.getItem('user')) || null,
// token: localStorage.getItem('token') || null,
// isAuthenticated: !!localStorage.getItem('token'), 
// isLoading: false,
// otpSent: false, // Tracks if Step 1 is successful so UI can show the OTP inputs
// error: null,
// },
// reducers: {
// logout: (state) => {
// state.user = null;
// state.token = null;
// state.isAuthenticated = false;
// state.otpSent = false;
// state.error = null;

// localStorage.removeItem('user');
// localStorage.removeItem('token');
// setSession({ user: null, token: null }); 
// },
// clearError: (state) => {
// state.error = null;
// }
// },
// extraReducers: (builder) => {
// builder
// // ==========================================
// // SEND OTP ACTION BUILDERS (STEP 1)
// // ==========================================
// .addCase(sendOTP.pending, (state) => { 
// state.isLoading = true; 
// state.error = null;
// })
// .addCase(sendOTP.fulfilled, (state) => { 
// state.isLoading = false; 
// state.otpSent = true; // Tell UI to prompt user for verification code digits
// state.error = null;
// })
// .addCase(sendOTP.rejected, (state, action) => { 
// state.isLoading = false; 
// state.error = action.payload; 
// })

// // ==========================================
// // VERIFY OTP ACTION BUILDERS (STEP 2)
// // ==========================================
// .addCase(verifyOTP.pending, (state) => { 
// state.isLoading = true; 
// state.error = null;
// })
// .addCase(verifyOTP.fulfilled, (state, action) => {
// state.isLoading = false;
// state.isAuthenticated = true;
// state.otpSent = false; // Reset toggle since user successfully signed in
// state.user = action.payload.user;
// state.token = action.payload.token;
// state.error = null;
// })
// .addCase(verifyOTP.rejected, (state, action) => {
// state.isLoading = false;
// state.error = action.payload;
// })

// // ==========================================
// // USER ACCOUNT SYNCHRONIZATION (GETME)
// // ==========================================
// .addCase(getMe.pending, (state) => {
// state.isLoading = true;
// })
// .addCase(getMe.fulfilled, (state, action) => {
// state.isLoading = false;
// state.user = action.payload;
// state.isAuthenticated = true;
// })
// .addCase(getMe.rejected, (state) => {
// state.isLoading = false;
// state.isAuthenticated = false;
// state.user = null;
// state.token = null;
// })

// // ==========================================
// // PROFILE DETAILS LAYER
// // ==========================================
// .addCase(updateUser.pending, (state) => {
// state.isLoading = true;
// })
// .addCase(updateUser.fulfilled, (state, action) => {
// state.isLoading = false;
// state.error = null;
// state.user = action.payload; 
// })
// .addCase(updateUser.rejected, (state, action) => {
// state.isLoading = false;
// state.error = action.payload; 
// })

// // ==========================================
// // ADDRESS LOGISTIC ARRAYS
// // ==========================================
// .addCase(addAddress.pending, (state) => {
// state.isLoading = true;
// })
// .addCase(addAddress.fulfilled, (state, action) => {
// state.isLoading = false;
// state.error = null;
// if (!state.user) {
// state.user = { addresses: [] };
// }
// state.user.addresses = state.user.addresses || [];
// state.user.addresses.push(action.payload);
// localStorage.setItem('user', JSON.stringify(state.user));
// })
// .addCase(addAddress.rejected, (state, action) => {
// state.isLoading = false;
// state.error = action.payload;
// })
// .addCase(updateAddress.fulfilled, (state, action) => {
// state.isLoading = false;
// state.error = null;

// const updatedAddr = action.payload?.updatedAddress || action.payload;

// if (updatedAddr && updatedAddr._id && state.user?.addresses) {
// state.user.addresses = state.user.addresses.map((addr) => {
// if (!addr) return addr;
 
// // Match Found: Swap in the newly edited object
// if (addr._id === updatedAddr._id) {
// return updatedAddr;
// }

// // If this modified address is now set to default, demote other records
// if (updatedAddr.isDefault === true) {
// return { ...addr, isDefault: false };
// }
// return addr;
// });

// localStorage.setItem('user', JSON.stringify(state.user));
// }
// })
// .addCase(updateAddress.rejected, (state, action) => {
// state.isLoading = false;
// state.error = action.payload;
// })
// .addCase(deleteAddress.pending, (state) => {
// state.isLoading = true;
// })
// .addCase(deleteAddress.fulfilled, (state, action) => {
// state.isLoading = false;
// state.error = null;
 
// if (state.user?.addresses) {
// state.user.addresses = state.user.addresses.filter(
// (address) => address && address._id !== action.payload
// );
// localStorage.setItem('user', JSON.stringify(state.user));
// }
// })
// .addCase(deleteAddress.rejected, (state, action) => {
// state.isLoading = false;
// state.error = action.payload;
// });
// }
// });

// export const { logout, clearError } = authSlice.actions;
// export default authSlice.reducer;