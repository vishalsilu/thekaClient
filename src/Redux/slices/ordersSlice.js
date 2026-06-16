import { createSlice } from'@reduxjs/toolkit';
import { createOrder, fetchMyOrders, fetchOrderById, submitOrderReviews } from'../thunks/orderThunks';

const ordersSlice = createSlice({
 name:'orders',
 initialState: {
 orders: [],
 currentOrder: null,
 placing: false,
 loading: false,
 detailLoading: false,
 error: null,
 detailError: null,
 submittingReview : false
 },
 reducers: {},
 extraReducers: (builder) => {
 builder
 .addCase(fetchMyOrders.pending, (state) => {
 state.loading = true;
 state.error = null;
 })
 .addCase(fetchMyOrders.fulfilled, (state, action) => {
 state.loading = false;
 state.orders = Array.isArray(action.payload) ? action.payload : [];
 })
 .addCase(fetchMyOrders.rejected, (state, action) => {
 state.loading = false;
 state.error = action.payload ||'Failed to load orders';
 })
 .addCase(fetchOrderById.pending, (state) => {
 state.detailLoading = true;
 state.detailError = null;
 })
 .addCase(fetchOrderById.fulfilled, (state, action) => {
 state.detailLoading = false;
 state.currentOrder = action.payload;
 })
 .addCase(fetchOrderById.rejected, (state, action) => {
 state.detailLoading = false;
 state.detailError = action.payload ||'Failed to load order';
 })
 .addCase(createOrder.pending, (state) => {
 state.placing = true;
 state.error = null;
 })
 .addCase(createOrder.fulfilled, (state, action) => {
 state.placing = false;
 if (action.payload) state.orders = [action.payload, ...state.orders];
 })
 .addCase(createOrder.rejected, (state, action) => {
 state.placing = false;
 state.error = action.payload ||'Order failed';
 })
 .addCase(submitOrderReviews.pending, (state) => {
 state.submittingReview = true;
 })
 .addCase(submitOrderReviews.fulfilled, (state) => {
 state.submittingReview = false;
 })
 .addCase(submitOrderReviews.rejected, (state, action) => {
 state.submittingReview = false;
 state.error = action.payload;
 });
 }
});

export default ordersSlice.reducer;

