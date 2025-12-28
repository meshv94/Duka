# Stripe Payment Integration - Setup Guide

## Overview
Stripe payment gateway successfully integrated kiya gaya hai. Ab users apne orders ko Stripe ke through pay kar sakte hain.

## Features
- Secure Stripe checkout session
- Real-time payment verification via webhooks
- Payment success/failure handling
- Automatic order placement after successful payment
- Cart clearing after payment success

## Setup Instructions

### 1. Stripe Account Setup
1. [Stripe Dashboard](https://dashboard.stripe.com/) pe jaayein
2. Naya account create karein ya existing account se login karein
3. Dashboard se API keys collect karein:
   - **Publishable Key** (pk_test_...)
   - **Secret Key** (sk_test_...)

### 2. Backend Configuration

#### Update .env file
Backend ke `.env` file mein ye values add karein:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Frontend URL (for redirects)
FRONTEND_URL=http://localhost:3000
```

#### Stripe Webhook Setup
1. [Stripe Webhooks](https://dashboard.stripe.com/test/webhooks) pe jaayein
2. "Add endpoint" click karein
3. Endpoint URL: `http://localhost:5000/app/stripe-webhook`
   - **Production**: `https://your-domain.com/app/stripe-webhook`
4. Events to send:
   - `checkout.session.completed`
5. Webhook secret copy karein aur `.env` mein `STRIPE_WEBHOOK_SECRET` ke against paste karein

**Note**: Local development ke liye [Stripe CLI](https://stripe.com/docs/stripe-cli) use kar sakte hain:
```bash
stripe listen --forward-to localhost:5000/app/stripe-webhook
```

### 3. Installation

#### Backend
```bash
cd backend
npm install stripe
```

Package already installed hai, but make sure.

### 4. Testing

#### Test Card Details
Stripe test mode mein ye card details use kar sakte hain:

**Successful Payment:**
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## Flow Diagram

```
User clicks "Pay Now" button
         ↓
Frontend calls /app/create-stripe-checkout
         ↓
Backend creates Stripe checkout session
         ↓
User redirected to Stripe payment page
         ↓
User enters card details
         ↓
Payment processed by Stripe
         ↓
         ├─→ Success: Redirect to /payment-success
         │            ↓
         │      Stripe webhook triggered
         │            ↓
         │      Order status updated to "Placed"
         │            ↓
         │      Cart cleared from localStorage
         │
         └─→ Failure: Redirect to /cart
```

## API Endpoints

### 1. Create Stripe Checkout Session
**POST** `/app/create-stripe-checkout`

**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

**Body:**
```json
{
  "selectedAddressId": "address_id",
  "cartIds": ["cart_id_1", "cart_id_2"],
  "deliveryDate": "2024-01-15",
  "deliveryType": "today"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### 2. Stripe Webhook
**POST** `/app/stripe-webhook`

**Headers:**
```json
{
  "stripe-signature": "..."
}
```

Ye endpoint Stripe ke dwara automatically call hota hai when payment completes.

## Files Modified

### Backend:
1. `backend/controllers/app/cartCheckoutController.js` - Added `createStripeCheckout` and `handleStripeWebhook` functions
2. `backend/routes/app/cartCheckoutRoute.js` - Added new routes
3. `backend/models/cartModal.js` - Added payment fields (payment_status, stripe_session_id, stripe_payment_intent)
4. `backend/.env` - Added Stripe configuration

### Frontend:
1. `frontend/src/pages/CartPage.jsx` - Updated `handlePay` function to call Stripe checkout
2. `frontend/src/pages/PaymentSuccessPage.jsx` - New page for payment success/failure
3. `frontend/src/App.jsx` - Added route for `/payment-success`

## Troubleshooting

### Issue: Webhook not working
**Solution:**
- Check if webhook secret is correct in `.env`
- For local testing, use Stripe CLI: `stripe listen --forward-to localhost:5000/app/stripe-webhook`
- Make sure endpoint is accessible publicly (use ngrok for local testing)

### Issue: Payment successful but order not placed
**Solution:**
- Check webhook logs in Stripe Dashboard
- Verify webhook secret is correct
- Check backend logs for errors in `handleStripeWebhook` function

### Issue: Redirect URL not working
**Solution:**
- Check `FRONTEND_URL` in backend `.env` is correct
- Make sure frontend is running on the specified URL

## Production Deployment

### Checklist:
1. Replace test API keys with live keys
2. Update `FRONTEND_URL` to production domain
3. Setup webhook endpoint with production URL
4. Enable HTTPS for security
5. Test end-to-end flow with real payment

## Security Notes
- Never expose `STRIPE_SECRET_KEY` publicly
- Always validate webhook signatures
- Use HTTPS in production
- Keep Stripe library updated

## Support
For Stripe-related issues, refer to [Stripe Documentation](https://stripe.com/docs)
