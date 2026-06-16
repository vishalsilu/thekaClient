import React, { useEffect } from'react';
import { ArrowLeft, Check, Copy } from'lucide-react';
import { useLocation, useNavigate, useParams } from'react-router-dom';
import { useDispatch, useSelector } from'react-redux';
import { fetchOrderById } from'../../Redux/thunks/orderThunks';
import { useClipboard } from'../../Utils/useClipboard';
import html2canvas from'html2canvas/dist/html2canvas.esm.js';
import { jsPDF } from'jspdf';
import { FaPrint, FaRedo } from 'react-icons/fa';

const OrderDetail = () => {
 const { hasCopied, copy } = useClipboard();
 const location = useLocation();
 const navigate = useNavigate();
 const { orderId } = useParams();
 const dispatch = useDispatch();

 const initialOrder = location.state?.order || null;
 const { currentOrder, detailLoading, detailError } = useSelector((state) => state.orders);
 const siteData = useSelector((state) => state.siteData?.data || {});
 const user = useSelector((state) => state.auth.user);
 const order = currentOrder?.orderId === orderId ? currentOrder : initialOrder;

 const getSupportPhone = () => {
 const phone = siteData?.contact?.phone || siteData?.supportPhone ||'';
 return phone.toString().replace(/\D/g,'');
 };


 const handleSupportClick = () => {
 const customerMobile = order?.shippingAddress?.mobile || order?.phone || 'N/A';
 const userIdValue = user?.id || user?._id || order?.userId || 'N/A';
 const orderNumber = order?.orderId || order?.id || 'N/A';
 const shippingAddress = order?.shippingAddress || {};
 const lineItems = Array.isArray(order?.items) ? order.items.map((item, index) => `  ${index + 1}. ${item.name || 'Item'} x ${item.quantity || 1}${item.variant ? ` (${item.variant})` : ''}`).join('\n') : '  No items available';
 const supportMessage = [
 'Hello team,',
 'I need assistance with my order.',
 `Order ID: ${orderNumber}`,
 `Order Status: ${order?.status || 'N/A'}`,
 `Order Total: ₹${order?.total?.toLocaleString('en-IN') || order?.subtotal?.toLocaleString('en-IN') || 'N/A'}`,
 'Items:',
 lineItems,
 `Shipping Name: ${shippingAddress.name || shippingAddress.firstName || 'N/A'}`,
 `Shipping Phone: ${customerMobile}`,
 `Shipping Address: ${shippingAddress.addressLine1 || shippingAddress.address || 'N/A'}${shippingAddress.city ? ', ' + shippingAddress.city : ''}${shippingAddress.state ? ', ' + shippingAddress.state : ''}${shippingAddress.zip ? ' - ' + shippingAddress.zip : ''}`,
 '',
 'Please help me resolve this issue as soon as possible.',
 ].join('\n');

 navigate('/contact-us', {
 state: {
 orderHelp: {
 subject: `Help with order ${orderNumber}`,
 message: supportMessage,
 userId: userIdValue,
 source: 'order_help_page'
 }
 }
 });
 };

 useEffect(() => {
 if (orderId) {
 dispatch(fetchOrderById(orderId));
 }
 }, [dispatch, orderId]);



 if (detailLoading && !order) return (
 <div className="flex items-center justify-center min-h-screen font-inter">
 <p className="">Loading order...</p>
 </div>
 );

 if (detailError && !order) return (
 <div className="flex items-center justify-center min-h-screen font-inter">
 <p className="text-red-500">{detailError}</p>
 </div>
 );

 if (!order) return (
 <div className="flex items-center justify-center min-h-screen font-inter">
 <p className="">Order not found</p>
 </div>
 );

 const normalizedStatus = String(order.status ||'').toLowerCase();
 const isCanceled = normalizedStatus ==='cancelled';
 const isDelivered = normalizedStatus ==='delivered';
 const isInTransit = ['packed','shipped','out for delivery'].includes(normalizedStatus);

 // Progress logic based on status and tracking
 // 1. Dynamic Progress logic mapping matching your system's exact statuses

 


 const getProgressSteps = () => {
 const statusOrder = ['placed','booked','packed','shipped','reached','in transit','out for delivery','delivered'];
 const currentIdx = statusOrder.indexOf(normalizedStatus);

 const baseSteps = [
 { key:'placed', label:'Order Placed' },
 { key:'booked', label:'Booked' },
 { key:'packed', label:'Packed' },
 { key:'shipped', label:'Shipped' },
 { key:'reached', label:'Reached' },
 { key:'in transit', label:'In Transit' },
 { key:'out for delivery', label:'Out for Delivery' },
 { key:'delivered', label:'Delivered' },
 ];

 return baseSteps.map((step) => {
 const stepIdx = statusOrder.indexOf(step.key);
 let stepStatus ='upcoming';
 
 if (stepIdx < currentIdx) {
 stepStatus ='completed';
 } else if (stepIdx === currentIdx) {
 stepStatus ='active';
 }

 // Extract matching tracking date safely if available, else fallback
 const trackingLog = order.tracking?.find(t => String(t.status).toLowerCase() === step.key);
 const dateDisplay = trackingLog?.date || (step.key ==='placed' ? order.createdAt?.split('T')[0] :'Pending');

 return {
 label: step.label,
 date: dateDisplay,
 status: stepStatus
 };
 });
 };

 const steps = getProgressSteps();


 {/* 2. Responsive Progress Stepper (Only if not canceled) */}
 {!isCanceled && (
 <section className="px-6 md:px-10 py-12 border-b border-neutral-100 bg-surface">
 <div className="max-w-7xl mx-auto">
 {/* Switched to a responsive layout: columns on mobile, row on desktop */}
 <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-y-8 md:gap-x-2">
 
 {/* Central connecting guide line for desktop */}
 <div className="hidden md:block absolute top-[24px] left-0 w-full h-[2px] bg-neutral-200 -z-0"></div>
 
 {/* Vertical tracking line for mobile */}
 <div className="block md:hidden absolute top-4 left-[19px] w-[2px] h-[calc(100%-32px)] bg-neutral-200"></div>

 {steps.map((step, idx) => (
 <div 
 key={idx} 
 className={`flex md:flex-col items-center md:text-center gap-4 md:gap-2 z-10 w-full md:w-auto ${
 step.status ==='upcoming' ?'opacity-40' :''
 }`}
 >
 {/* Icon Indicator Badge */}
 {step.status ==='completed' ? (
 <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shrink-0 shadow-sm">
 <Check size={16} strokeWidth={3} />
 </div>
 ) : step.status ==='active' ? (
 <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center shrink-0 ring-4 ring-neutral-100">
 <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse"></div>
 </div>
 ) : (
 <div className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center shrink-0">
 <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
 </div>
 )}

 {/* Text Content Block */}
 <div className="text-left md:text-center min-w-0">
 <p className={`text-[11px] uppercase tracking-wider block truncate ${
 step.status ==='active' ?'font-extrabold text-black' :'font-medium text-neutral-800'
 }`}>
 {step.label}
 </p>
 <p className="text-[10px] text-neutral-400 mt-0.5">{step.date}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>
 )}

 const buildInvoiceHTML = (orderData) => {
 // Normalize payloads: some responses may wrap the order (`{ order: {...} }`) or include `data`.
 const orderObj = (orderData && orderData.order) || (orderData && orderData.data && orderData.data.order) || orderData || {};

 const styles = `<style>
 body{font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial;margin:0;color:#111827}
 .inv-wrap{max-width:880px;margin:24px auto;padding:24px;border:1px solid #e5e7eb}
 .inv-head{display:flex;justify-content:space-between;align-items:flex-start}
 .inv-meta{font-size:14px;text-align:right}
 table{width:100%;border-collapse:collapse;margin-top:16px}
 th,td{padding:10px;border:1px solid #e5e7eb;text-align:left;vertical-align:middle}
 th{background:#f3f4f6;font-weight:600}
 .text-right{text-align:right}
 .small{font-size:12px;color:#6b7280}
 .muted{color:#6b7280}
 .thumb{width:56px;height:56px;object-fit:cover;border-radius:6px}
 </style>`;

 const items = Array.isArray(orderObj.items) ? orderObj.items : [];
 const itemsHtml = items.map(i => {
 const qty = Number(i.quantity) || 1;
 const unit = Number(i.price) || 0;
 const line = unit * qty;
 const img = i.thumbnail || (i.images && i.images[0]) ||'';
 return `<tr>
 <td style="width:64px"><img src="${img}" class="thumb" onerror="this.style.display='none'" /></td>
 <td>
 <div style="font-weight:700">${i.name || i.title ||'Product'}</div>
 <div class="muted" style="font-size:12px">${i.variant ?'Variant:' + i.variant :''}</div>
 </td>
 <td>${i.sku || i.productId ||'-'}</td>
 <td class="text-right">₹${unit.toLocaleString('en-IN')}</td>
 <td class="text-right">${qty}</td>
 <td class="text-right">₹${line.toLocaleString('en-IN')}</td>
 </tr>`;
 }).join('\n');

 const subtotal = Number(orderObj.subtotal) || items.reduce((s, it) => s + ((Number(it.price) || 0) * (Number(it.quantity) || 1)), 0);
 const code = orderObj.coupon?.code ||'';
 const discount = Number(orderObj.discount) || orderObj.coupon?.discountAmount  || 0;
 const shipping = code && code === "FREESHIP" ? "FREE" : Number(orderObj.shipping) || 0;
 const tax = Number(orderObj.tax) || 0;
 const total = Number(orderObj.total) || (subtotal - discount + shipping + tax);

 const billing = orderObj.billingAddress || orderObj.customer?.billing || orderObj.shippingAddress || {};
 const shippingAddr = orderObj.shippingAddress || orderObj.customer?.shipping || {};
 const customer = orderObj.customer || {};


 const companyName = siteData.websiteName ||'LUXE';
 const companyTag = siteData.tagline ||'Elevated Essentials & Curated Objects';
 const companyAddr = siteData.contact?.address ||'128 Madison Avenue, New York, NY 10116';
 const companyContact = `${siteData.contact?.phone ||'+1 (212) 555-0132'}${siteData.contact?.email ?' |' + siteData.contact.email :''}`;

 const logoImg = siteData.logoUrl ? `<img src="${siteData.logoUrl}" style="height:56px;object-fit:contain;margin-right:12px" onerror="this.style.display='none'"/>` :'';
 const created = new Date(orderObj.createdAt || orderObj.created_at || Date.now()).toLocaleDateString();

 const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice - ${orderObj.orderId || orderObj.id ||''}</title>${styles}</head><body>
 <div class="inv-wrap">
 <div class="inv-head">
 <div style="display:flex;align-items:flex-start;gap:12px">
 ${logoImg}
 <div>
 <h1 style="margin:0;font-size:22px">${companyName}</h1>
 <div class="muted">${companyTag}</div>
 <div style="margin-top:6px" class="small">${companyAddr}</div>
 <div class="small">${companyContact}</div>
 </div>
 </div>
 <div class="inv-meta">
 <div style="font-weight:700">Invoice</div>
 <div>INV-${orderObj.orderId || orderObj.id ||''}</div>
 <div class="small">${created}</div>
 <div class="small">Order: ${orderObj.orderId || orderObj.id ||''}</div>
 <div class="small">Payment Method: ${orderObj.paymentMethod || orderObj.payment_status ||'COD'}</div>
 <div class="small">Payment Status: ${orderObj.paymentStatus || orderObj.status || 'Pending'}</div>
 ${orderObj.paymentDetails?.razorpayPaymentId ? `<div class="small">Transaction ID: ${orderObj.paymentDetails.razorpayPaymentId}</div>` : ''}
 ${orderObj.paymentDetails?.razorpayOrderId ? `<div class="small">Razorpay Order ID: ${orderObj.paymentDetails.razorpayOrderId}</div>` : ''}
 </div>
 </div>

 <div style="display:flex;justify-content:space-between;margin-top:18px;gap:12px;flex-wrap:wrap">
 <div style="flex:1;min-width:220px">
 <div class="small">Bill To</div>
 <div style="font-weight:700;margin-top:6px">${billing.firstName || billing.name || customer.firstName || customer.name ||'Customer' } ${billing.lastName || customer.lastName ||''}</div>
 <div style="margin-top:6px" class="muted">${billing.street || billing.address ||''}</div>
 <div class="muted">${billing.city ||''}${billing.state ?',' + billing.state :''} ${billing.zip ||''}</div>
 <div class="muted">${billing.country ||''}</div>
 <div class="muted" style="margin-top:6px">📧 ${customer.email || billing.email || orderObj.email ||'—'}</div>
 <div class="muted">📱 ${customer.phone || billing.mobile || orderObj.phone ||'—'}</div>
 </div>

 <div style="flex:1;min-width:220px">
 <div class="small">Ship To</div>
 <div style="font-weight:700;margin-top:6px">${shippingAddr.firstName || shippingAddr.name ||'Recipient' } ${shippingAddr.lastName ||''}</div>
 <div style="margin-top:6px" class="muted">${shippingAddr.street || shippingAddr.address ||''}</div>
 <div class="muted">${shippingAddr.city ||''}${shippingAddr.state ?',' + shippingAddr.state :''} ${shippingAddr.zip ||''}</div>
 <div class="muted">${shippingAddr.country ||''}</div>
 <div class="muted" style="margin-top:6px">📱 ${shippingAddr.mobile ||'—'}</div>
 </div>

 <div style="min-width:180px">
 <div class="small">Customer</div>
 <div style="font-weight:700;margin-top:6px">${customer.firstName || customer.name ||'—'} ${customer.lastName ||''}</div>
 <div class="muted">ID: ${customer.id || orderObj.customerId ||'—'}</div>
 <div class="muted">Sales Channel: ${orderObj.source || orderObj.channel ||'Admin'}</div>
 </div>
 </div>

 <table>
 <thead>
 <tr>
 <th style="width:64px"></th>
 <th>Item</th>
 <th>SKU</th>
 <th class="text-right">Unit</th>
 <th class="text-right">Qty</th>
 <th class="text-right">Line Total</th>
 </tr>
 </thead>
 <tbody>
 ${itemsHtml || `<tr><td colspan="6" class="muted text-right">No items found for this order.</td></tr>`}
 </tbody>
 </table>

 <div style="margin-top:16px;display:flex;justify-content:flex-end">
 <div style="width:340px">
 <div style="display:flex;justify-content:space-between"><div class="muted">Subtotal</div><div>₹${subtotal.toLocaleString('en-IN')}</div></div>
 ${code && `<div style="display:flex;justify-content:space-between"><div class="muted">Discount Coupon</div><div>${code}</div></div>`}
 <div style="display:flex;justify-content:space-between"><div class="muted">Discount</div><div>-₹${discount.toLocaleString('en-IN')}</div></div>
 <div style="display:flex;justify-content:space-between"><div class="muted">Shipping</div><div>₹${shipping.toLocaleString('en-IN')}</div></div>
 <div style="display:flex;justify-content:space-between"><div class="muted">Tax</div><div>₹${tax.toLocaleString('en-IN')}</div></div>
 <div style="margin-top:12px;border-top:1px solid #e5e7eb;padding-top:12px;font-weight:700;display:flex;justify-content:space-between"><div>Total</div><div>₹${total.toLocaleString('en-IN')}</div></div>
 </div>
 </div>

 <div style="margin-top:18px;color:#6b7280;font-size:13px">Notes: ${orderObj.notes || orderObj.customerNotes ||'Thank you for your purchase.'}</div>
 </div>
 </body></html>`;

 return html;
 };

const handlePrintInvoice = async () => {
 try {
 // If current order seems empty, fetch fresh from API (helps admin/admin routes)
 let orderForInvoice = order;
 if (!orderForInvoice || !Array.isArray(orderForInvoice.items) || orderForInvoice.items.length === 0) {
 const res = await dispatch(fetchOrderById(orderId));
 orderForInvoice = (res && res.payload) ? res.payload : orderForInvoice;
 }
 const html = buildInvoiceHTML(orderForInvoice);
 const wrapper = document.createElement('div');
 wrapper.style.position ='fixed';
 wrapper.style.left ='-9999px';
 wrapper.style.top ='0';
 wrapper.style.width ='800px';
 wrapper.style.padding ='24px';
 wrapper.style.background ='#ffffff';
 wrapper.innerHTML = html;
 document.body.appendChild(wrapper);

 const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true, allowTaint: true, backgroundColor:'#ffffff' });
 const imgData = canvas.toDataURL('image/png');
 const pdf = new jsPDF('p','mm','a4');
 const pdfWidth = pdf.internal.pageSize.getWidth();
 const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
 pdf.addImage(imgData,'PNG', 0, 0, pdfWidth, pdfHeight);

 const blob = pdf.output('blob');
 const url = URL.createObjectURL(blob);
 window.open(url,'_blank');
 document.body.removeChild(wrapper);
 } catch (err) {
 console.error(err);
 alert('Failed to generate PDF preview');
 }
};

 const handleDownloadInvoice = async () => {
 try {
 // Ensure we have a populated order before generating
 let orderForInvoice = order;
 if (!orderForInvoice || !Array.isArray(orderForInvoice.items) || orderForInvoice.items.length === 0) {
 const res = await dispatch(fetchOrderById(orderId));
 orderForInvoice = (res && res.payload) ? res.payload : orderForInvoice;
 }
 const html = buildInvoiceHTML(orderForInvoice);
 const wrapper = document.createElement('div');
 wrapper.style.position ='fixed';
 wrapper.style.left ='-9999px';
 wrapper.style.top ='0';
 wrapper.style.width ='800px';
 wrapper.style.padding ='24px';
 wrapper.innerHTML = html;
 document.body.appendChild(wrapper);

 const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true, allowTaint: true, backgroundColor:'#ffffff' });
 const imgData = canvas.toDataURL('image/png');
 const pdf = new jsPDF('p','mm','a4');
 const pdfWidth = pdf.internal.pageSize.getWidth();
 const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
 pdf.addImage(imgData,'PNG', 0, 0, pdfWidth, pdfHeight);
 pdf.save(`invoice-${order.orderId}.pdf`);
 document.body.removeChild(wrapper);
 } catch (err) {
 console.error(err);
 alert('Failed to download invoice');
 }
 };

 return (
 <div className="bg-surface min-h-screen font-inter">
 {/* 1. Page Header Section */}
 <section className="px-6 md:px-20 py-12 md:py-20 bg-surface">
 <div className="max-w-7xl mx-auto">
 <button 
 onClick={() => navigate(-1)} 
 className="mb-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors"
 >
 <ArrowLeft size={14} /> Back to Profile
 </button>
 
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div>
 <p className="text-[12px] font-semibold mb-2 uppercase tracking-widest">Tracking Details</p>
 <h1 className="text-4xl md:text-5xl font-bold font-manrope tracking-tight">{order.orderId}</h1>
 </div>
 <div className="flex items-center gap-3 px-6 py-3 border border-neutral-200">
 <span className={`w-2 h-2 rounded-full ${isCanceled ?'bg-red-500' : isDelivered ?'bg-emerald-500' :"bg-emerald-500"}`}></span>
 <span className="text-[12px] font-bold uppercase tracking-widest">Status: {order.status}</span>
 </div>
 </div>
 </div>
 </section>

 {/* 2. Progress Stepper (Only if not canceled) */}
 {!isCanceled && (
 <section className="px-6 md:px-20 py-12 border-b border-neutral-100">
 <div className="max-w-7xl mx-auto">
 <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-y-12">
 <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-neutral-200 -translate-y-1/2 -z-0"></div>
 
 {steps.map((step, idx) => (
 <div key={idx} className={`flex md:flex-col items-center gap-4 md:px-4 z-10 ${step.status ==='upcoming' ?'opacity-40' :''}`}>
 {step.status ==='completed' ? (
 <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
 <Check size={18} strokeWidth={3} />
 </div>
 ) : step.status ==='active' ? (
 <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
 <div className="w-3 h-3 rounded-full bg-black"></div>
 </div>
 ) : (
 <div className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center">
 <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
 </div>
 )}
 <div className="text-left md:text-center">
 <p className={`text-[12px] uppercase tracking-wider ${step.status ==='active' ?'font-bold' :'font-medium'}`}>{step.label}</p>
 <p className="text-[10px]">{step.date}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>
 )}

 {/* 3. Main Content Grid */}
 <section className="px-6 md:px-20 py-12 md:py-20">
 <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
 
 {/* Left Column */}
 <div className="lg:col-span-8 space-y-12">
 
 {/* Shipping Log */}
 {order?.status ==="Delivered" ? <div className='w-full text-center font-black text-xl'>
 <h1>Thanks for your purchase!</h1>
 </div> : <div>
 <h2 className="text-2xl font-semibold font-manrope mb-8">Shipping Updates</h2>
 <div className="space-y-0">
 {order.tracking?.length > 0 ? order.tracking.map((log, i) => (
 <div key={i} className="flex gap-6 pb-8 border-l border-neutral-200 ml-3 pl-8 relative last:border-0">
 <div className={`absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full ${i === order.tracking.length - 1 ?'bg-black' :'bg-neutral-300'}`}></div>
 <div className="w-24 shrink-0">
 <p className="text-[11px] font-bold uppercase tracking-tight">{log.date}</p>
 <p className="text-xs">—</p>
 </div>
 <div>
 <p className="font-semibold text-base">{log.status}</p>
 <p className="text-sm">{log.location ||'Order update'}</p>
 </div>
 </div>
 )) : (
 <div className="flex gap-6 pb-8 border-l border-neutral-200 ml-3 pl-8 relative">
 <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full bg-black"></div>
 <div className="w-24 shrink-0">
 <p className="text-[11px] font-bold uppercase tracking-tight">{order.createdAt?.split('T')[0]}</p>
 <p className="text-xs">—</p>
 </div>
 <div>
 <p className="font-semibold text-base">Order Placed</p>
 <p className="text-sm">Your order has been confirmed</p>
 </div>
 </div>
 )}
 </div>
 </div>}

 {/* Bento Cards */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="border border-neutral-200 p-8 space-y-6">
 <h3 className="text-[12px] font-bold uppercase tracking-widest border-b border-neutral-100 pb-4">Carrier Details</h3>
 <div className="space-y-4">
 <div className="flex justify-between text-sm"><span className="">Carrier</span><span className="font-medium">Express Courier</span></div>
 <div className="flex justify-between text-sm">
 <span className="">Tracking No.</span>
 <span className="font-medium flex items-center gap-2">{order.orderId} {hasCopied ? <Check size={14} className="text-emerald-500 w-6 h-6" /> : <Copy onClick={()=>copy(order?.trackingId)} size={14} className="cursor-pointer text-neutral-400" />}</span>
 </div>
 <div className="flex justify-between text-sm"><span className="">Payment Method</span><span className="font-medium uppercase">{order.paymentMethod}</span></div>
 </div>
 </div>
 <div className="border border-neutral-200 p-8 space-y-6">
 <h3 className="text-[12px] font-bold uppercase tracking-widest border-b border-neutral-100 pb-4">Shipping Address</h3>
 <div className="text-sm leading-relaxed">
 <p className="font-bold">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
 <p className="">{order.shippingAddress?.street}{order.shippingAddress?.apartment && `, ${order.shippingAddress.apartment}`}</p>
 <p className="">{order.shippingAddress?.address}</p>
 <p className="">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
 <p className="">{order.shippingAddress?.country}</p>
 <p className=" mt-2">📱 {order.shippingAddress?.mobile}</p>
 </div>
 </div>
 </div>
 </div>

 {/* Right Column: Order Summary */}
 <div className="lg:col-span-4 space-y-12">
 <div className=" p-8 border border-neutral-100">
 <h2 className="text-[12px] font-bold uppercase tracking-widest mb-8">Package Items ({order.items?.length || 0})</h2>
 <div className="space-y-6">
 {order.items?.map((item, i) => (
 <div key={i} className="flex gap-4">
 <div className="w-20 h-24 bg-neutral-200 overflow-hidden flex-shrink-0">
 <img src={item.thumbnail || item.images?.[0]} alt={item.name} className={`w-full h-full object-cover ${isCanceled ?'grayscale' :''}`} />
 </div>
 <div className="flex flex-col justify-between py-1">
 <div>
 <p className="text-sm font-bold leading-tight">{item.name}</p>
 <p className="text-[11px] mt-1">Size: {item.size} | Qty: {item.quantity}</p>
 {item.variant && <p className="text-[11px]">Color: {item.variant}</p>}
 </div>
 <p className="text-sm font-semibold">₹{item.price?.toLocaleString('en-IN')}</p>
 </div>
 </div>
 ))}
 </div>
 
 {/* Order Totals */}
 <div className="mt-8 pt-8 border-t border-neutral-200 space-y-3">
 <div className="flex justify-between text-sm">
 <span className="">Subtotal</span>
 <span className="font-bold">₹{order.subtotal?.toLocaleString('en-IN')}</span>
 </div>
 {order.discount > 0 && (
 <div className="flex justify-between text-sm">
 <span className="">Discount</span>
 <span className="font-bold text-green-600">-₹{order.discount?.toLocaleString('en-IN')}</span>
 </div>
 )}
 <div className="flex justify-between text-sm">
 <span className="">Shipping</span>
 <span className="font-bold">{order.shipping === 0 ?'FREE' : `₹${order.shipping?.toLocaleString('en-IN')}`}</span>
 </div>
 <div className="flex justify-between text-sm">
 <span className="">Tax</span>
 <span className="font-bold">₹{order.tax?.toLocaleString('en-IN')}</span>
 </div>
 <div className="flex justify-between pt-4 border-t border-neutral-300">
 <span className="text-[12px] font-bold uppercase tracking-widest">Total Amount</span>
 <span className="text-xl font-bold font-manrope">₹{order.total?.toLocaleString('en-IN')}</span>
 </div>
 </div>
 </div>
<div className="p-6 border border-neutral-200 rounded-2xl bg-white grid grid-cols-1 md:grid-cols-1 gap-4 shadow-sm">

      
      <button onClick={handlePrintInvoice} className="flex items-center justify-center gap-2 border border-neutral-800 bg-neutral-900 text-white rounded-xl px-4 py-3 font-semibold transition-all duration-200 hover:bg-emerald-600 hover:border-emerald-600 active:scale-[0.98]">
        <FaPrint size={14} /> Print Invoice
      </button>
      
    </div>
 <div className="p-8 border border-neutral-200">
 <h3 className="text-xl font-bold font-manrope mb-4">Need Help?</h3>
 <p className="text-sm mb-6 leading-relaxed">
 {isCanceled 
 ?"Your order has been cancelled. If you have any questions about the cancellation or refund, our team is here to assist."
 : isDelivered
 ?"Your order has been delivered successfully. If you need to return or exchange any items, contact our support team."
 :"If you have questions regarding your delivery, our team is here to assist."
 }
 </p>
 <div className="space-y-3">
 <button
 onClick={isCanceled ? () => navigate('/') : handleSupportClick}
 className="w-full py-4 bg-black text-white text-[12px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-colors"
 >
 {isCanceled ?'Continue Shopping' : isDelivered ?'Initiate Return' :'Contact Support'}
 </button>
 <button className="w-full py-4 border border-neutral-300 text-[12px] font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 hover:opacity-40 transition-colors">
 {isCanceled ?'Refund Status' :'Shipping Policy'}
 </button>
 </div>
 </div>
 </div>

 </div>
 </section>
 </div>
 );
};

export default OrderDetail;


// import React, { useState } from'react';

// const OrderDetails = () => {
// // States:'in-transit','delivered','canceled'
// const [status, setStatus] = useState('canceled');

// const orderData = {
// id:"#ORD-74921",
// total:"£845.00",
// date:"Oct 24, 2024",
// items: [
// { id: 1, name:"Minimalist Wool Overcoat", price:"£595.00", variant:"Charcoal / Large", qty: 1, img:"https://lh3.googleusercontent.com/aida-public/AB6AXuA1BqAsPXi3Ty5kL3-3GPIAFAiYFNMeVWsX7O93TqV39BCB_OKafE_I33ftOcFToMgrFw7MqN7JR_I0bMr-Wk9H3GThPZDXIuOknfwqWqTkbHZRGzJfQaNdnVqRlcUnrhKpttAwkImq0Ovb8A2wAO2uoGpWwogdemvbqCf9BfM_zZ8SIJNZsfDfF0pSJhI3cUpJbnySpi1Kl7lOQbk_pEAcxAifedEfi8nH5DEFSe75HxL7YiWXJhxt3tDEQrOhnNLUmmBINknkKxdB" },
// { id: 2, name:"Essential Cashmere Knit", price:"£250.00", variant:"Oatmeal / Medium", qty: 2, img:"https://lh3.googleusercontent.com/aida-public/AB6AXuB31hY-ajggKp-7fPGzaii2c6xkoEbDcdSojKjyRzCIePqIrqjKYNmVSw1A3SYsL4Tw1KBT6r6Z34e-K_Eb3n55DVk9fc-vV6iw_V7uC3atIXP4UfIy5Gk3Q4GpmQe4QCjI7b9mm2UY83Iw-AJkQtfl592MJ_DENRbLrxPXfLWm1-hUDXJEAac-WkbD217bKLh_TqtiYyMxTdGv1fXqBVWX6zbmtK3kkf9rGQPO3Wf3LLUxxAkcEPtKNhgho9ps2Gmiy_3To8V1gZ1l" }
// ]
// };

// return (
// <div className="min-h-screen text-slate-900">
// {/* Top Navigation */}
// <header className="fixed top-0 w-full z-50 border-b border-neutral-200 flex justify-between items-center px-6 md:px-20 h-16">
// <div className="text-xl font-bold tracking-tighter">LUXE</div>
// <div className="flex items-center gap-6">
// <span className="material-symbols-outlined cursor-pointer">shopping_bag</span>
// <span className="material-symbols-outlined cursor-pointer">person</span>
// </div>
// </header>

// <main className="mt-16">
// {/* Dynamic Header Section */}
// <section className="px-6 md:px-20 py-12 bg-[#f9f9f9]">
// <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
// <div>
// <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${
// status ==='delivered' ?'text-green-600' : status ==='canceled' ?'text-red-600' :''
// }`}>
// {status ==='delivered' ?'Delivery Confirmed' : status ==='canceled' ?'Order Terminated' :'Tracking Details'}
// </p>
// <h1 className="text-4xl md:text-5xl font-bold">{orderData.id}</h1>
// </div>
 
// <div className="flex items-center gap-3 px-6 py-3 border border-neutral-200">
// <span className={`w-2.5 h-2.5 rounded-full ${
// status ==='delivered' ?'bg-green-600' : status ==='canceled' ?'bg-red-600' :'bg-[#755939]'
// }`}></span>
// <span className="text-[10px] font-bold uppercase tracking-widest">
// Status: {status.replace('-','')}
// </span>
// </div>
// </div>
// </section>

// {/* Progress Stepper - Hidden on Canceled */}
// {status !=='canceled' && (
// <section className="px-6 md:px-20 py-12 border-b border-neutral-100">
// <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-y-8 relative">
// <div className="hidden md:block absolute top-5 left-0 w-full h-[1px] bg-neutral-200 -z-10"></div>
// {['Placed','Processed','Shipped','Delivered'].map((step, idx) => (
// <div key={step} className={`flex md:flex-col items-center gap-4 md:px-4 ${idx > 2 && status !=='delivered' ?'opacity-40' :''}`}>
// <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${idx <= 2 ?'bg-black border-black text-white' :'bg-white border-neutral-200 text-neutral-300'}`}>
// <span className="material-symbols-outlined text-sm">{idx <= 2 ?'check' :'local_shipping'}</span>
// </div>
// <div className="text-left md:text-center">
// <p className="text-[10px] font-bold uppercase">{step}</p>
// </div>
// </div>
// ))}
// </div>
// </section>
// )}

// {/* Main Content Grid */}
// <section className="px-6 md:px-20 py-12">
// <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
 
// <div className="lg:col-span-8 space-y-12">
// {/* Canceled View Content */}
// {status ==='canceled' && (
// <div className="space-y-6">
// <div className="bg-white p-8 border border-neutral-200 flex gap-6 items-center">
// <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-red-600">
// <span className="material-symbols-outlined">cancel</span>
// </div>
// <div>
// <h2 className="text-xl font-bold">Order Canceled</h2>
// <p className="text-sm">The request was processed successfully. No charges were made.</p>
// </div>
// </div>
// <div className="bg-neutral-50 p-8 border border-neutral-200 flex gap-4">
// <span className="material-symbols-outlined text-[#755939]">payments</span>
// <div>
// <h3 className="font-bold">Refund Information</h3>
// <p className="text-sm mt-1">Refund of {orderData.total} was sent to your original payment method.</p>
// </div>
// </div>
// </div>
// )}

// {/* Tracking Log - Only visible if IN TRANSIT */}
// {status ==='in-transit' && (
// <div>
// <h2 className="text-2xl font-bold mb-8">Shipping Updates</h2>
// <div className="space-y-0 relative border-l border-neutral-200 ml-3 pl-8">
// <div className="pb-8 relative">
// <div className="absolute -left-[36.5px] top-0 w-2.5 h-2.5 rounded-full bg-black"></div>
// <p className="text-[10px] font-bold text-neutral-400">OCT 27, 09:42 AM</p>
// <p className="font-bold text-sm">Arrived at Sort Facility</p>
// <p className="text-xs">North London Distribution Center, UK</p>
// </div>
// </div>
// </div>
// )}

// {/* Shipping Address / Carrier Card */}
// <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// <div className="border border-neutral-200 p-8">
// <h3 className="text-[10px] font-bold uppercase tracking-widest border-b pb-4 mb-4">Shipping Address</h3>
// <p className="text-sm font-bold">Alexander Thorne</p>
// <p className="text-sm">12 High Street, Marylebone, London, UK</p>
// </div>
// <div className="border border-neutral-200 p-8">
// <h3 className="text-[10px] font-bold uppercase tracking-widest border-b pb-4 mb-4">Carrier Details</h3>
// <p className="text-sm font-bold">FedEx Express</p>
// <p className="text-sm">Track ID: 749210034451</p>
// </div>
// </div>
// </div>

// {/* Sidebar: Order Summary */}
// <aside className="lg:col-span-4 space-y-6">
// <div className="bg-[#f9f9f9] p-8 border border-neutral-100">
// <h2 className="text-[10px] font-bold uppercase tracking-widest mb-8 text-neutral-400">Your Package</h2>
// <div className="space-y-6">
// {orderData.items.map(item => (
// <div key={item.id} className="flex gap-4">
// <div className="w-20 h-24 bg-neutral-200 flex-shrink-0">
// <img 
// src={item.img} 
// className={`w-full h-full object-cover transition-all ${status ==='canceled' ?'grayscale opacity-50' :''}`} 
// alt={item.name} 
// />
// </div>
// <div className="flex flex-col justify-center">
// <p className="text-sm font-bold">{item.name}</p>
// <p className="text-xs">{item.variant}</p>
// <p className="text-xs mt-1 font-bold">{item.price}</p>
// </div>
// </div>
// ))}
// </div>
// <div className="mt-8 pt-6 border-t border-neutral-200 flex justify-between items-center">
// <span className="text-[10px] font-bold uppercase">Total</span>
// <span className="text-xl font-bold">{orderData.total}</span>
// </div>
// </div>

// {/* Action Buttons */}
// <div className="flex flex-col gap-3">
// <button className="w-full py-4 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors">
// {status ==='delivered' ?'Initiate Return' : status ==='canceled' ?'Continue Shopping' :'Track on Carrier Site'}
// </button>
// <button className="w-full py-4 border border-neutral-300 text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-50 transition-colors">
// Contact Support
// </button>
// </div>
// </aside>

// </div>
// </section>
// </main>
// </div>
// );
// };

// export default OrderDetails;