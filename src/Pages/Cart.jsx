// CartPage.jsx
import React from'react';
import { useCartController } from'../Controllers/Cart/useCartController';
import CartView from'../Views/Cart/CartView';

const CartPage = () => {
 const controller = useCartController();
 return <CartView controller={controller} />;
};

export default CartPage;