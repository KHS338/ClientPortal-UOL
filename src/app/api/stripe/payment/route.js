import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key (Updated)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key', {
  apiVersion: '2023-10-16',
});

export async function POST(request) {
  try {
    const { planDetails, customerInfo, cardDetails } = await request.json();

    // Extract price amount (remove $ and convert to cents)
    const priceString = planDetails.price.replace(/[$,]/g, '');
    const amount = Math.round(parseFloat(priceString) * 100); // Convert to cents

    // Map card numbers to Stripe test payment method tokens
    const getTestPaymentMethod = (cardNumber) => {
      const cleanCard = cardNumber?.replace(/\s/g, '');
      
      switch (cleanCard) {
        case '4242424242424242': // Valid Visa
          return 'pm_card_visa';
        case '4000000000000002': // Declined card
          return 'pm_card_chargeDeclined';
        case '4000000000009995': // Insufficient funds
          return 'pm_card_chargeDeclinedInsufficientFunds';
        case '4000000000009987': // Lost card
          return 'pm_card_chargeDeclinedLostCard';
        case '5555555555554444': // Valid Mastercard
          return 'pm_card_mastercard';
        case '4000056655665556': // Valid Visa Debit
          return 'pm_card_visa_debit';
        default:
          // For unknown cards, assume it's invalid and use decline
          return 'pm_card_chargeDeclined';
      }
    };

    const paymentMethodId = getTestPaymentMethod(cardDetails?.cardNumber);

    // Create a PaymentIntent with the test payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      description: `Subscription to ${planDetails.title} (${planDetails.billingCycle})`,
      metadata: {
        plan: planDetails.title,
        billing_cycle: planDetails.billingCycle,
        customer_email: customerInfo?.email || 'demo@example.com'
      },
      payment_method: paymentMethodId,
      confirm: true,
      return_url: `${process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:3000'}/dashboard`
    });

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    });

  } catch (error) {
    console.error('Stripe payment error:', error);
    
    // Check if it's a card decline vs other error
    if (error.type === 'StripeCardError' || error.decline_code) {
      // This is a proper card decline
      return NextResponse.json({
        success: false,
        error: 'Your card was declined.',
        type: 'card_declined',
        decline_code: error.decline_code || 'generic_decline',
        message: error.message
      }, { status: 400 });
    } else {
      // This is another type of error (API, network, etc.)
      return NextResponse.json({
        success: false,
        error: error.message || 'Payment processing failed',
        type: error.type || 'api_error',
        code: error.code || 'payment_failed'
      }, { status: 400 });
    }
  }
}
