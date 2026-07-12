// CheckoutPage.jsx
import React from'react';
import { useCheckoutController } from'../Controllers/Checkout/useCheckoutController';
import CheckoutView from'../Views/Checkout/CheckoutView';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';

const CheckoutPage = () => {

     const { isAuthenticated ,token} = useSelector((state) => state.auth);
    const navigate = useNavigate()

    useEffect(()=>{
        if( !isAuthenticated){
        navigate('/login')
    }
    },[token,isAuthenticated])
 const controller = useCheckoutController();
 return <CheckoutView controller={controller} />;
};

export default CheckoutPage;