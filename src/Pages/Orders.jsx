import React, { useEffect, useState } from'react';
import { useDispatch, useSelector } from'react-redux';
import { useTextFavicon } from'../Utils/useTextFavicon';
import OrderList from'../Components/Profile/OrderList';
import { fetchMyOrders } from'../Redux/thunks/orderThunks';

const Orders = () => {
const dispatch = useDispatch();

 const user = useSelector((state) => state.auth.user);
 const data = useSelector((state) => state.siteData.data);
 const orders = useSelector((state) => state.orders.orders || []);

 useEffect(() => {
 dispatch(fetchMyOrders())
 }, [])
 
 useTextFavicon('CU',
 `${user?.firstName ||'My'} Orders - ${data?.websiteName ||'Store'}`,
 { bgColor:'#10b981', textColor:'#ffffff' }
 );

 return (
 <main className="min-h-screen bg-surface text-on-surface px-4 py-12">
 <div className="max-w-7xl mx-auto">
 <header className="mb-10 border-b border-slate-200 pb-8">
 <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">Orders</p>
 <h1 className="text-4xl font-bold">Order History</h1>
 <p className="mt-3 text-sm text-gray-500">Tap an order to view full details.</p>
 </header>

 <OrderList orders={orders} />
 </div>
 </main>
 );
};

export default Orders;
