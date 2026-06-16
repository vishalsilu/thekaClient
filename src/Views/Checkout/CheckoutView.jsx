// views/CheckoutView.jsx
import React from 'react';
import { FaCheckCircle, FaTag, FaTimes, FaLock } from 'react-icons/fa';
import AddressForm from '../../Components/Profile/AddressForm';
import AdvertisementBanner from '../../Components/Ads/AdvertisementBanner';
import RazorpayPayment from '../../Components/Payment/RazorpayPayment';
import { HomeIcon } from 'lucide-react';

const CheckoutView = ({ controller }) => {
  const {
    user, isAuthenticated, addressChoice, setAddressChoice, selectedAddressId,
    setSelectedAddressId, paymentMethod, setPaymentMethod, cartItems, placing,
    placeErr, subtotal, navigate, couponInput, setCouponInput, appliedCoupon,
    couponLoading, isAnimating, discountAmount, shipping,
    handlingTime, total, handleApplyCoupon, removeCoupon, handlePayment,
    pendingOrder, handlePaymentSuccess, handlePaymentFailure,
    handleAddressSaved, handleAddressClose,
    enabledPaymentOptions, paymentInstructions
  } = controller;

  if (cartItems.length === 0) return null;

  return (
    <div className="bg-zinc-50 min-h-screen text-zinc-900 font-sans antialiased">
      <div className="flex items-center justify-center gap-4">
        <h1 className='text-gray-400 text-[10px]'><HomeIcon/></h1>
      </div>
      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          
          {/* LEFT COLUMN: FORMS & PAYMENT */}
          <div className="lg:col-span-7 space-y-12 order-2 lg:order-1">
            
            {/* Contact Information */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold tracking-tight font-['Manrope'] text-zinc-900">Contact Information</h2>
                {!isAuthenticated && (
                  <p className="text-xs text-zinc-500">
                    Please <button onClick={() => navigate('/login')} className="underline font-bold text-zinc-900 hover:text-zinc-600 transition-colors">log in</button> to place your order.
                  </p>
                )}
              </div>

              {isAuthenticated ? (
                <div className="flex flex-wrap gap-3 items-center justify-between p-5 bg-white border border-zinc-200 rounded-xl shadow-sm animate-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 font-black text-xs text-zinc-700">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-0.5">Logged in as</p>
                      <p className="text-sm font-semibold text-zinc-800">{user?.email}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/profile/${user?.id}`)} className="text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-black underline underline-offset-4 transition-colors">Profile</button>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                    <input disabled type="email" placeholder="Login required" className="w-full border border-zinc-200 p-3 text-sm rounded-lg outline-none bg-zinc-100 text-zinc-400 cursor-not-allowed" />
                  </div>
                </div>
              )}
            </section>

            {/* Shipping Address Selection */}
            <section className="space-y-6 pt-10 border-t border-zinc-200">
              <h2 className="text-2xl font-bold tracking-tight font-['Manrope'] text-zinc-900">Shipping Address</h2>
              {isAuthenticated ? (
                <div className="space-y-6">
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-black">
                      <input type="radio" checked={addressChoice === 'saved'} onChange={() => setAddressChoice('saved')} className="text-black focus:ring-0 focus:ring-offset-0" /> Saved Address
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-black">
                      <input type="radio" checked={addressChoice === 'new'} onChange={() => setAddressChoice('new')} className="text-black focus:ring-0 focus:ring-offset-0" /> Add New
                    </label>
                  </div>
                  
                  {addressChoice === 'saved' ? (
                    <div className="grid grid-cols-1 gap-4 animate-in fade-in duration-200">
                      {user?.addresses?.map(addr => (
                        <div key={addr._id} onClick={() => setSelectedAddressId(String(addr._id))}
                          className={`p-6 bg-white border rounded-xl relative cursor-pointer transition-all ${String(selectedAddressId) === String(addr._id) ? 'border-zinc-900 ring-1 ring-zinc-900' : 'border-zinc-200 hover:border-zinc-400'}`}>
                          <div className="flex justify-between items-start">
                            <p className="text-sm font-bold uppercase tracking-wide text-zinc-900">{addr.firstName} {addr.lastName}</p>
                            <span className="text-[9px] bg-zinc-100 border border-zinc-200 text-zinc-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">{addr.type}</span>
                          </div>
                          <p className="text-sm text-zinc-500 mt-2 font-medium">{addr.street}, {addr.city}, {addr.zip}</p>
                          <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1 tracking-wide">Mobile: {addr.mobile}</p>
                          {String(selectedAddressId) === String(addr._id) && <span className="absolute top-2 right-2 text-zinc-950"><FaCheckCircle size={16} /></span>}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <AddressForm onAddressSaved={handleAddressSaved} onClose={handleAddressClose} />
                  )}
                </div>
              ) : (
                <AddressForm onAddressSaved={() => navigate('/login')} onClose={() => navigate('/login')} />
              )}
            </section>

            <AdvertisementBanner location="checkout" />

            {/* Payment Systems */}
            <section className="space-y-6 pt-10 border-t border-zinc-200">
              <h2 className="text-2xl font-bold tracking-tight font-['Manrope'] text-zinc-900">Payment Method</h2>
              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden divide-y divide-zinc-200 shadow-sm">
                {enabledPaymentOptions.map((option) => (
                  <div key={option.id} className={`p-6 transition-colors ${paymentMethod === option.id ? 'bg-zinc-50' : 'bg-white'}`}>
                    <label className="flex items-start gap-3 cursor-pointer font-bold text-sm text-zinc-800">
                      <input
                        type="radio"
                        checked={paymentMethod === option.id}
                        onChange={() => setPaymentMethod(option.id)}
                        className="text-black focus:ring-0 focus:ring-offset-0 mt-1"
                      />
                      <div>
                        <div>{option.label || option.id.toUpperCase()}</div>
                        <p className="mt-2 text-xs text-zinc-600 max-w-2xl">{option.description || 'Select this option to continue.'}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {paymentInstructions && (
                <div className="mt-4 rounded-3xl border border-zinc-200 bg-zinc-50 p-5 text-sm text-zinc-700">
                  <strong>Payment notes:</strong> {paymentInstructions}
                </div>
              )}
            </section>

            {placeErr && <p className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-lg">{placeErr}</p>}

            {/* Razorpay Payment Widget or Standard Button */}
            {pendingOrder && paymentMethod === 'razorpay' ? (
              <RazorpayPayment
                orderId={pendingOrder.orderId}
                amount={total}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentFailure={handlePaymentFailure}
                loading={placing}
                autoOpen={true}
              />
            ) : (
              <button
                onClick={handlePayment}
                disabled={placing || !isAuthenticated}
                className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-3 ${
                  placing || !isAuthenticated
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                  : 'bg-black text-white hover:bg-zinc-800 shadow-zinc-200'
                }`}
              >
                {placing ? 'Placing Order…' : 'Pay Now & Complete Order'}
              </button>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className={`sticky top-32 bg-white p-8 md:p-10 border border-zinc-200 rounded-2xl shadow-sm transition-all duration-300 ${isAnimating ? 'ring-2 ring-black scale-[1.01]' : ''}`}>
              <h2 className="text-xs font-black mb-8 uppercase tracking-[0.3em] text-zinc-400">Order Summary</h2>
              
              <div className="space-y-6 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar divide-y divide-zinc-100">
                {cartItems.map((item, index) => (
                  <div key={index} className={`flex gap-4 ${index > 0 ? 'pt-6' : ''}`}>
                    <div className="w-20 h-28 flex-shrink-0 bg-zinc-50 border border-zinc-100 rounded-lg overflow-hidden">
                      <img src={item.images?.[0] || item.thumbnail || item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wide text-zinc-900 leading-tight">{item.name}</h4>
                        <p className="text-[10px] text-zinc-400 font-bold uppercase mt-1.5 tracking-wider">{item.color} · Size {item.size}</p>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5 tracking-wider">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-black text-zinc-950 tabular-nums">₹{(item.salePrice || item.price).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100">
                {!appliedCoupon ? (
                  <div className="space-y-2">
                   <div className="mt-4 grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
 <input
 type="text"
 placeholder="CODE"
 value={couponInput}
 onChange={(e) => setCouponInput(e.target.value)}
 className="flex-1 bg-zinc-50 col-span-2 text-black border border-zinc-200 text-[11px] font-bold tracking-[0.15em] px-4 py-3 focus:outline-none focus:border-black uppercase rounded-lg"
 />
 <button
 onClick={() => handleApplyCoupon()}
 className={`${!couponInput  ? "bg-gray-300" : "bg-black"} text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.25em] rounded-lg active:scale-95 hover:bg-zinc-800 transition-all`}
 >
 Apply
 </button>
 </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 border border-zinc-900 bg-zinc-50 rounded-xl animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2 text-zinc-900">
                      <FaTag className="text-xs" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{appliedCoupon.code} Applied</span>
                    </div>
                    {appliedCoupon?.discountAmount !== undefined && (
                      <div className="text-[10px] font-bold text-green-800 bg-green-100 border border-green-200 px-2 py-0.5 rounded">
                        Validated
                      </div>
                    )}
                    <button onClick={removeCoupon} className="text-zinc-400 hover:text-black p-1 transition-colors">
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-500">Subtotal</span>
                  <span className="font-bold text-zinc-950 tabular-nums">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                {appliedCoupon && discountAmount > 0 && (
                  <div className={`flex justify-between text-sm text-emerald-600 font-bold transition-all duration-300 ${isAnimating ? 'animate-bounce' : ''}`}>
                    <span className="italic">Discount ({appliedCoupon.code})</span>
                    <span className="tabular-nums">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-500">Shipping</span>
                  <span className="font-bold text-green-600 tracking-wide">{shipping === 0 ? "FREE" : `₹${shipping}.00`}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-500">Delivery Time</span>
                  <span className="font-bold text-zinc-700">{handlingTime}</span>
                </div>

                <div className="flex justify-between pt-6 mt-6 border-t border-zinc-900 items-baseline">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-500">Total</span>
                  <div className={`text-right transition-all duration-300 ${isAnimating ? 'scale-105' : ''}`}>
                    <span className="text-[9px] font-mono text-zinc-400 block font-bold tracking-wider mb-1">INR</span>
                    <span className="text-3xl font-black tracking-tighter text-zinc-950 tabular-nums">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutView;