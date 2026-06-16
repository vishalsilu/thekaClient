import { configureStore } from"@reduxjs/toolkit";
import authReducer from'./slices/authSlice';
import metaDataSlice from'./slices/metaDataSlice';
import cartSlice from"./slices/cartSlice";
import ordersReducer from'./slices/ordersSlice';
import siteDataReducer from'./slices/siteDataSlice';
import cartSyncMiddleware from"./middleware/cartSyncMiddleware";

const store = configureStore({
 reducer: {
 auth: authReducer,
 metaData: metaDataSlice,
 cart: cartSlice,
 orders: ordersReducer,
 siteData: siteDataReducer,
 },
 middleware: (getDefaultMiddleware) =>
 getDefaultMiddleware().concat(cartSyncMiddleware.middleware)
});

export default store;
