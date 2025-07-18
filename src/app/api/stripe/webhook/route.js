import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_demo_key', {
  apiVersion: '2023-10-16',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event;

  try {
    // Verify webhook signature (only in production with real webhook secret)
    if (endpointSecret && endpointSecret !== 'whsec_1234567890abcdef1234567890abcdef') {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } else {
      // For demo purposes, create a mock event
      event = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_demo_webhook',
            status: 'succeeded',
            amount: 2999,
            currency: 'usd'
          }
        }
      };
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Here you would typically:
      // 1. Update your database
      // 2. Send confirmation email
      // 3. Activate the subscription
      // 4. Log the transaction
      
      break;
    
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Handle failed payment
      // 1. Notify user
      // 2. Log the failure
      // 3. Retry logic if needed
      
      break;
    
    case 'customer.subscription.created':
      const subscription = event.data.object;
      console.log('Subscription created:', subscription.id);
      
      // Handle new subscription
      // 1. Update user's subscription status
      // 2. Send welcome email
      // 3. Grant access to features
      
      break;
    
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      console.log('Subscription updated:', updatedSubscription.id);
      
      // Handle subscription changes
      // 1. Update access levels
      // 2. Notify user of changes
      
      break;
    
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      console.log('Subscription cancelled:', deletedSubscription.id);
      
      // Handle subscription cancellation
      // 1. Remove access
      // 2. Send cancellation confirmation
      
      break;
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
