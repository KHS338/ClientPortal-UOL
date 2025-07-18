# Stripe Payment Integration - Demo Setup

This document explains how to set up and use the Stripe payment integration in the ClientPortal application.

## 🚀 Quick Start (Demo Mode)

The application is currently configured for **demo mode** and will work out of the box with test data. For production use, follow the setup instructions below.

## 📋 Features Implemented

- ✅ Stripe Payment Gateway Integration
- ✅ Subscription Plan Selection
- ✅ Secure Payment Processing
- ✅ Payment Success/Failure Handling
- ✅ Webhook Support for Real-time Updates
- ✅ Demo Mode for Testing
- ✅ Trial and Free Plan Support

## 🔧 Setup Instructions

### 1. Get Stripe API Keys

1. Sign up at [stripe.com](https://stripe.com)
2. Go to Developers → API Keys
3. Copy your **Publishable Key** and **Secret Key** (use test keys for development)

### 2. Configure Environment Variables

Update `.env.local` with your actual Stripe keys:

```env
# Replace with your actual Stripe test keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_DOMAIN=http://localhost:3000
```

### 3. Test Credit Cards

Use these test card numbers in demo/test mode:

- **Visa**: 4242 4242 4242 4242
- **Visa (debit)**: 4000 0566 5566 5556
- **Mastercard**: 5555 5555 5555 4444
- **American Express**: 3782 822463 10005
- **Declined**: 4000 0000 0000 0002

**Expiry**: Any future date (e.g., 12/25)
**CVV**: Any 3-digit number (e.g., 123)

## 🎯 How It Works

### Payment Flow

1. **Plan Selection**: User selects a subscription plan
2. **Payment Modal**: Stripe payment form appears for paid plans
3. **Payment Processing**: Secure payment via Stripe API
4. **Confirmation**: User receives confirmation and is redirected to dashboard
5. **Webhook**: Real-time payment status updates

### Plan Types

- **Trial Plans**: No payment required, direct activation
- **Free Plans**: No payment required, direct activation  
- **Paid Plans**: Stripe payment gateway required

### Demo Mode Features

- Pre-filled test card details
- Simulated payment processing
- Always successful payments (for demo)
- No real charges processed

## 🔄 API Endpoints

### `/api/stripe/payment` (POST)

Processes subscription payments.

**Request:**
```json
{
  "planDetails": {
    "title": "CV Sourcing",
    "billingCycle": "monthly",
    "price": "$29/mo"
  },
  "customerInfo": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Response:**
```json
{
  "success": true,
  "paymentIntent": {
    "id": "pi_1234567890",
    "status": "succeeded",
    "amount": 2900,
    "currency": "usd"
  }
}
```

### `/api/stripe/webhook` (POST)

Handles Stripe webhook events for real-time updates.

**Supported Events:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 🛡️ Security Features

- **Webhook Signature Verification**: Ensures webhooks are from Stripe
- **Environment Variables**: API keys stored securely
- **Client-side Validation**: Form validation before submission
- **Error Handling**: Graceful error handling and user feedback

## 🧪 Testing

### Test Scenarios

1. **Trial Subscription**: Select "Trial" plan - should activate immediately
2. **Free Plan**: Select free plan - should activate without payment
3. **Paid Plan**: Select paid plan - should show Stripe payment modal
4. **Successful Payment**: Use test card 4242... - should succeed
5. **Failed Payment**: Use test card 4000...0002 - should fail gracefully

### Demo Mode Testing

- Payment form is pre-filled with test data
- All payments succeed automatically
- No real charges are processed
- Full payment flow is simulated

## 🚧 Production Deployment

1. **Replace Demo Keys**: Use live Stripe keys in production
2. **Configure Webhooks**: Set up webhook endpoint in Stripe dashboard
3. **SSL Certificate**: Ensure HTTPS for production
4. **Error Monitoring**: Implement proper error logging
5. **Database Integration**: Store subscription data in database

## 📱 Mobile Responsiveness

- Payment modal is fully responsive
- Touch-friendly input fields
- Optimized for mobile payments
- Progressive enhancement

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid API Key"**: Check environment variables
2. **Payment Fails**: Verify test card numbers
3. **Webhook Errors**: Check webhook URL and secret
4. **CORS Issues**: Ensure proper domain configuration

### Debug Mode

Enable debug logging by adding to your environment:
```env
STRIPE_DEBUG=true
```

## 📚 Documentation

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Test Cards](https://stripe.com/docs/testing#cards)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)

## 🎉 Demo Features

The current implementation includes:

- 🎯 **Seamless Integration**: Works with existing subscription flow
- 💳 **Test Card Support**: Pre-configured test cards
- 🔄 **Real-time Updates**: Webhook integration
- 📱 **Mobile Friendly**: Responsive design
- 🛡️ **Secure Processing**: Industry-standard security
- 🎨 **Beautiful UI**: Custom-designed payment modal
- ⚡ **Fast Processing**: Optimized performance
- 🔧 **Easy Configuration**: Environment-based setup

## 💡 Next Steps

1. Set up your Stripe account
2. Replace demo keys with real test keys
3. Test with various scenarios
4. Configure webhooks for production
5. Implement database persistence
6. Add email notifications
7. Set up monitoring and analytics

---

**Note**: This is a demo implementation. For production use, ensure proper security measures, error handling, and compliance with payment regulations.
