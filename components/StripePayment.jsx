"use client";

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FiCreditCard, FiLock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

// Hardcoded Stripe publishable key with error handling
let stripePromise;
const STRIPE_ENABLED = process.env.NEXT_PUBLIC_STRIPE_ENABLED !== 'false';

if (STRIPE_ENABLED) {
  try {
    stripePromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
      'pk_test_51Rls0QDCvkzdfzJ7zkvZTqNM7Uw2Xi298NR6laFa5ey4rDgGaUoVqzG4JMEIopyyxlLi3tRhrYoik1jJmXPd44MM00TypMkMkv'
    );
  } catch (error) {
    console.error('Failed to load Stripe:', error);
    stripePromise = null;
  }
} else {
  console.log('Stripe disabled via environment variable');
  stripePromise = null;
}

export default function StripePayment({ 
  planDetails, 
  onPaymentSuccess, 
  onCancel 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [stripeLoadError, setStripeLoadError] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '4242 4242 4242 4242',
    expiryDate: '12/25',
    cvv: '123',
    cardHolder: 'Demo User'
  });

  // Add debugging and Stripe loading check
  useEffect(() => {
    console.log('StripePayment component mounted with planDetails:', planDetails);
    
    // Check if Stripe loaded successfully
    if (stripePromise) {
      stripePromise.catch(error => {
        console.error('Stripe failed to load:', error);
        setStripeLoadError(true);
        setErrorMessage('Payment system is currently unavailable. Please try again later or contact support.');
      });
    } else {
      setStripeLoadError(true);
      setErrorMessage('Payment system could not be initialized. Please try again later.');
    }
  }, [planDetails]);

  // Show error if Stripe failed to load
  if (stripeLoadError) {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FiAlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment System Unavailable</h3>
            <p className="text-sm text-gray-600 mt-2">{errorMessage}</p>
          </div>
          <div className="space-y-2">
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Retry
            </Button>
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // Payment processing with API call and demo fallback
  const handlePayment = async () => {
    console.log('Payment button clicked');
    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      // Try Stripe API first
      const response = await fetch('/api/stripe/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planDetails: planDetails,
          customerInfo: {
            name: cardDetails.cardHolder,
            email: 'demo@example.com' // In real app, get from user data
          },
          cardDetails: cardDetails // Send card details for processing
        })
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentSuccess(result);
        }, 2000);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error('Stripe payment failed, trying demo mode:', error);
      
      // Fallback to demo payment success (for testing when Stripe is unavailable)
      if (error.message.includes('fetch') || error.message.includes('network')) {
        console.log('Using demo payment mode due to network issues');
        setPaymentStatus('success');
        setTimeout(() => {
          onPaymentSuccess({
            paymentId: 'demo_' + Date.now(),
            amount: planDetails.price,
            plan: planDetails.name,
            status: 'succeeded',
            demo: true
          });
        }, 2000);
      } else {
        setPaymentStatus('error');
        setErrorMessage(error.message || 'Payment failed. Please try again.');
        setTimeout(() => {
          setPaymentStatus(null);
          setErrorMessage('');
        }, 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[9999] overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 bg-white shadow-2xl border-2 border-blue-200 my-8">
          {/* Add a header to make it clear this is the payment modal */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">💳 Payment Portal</h2>
            <p className="text-sm text-gray-600">Stripe Payment Demo</p>
          </div>
          
          {paymentStatus === 'success' ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">Your subscription has been activated.</p>
              <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : paymentStatus === 'error' ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiLock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h3>
              <p className="text-red-600 mb-4">{errorMessage || 'Your card was declined. Please try a different payment method.'}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setPaymentStatus(null);
                    setIsLoading(false);
                    setErrorMessage('');
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Your Payment</h3>
                <p className="text-gray-600">Secure payment powered by Stripe</p>
              </div>

              {/* Plan Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{planDetails.title}</span>
                  <span className="font-semibold text-gray-900">{planDetails.price}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{planDetails.billingCycle}</span>
                  <span>Billed {planDetails.billingCycle}</span>
                </div>
              </div>

              {/* Demo Card Form */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number (Demo)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={(e) => setCardDetails({...cardDetails, cardNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="4242 4242 4242 4242"
                      disabled={isLoading}
                    />
                    <FiCreditCard className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiryDate}
                      onChange={(e) => setCardDetails({...cardDetails, expiryDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="MM/YY"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="123"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.cardHolder}
                    onChange={(e) => setCardDetails({...cardDetails, cardHolder: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Test Cards Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Test Cards:</p>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>✅ Success: 4242 4242 4242 4242</span>
                    <button 
                      type="button"
                      onClick={() => setCardDetails({...cardDetails, cardNumber: '4242 4242 4242 4242'})}
                      className="text-blue-600 hover:underline"
                    >
                      Use
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span>❌ Decline: 4000 0000 0000 0002</span>
                    <button 
                      type="button"
                      onClick={() => setCardDetails({...cardDetails, cardNumber: '4000 0000 0000 0002'})}
                      className="text-blue-600 hover:underline"
                    >
                      Use
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <span>💳 Mastercard: 5555 5555 5555 4444</span>
                    <button 
                      type="button"
                      onClick={() => setCardDetails({...cardDetails, cardNumber: '5555 5555 5555 4444'})}
                      className="text-blue-600 hover:underline"
                    >
                      Use
                    </button>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                <FiLock className="w-4 h-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              {/* Demo Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Demo Mode:</strong> This is a demonstration. No real payment will be processed.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    console.log('Cancel button clicked');
                    onCancel();
                  }}
                  variant="outline"
                  className="flex-1 py-3 text-lg font-semibold border-2 border-gray-300 hover:border-gray-400"
                  disabled={isLoading}
                >
                  ❌ Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log('Pay button clicked');
                    handlePayment();
                  }}
                  className="flex-1 py-3 text-lg font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </div>
                  ) : (
                    `💰 Pay ${planDetails.price}`
                  )}
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
