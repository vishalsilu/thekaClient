import { createListenerMiddleware, isAnyOf } from'@reduxjs/toolkit';
import { 
 addToCart, 
 removeFromCart, 
 replaceCartItem,
 updateQuantity, 
 clearLocalCart 
} from'../slices/cartSlice';
import { 
 syncCartToServer, 
 clearCartOnServer 
} from'../controllers/cartController';

/**
 * The"Auto-Save" Middleware
 * It waits for the user to stop clicking (380ms) before hitting the API.
 */
const cartSyncMiddleware = createListenerMiddleware();

// 1. HANDLER FOR ADD / REMOVE / UPDATE (Calls the PUT route)
cartSyncMiddleware.startListening({
 matcher: isAnyOf(addToCart, removeFromCart, replaceCartItem, updateQuantity),
 effect: async (action, listenerApi) => {
 // Stop any pending syncs so we don't spam the server
 listenerApi.cancelActiveListeners();

 // Wait for the user to finish clicking (Debounce)
 await listenerApi.delay(380);

 // Grab the latest items from the state
 const items = listenerApi.getState().cart.items;

 // Trigger the PUT request to your backend
 // This hits: router.put('/', putCart)
 listenerApi.dispatch(syncCartToServer(items));
 },
});

// 2. HANDLER FOR CLEAR CART (Calls the DELETE route)
cartSyncMiddleware.startListening({
 actionCreator: clearLocalCart,
 effect: async (action, listenerApi) => {
 // No delay needed for clearing; we want that gone immediately
 // This hits: router.delete('/', clearCart)
 listenerApi.dispatch(clearCartOnServer());
 },
});

export default cartSyncMiddleware;