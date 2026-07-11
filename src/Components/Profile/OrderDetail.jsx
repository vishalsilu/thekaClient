import React, { useEffect } from 'react';
import { ArrowLeft, Check, Copy } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../../Redux/thunks/orderThunks';
import { useClipboard } from '../../Utils/useClipboard';
import html2canvas from 'html2canvas/dist/html2canvas.esm.js';
import { jsPDF } from 'jspdf';
import { FaPrint, FaRedo } from 'react-icons/fa';

// Import the new utility we just created
import { generateProfessionalInvoiceHTML } from '../../Utils/invoiceTemplate';

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

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const handleSupportClick = () => {
    const customerMobile = order?.shippingAddress?.mobile || order?.phone || 'N/A';
    const userIdValue = user?.id || user?._id || order?.userId || 'N/A';
    const orderNumber = order?.orderId || order?.id || 'N/A';
    const shippingAddress = order?.shippingAddress || {};
    const lineItems = Array.isArray(order?.items)
      ? order.items.map((item, index) => `  ${index + 1}. ${item.name || 'Item'} x ${item.quantity || 1}${item.variant ? ` (${item.variant})` : ''}`).join('\n')
      : '  No items available';

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
      'Please enter your message ',
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

  // ----- INVOICE GENERATION LOGIC -----
  const generatePDFWrapper = async (orderForInvoice, action = 'print') => {
    try {
      // Use the imported professional template
      const html = generateProfessionalInvoiceHTML(orderForInvoice, siteData);
      
      const wrapper = document.createElement('div');
      wrapper.style.position = 'fixed';
      wrapper.style.left = '-9999px';
      wrapper.style.top = '0';
      wrapper.style.width = '800px'; 
      wrapper.style.background = '#ffffff';
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper);

      // Give images a tiny moment to load before capturing
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(wrapper, { 
        scale: 2, 
        useCORS: true, 
        allowTaint: true, 
        backgroundColor: '#ffffff' 
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      if (action === 'download') {
        pdf.save(`Invoice_${orderForInvoice.orderId}.pdf`);
      } else {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      }
      
      document.body.removeChild(wrapper);
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} invoice`);
    }
  };

  const handlePrintInvoice = async () => {
    let orderForInvoice = order;
    if (!orderForInvoice || !Array.isArray(orderForInvoice.items) || orderForInvoice.items.length === 0) {
      const res = await dispatch(fetchOrderById(orderId));
      orderForInvoice = (res && res.payload) ? res.payload : orderForInvoice;
    }
    await generatePDFWrapper(orderForInvoice, 'print');
  };

  const handleDownloadInvoice = async () => {
    let orderForInvoice = order;
    if (!orderForInvoice || !Array.isArray(orderForInvoice.items) || orderForInvoice.items.length === 0) {
      const res = await dispatch(fetchOrderById(orderId));
      orderForInvoice = (res && res.payload) ? res.payload : orderForInvoice;
    }
    await generatePDFWrapper(orderForInvoice, 'download');
  };
  // ------------------------------------

  if (detailLoading && !order) return (
    <div className="flex items-center justify-center min-h-screen font-inter">
      <p>Loading order...</p>
    </div>
  );

  if (detailError && !order) return (
    <div className="flex items-center justify-center min-h-screen font-inter">
      <p className="text-red-500">{detailError}</p>
    </div>
  );

  if (!order) return (
    <div className="flex items-center justify-center min-h-screen font-inter">
      <p>Order not found</p>
    </div>
  );

  const normalizedStatus = String(order.status || '').toLowerCase();
  const isCanceled = normalizedStatus === 'cancelled';
  const isDelivered = normalizedStatus === 'delivered';

  const getProgressSteps = () => {
    const statusOrder = ['placed', 'booked', 'packed', 'shipped', 'reached', 'in transit', 'out for delivery', 'delivered'];
    const currentIdx = statusOrder.indexOf(normalizedStatus);

    const baseSteps = [
      { key: 'placed', label: 'Order Placed' },
      { key: 'booked', label: 'Booked' },
      { key: 'packed', label: 'Packed' },
      { key: 'shipped', label: 'Shipped' },
      { key: 'reached', label: 'Reached' },
      { key: 'in transit', label: 'In Transit' },
      { key: 'out for delivery', label: 'Out for Delivery' },
      { key: 'delivered', label: 'Delivered' },
    ];

    return baseSteps.map((step) => {
      const stepIdx = statusOrder.indexOf(step.key);
      let stepStatus = 'upcoming';
      if (stepIdx < currentIdx) stepStatus = 'completed';
      else if (stepIdx === currentIdx) stepStatus = 'active';

      const trackingLog = order.tracking?.find(t => String(t.status).toLowerCase() === step.key);
      const dateDisplay = trackingLog?.date || (step.key === 'placed' ? order.createdAt?.split('T')[0] : 'Pending');

      return { label: step.label, date: dateDisplay, status: stepStatus };
    });
  };

  const steps = getProgressSteps();

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
              <span className={`w-2 h-2 rounded-full ${isCanceled ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
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
                <div key={idx} className={`flex md:flex-col items-center gap-4 md:px-4 z-10 ${step.status === 'upcoming' ? 'opacity-40' : ''}`}>
                  {step.status === 'completed' ? (
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                      <Check size={18} strokeWidth={3} />
                    </div>
                  ) : step.status === 'active' ? (
                    <div className="w-12 h-12 rounded-full border-2 border-black flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-black"></div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center">
                      <span className="w-2 h-2 rounded-full bg-neutral-300"></span>
                    </div>
                  )}
                  <div className="text-left md:text-center">
                    <p className={`text-[12px] uppercase tracking-wider ${step.status === 'active' ? 'font-bold' : 'font-medium'}`}>{step.label}</p>
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
            {order?.status === "Delivered" ? (
              <div className='w-full text-center font-black text-xl'>
                <h1>Thanks for your purchase!</h1>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold font-manrope mb-8">Shipping Updates</h2>
                <div className="space-y-0">
                  {order.tracking?.length > 0 ? order.tracking.map((log, i) => (
                    <div key={i} className="flex gap-6 pb-8 border-l border-neutral-200 ml-3 pl-8 relative last:border-0">
                      <div className={`absolute -left-[5px] top-0 w-[9px] h-[9px] rounded-full ${i === order.tracking.length - 1 ? 'bg-black' : 'bg-neutral-300'}`}></div>
                      <div className="w-24 shrink-0">
                        <p className="text-[11px] font-bold uppercase tracking-tight">{log.date}</p>
                        <p className="text-xs">—</p>
                      </div>
                      <div>
                        <p className="font-semibold text-base">{log.status}</p>
                        <p className="text-sm">{log.location || 'Order update'}</p>
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
              </div>
            )}

            {/* Bento Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-neutral-200 p-8 space-y-6">
                <h3 className="text-[12px] font-bold uppercase tracking-widest border-b border-neutral-100 pb-4">Carrier Details</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm"><span>Carrier</span><span className="font-medium">Express Courier</span></div>
                  <div className="flex justify-between text-sm">
                    <span>Tracking No.</span>
                    <span className="font-medium flex items-center gap-2">
                      {order.orderId} 
                      {hasCopied ? <Check size={14} className="text-emerald-500 w-6 h-6" /> : <Copy onClick={()=>copy(order?.trackingId)} size={14} className="cursor-pointer text-neutral-400" />}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm"><span>Payment Method</span><span className="font-medium uppercase">{order.paymentMethod}</span></div>
                </div>
              </div>
              
              <div className="border border-neutral-200 p-8 space-y-6">
                <h3 className="text-[12px] font-bold uppercase tracking-widest border-b border-neutral-100 pb-4">Shipping Address</h3>
                <div className="text-sm leading-relaxed">
                  <p className="font-bold">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                  <p>{order.shippingAddress?.street}{order.shippingAddress?.apartment && `, ${order.shippingAddress.apartment}`}</p>
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zip}</p>
                  <p>{order.shippingAddress?.country}</p>
                  <p className="mt-2">📱 {order.shippingAddress?.mobile}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4 space-y-12">
            <div className="p-8 border border-neutral-100">
              <h2 className="text-[12px] font-bold uppercase tracking-widest mb-8">Package Items ({order.items?.length || 0})</h2>
              <div className="space-y-6">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 h-24 bg-neutral-200 overflow-hidden flex-shrink-0">
                      <img src={item.thumbnail || item.images?.[0]} alt={item.name} className={`w-full h-full object-cover ${isCanceled ? 'grayscale' : ''}`} />
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
                  <span>Subtotal</span>
                  <span className="font-bold">₹{order.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Discount</span>
                    <span className="font-bold text-green-600">-₹{order.discount?.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="font-bold">{order.shipping === 0 ? 'FREE' : `₹${order.shipping?.toLocaleString('en-IN')}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span className="font-bold">₹{order.tax?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-4 border-t border-neutral-300">
                  <span className="text-[12px] font-bold uppercase tracking-widest">Total Amount</span>
                  <span className="text-xl font-bold font-manrope">₹{order.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-6 border border-neutral-200 rounded-2xl bg-white grid grid-cols-1 md:grid-cols-2 gap-4 shadow-sm">
              <button 
                onClick={handlePrintInvoice} 
                className="flex items-center justify-center gap-2 border border-neutral-800 bg-neutral-900 text-white rounded-xl px-4 py-3 font-semibold transition-all duration-200 hover:bg-emerald-600 hover:border-emerald-600 active:scale-[0.98]"
              >
                <FaPrint size={14} /> Print
              </button>
              <button 
                onClick={handleDownloadInvoice} 
                className="flex items-center justify-center gap-2 border border-neutral-300 bg-white text-neutral-800 rounded-xl px-4 py-3 font-semibold transition-all duration-200 hover:border-neutral-800 active:scale-[0.98]"
              >
                Download PDF
              </button>
            </div>

            <div className="p-8 border border-neutral-200">
              <h3 className="text-xl font-bold font-manrope mb-4">Need Help?</h3>
              <p className="text-sm mb-6 leading-relaxed">
                {isCanceled 
                  ? "Your order has been cancelled. If you have any questions about the cancellation or refund, our team is here to assist."
                  : isDelivered
                  ? "Your order has been delivered successfully. If you need to return or exchange any items, contact our support team."
                  : "If you have questions regarding your delivery, our team is here to assist."
                }
              </p>
              <div className="space-y-3">
                <button
                  onClick={isCanceled ? () => navigate('/') : handleSupportClick}
                  className="w-full py-4 bg-black text-white text-[12px] font-bold uppercase tracking-widest hover:bg-emerald-500 transition-colors"
                >
                  {isCanceled ? 'Continue Shopping' : isDelivered ? 'Initiate Return' : 'Contact Support'}
                </button>
                <button onClick={(e)=>isDelivered || isCanceled ? handleSupportClick(e) : navigate('/info/shipping-information')} className="w-full py-4 border border-neutral-300 text-[12px] font-bold uppercase tracking-widest hover:border-emerald-500 hover:text-emerald-500 hover:opacity-40 transition-colors">
                  {isCanceled ? 'Refund Status' : isDelivered ? "Request Return" : "Shipping Policy"}
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