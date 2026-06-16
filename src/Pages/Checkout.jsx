// CheckoutPage.jsx
import React from'react';
import { useCheckoutController } from'../Controllers/Checkout/useCheckoutController';
import CheckoutView from'../Views/Checkout/CheckoutView';

const CheckoutPage = () => {
 const controller = useCheckoutController();
 return <CheckoutView controller={controller} />;
};

export default CheckoutPage;