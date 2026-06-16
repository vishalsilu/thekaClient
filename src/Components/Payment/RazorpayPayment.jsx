import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import api from '../../config/api';

const RazorpayPayment = ({ orderId, amount, onPaymentSuccess, onPaymentFailure, loading = false, autoOpen = false }) => {
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const autoStartRef = useRef(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setRazorpayLoaded(true);
    };
    script.onerror = () => {
      toast.error('Failed to load Razorpay');
      setRazorpayLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    autoStartRef.current = false;
  }, [orderId]);

  useEffect(() => {
    if (!autoOpen || !razorpayLoaded || !orderId || paymentProcessing || autoStartRef.current) {
      return;
    }

    autoStartRef.current = true;
    handleRazorpayPayment();
  }, [autoOpen, razorpayLoaded, orderId, paymentProcessing]);

  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Razorpay is not loaded. Please refresh and try again.');
      return;
    }

    if (!window.Razorpay) {
      toast.error('Razorpay is not available');
      return;
    }

    setPaymentProcessing(true);

    try {
      // Step 1: Initiate Razorpay order from backend
      const initiateRes = await api.post(
        `/orders/payment/initiate`,
        {
          orderId,
          amount,
          currency: 'INR',
        }
      );

      const { razorpayOrderId, keyId } = initiateRes.data;

      if (!razorpayOrderId || !keyId) {
        toast.error('Failed to initiate payment');
        setPaymentProcessing(false);
        onPaymentFailure?.('Failed to initiate Razorpay order');
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: keyId,
        amount: Math.round(amount * 100), // Amount in paise
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'Urban Royalty',
        description: `Order #${orderId}`,
        
        handler: async (response) => {
          // Step 3: Verify payment on backend
          try {
            const verifyRes = await api.post(
              `/orders/payment/verify`,
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId,
              }
            );

            if (verifyRes.data.success) {
              toast.success('Payment successful! Order confirmed.');
              onPaymentSuccess?.({
                paymentId: response.razorpay_payment_id,
                orderId,
              });
            } else {
              toast.error('Payment verification failed');
              onPaymentFailure?.('Payment verification failed');
            }
          } catch (verifyError) {
            console.error('Payment verification error:', verifyError);
            toast.error('Payment verification failed. Please contact support.');
            onPaymentFailure?.(verifyError?.response?.data?.error || 'Verification failed');
          } finally {
            setPaymentProcessing(false);
          }
        },

        modal: {
          ondismiss: async () => {
            // User closed the payment modal without completing
            setPaymentProcessing(false);
            toast.info('Payment cancelled. You can retry anytime.');
            
            // Optionally record payment failure
            try {
              await api.post(
                `/orders/payment/failure`,
                {
                  orderId,
                  reason: 'User cancelled payment',
                }
              );
            } catch (err) {
              console.warn('Failed to record payment cancellation:', err);
            }

            onPaymentFailure?.('Payment cancelled by user');
          },
        },

        prefill: {
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || '',
        },

        theme: {
          color: '#000000', // Match your brand color
        },
      };

      const razorpayCheckout = new window.Razorpay(options);
      
      razorpayCheckout.on('payment.failed', async (response) => {
        console.error('Razorpay payment failed:', response.error);
        setPaymentProcessing(false);
        
        // Record payment failure
        try {
          await api.post(
            `/orders/payment/failure`,
            {
              orderId,
              reason: response.error?.description || 'Payment failed',
            }
          );
        } catch (err) {
          console.warn('Failed to record payment failure:', err);
        }

        toast.error(response.error?.description || 'Payment failed');
        onPaymentFailure?.(response.error?.description || 'Payment failed');
      });

      razorpayCheckout.open();
    } catch (error) {
      console.error('Payment initiation error::', error);
      setPaymentProcessing(false);
      toast.error(error?.response?.data?.error || 'Failed to initiate payment');
      onPaymentFailure?.(error?.response?.data?.error || 'Payment initiation failed');
    }
  };

  return (
    <button
      onClick={handleRazorpayPayment}
      disabled={paymentProcessing || loading || !razorpayLoaded}
      className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
        paymentProcessing || loading || !razorpayLoaded
          ? 'bg-gray-400 cursor-not-allowed text-gray-600'
          : 'bg-black text-white hover:bg-zinc-800 active:scale-95'
      }`}
    >
      {paymentProcessing ? 'Processing Payment...' : 'Pay with Razorpay'}
    </button>
  );
};

export default RazorpayPayment;
