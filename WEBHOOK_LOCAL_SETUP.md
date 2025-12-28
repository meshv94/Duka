# Local Webhook Setup Guide

## Problem
Stripe webhooks localhost pe directly nahi aate kyunki Stripe ko publicly accessible URL chahiye.

## ✅ Solution: Payment Verification (IMPLEMENTED)

**Good News!** Maine already ek solution implement kar diya hai jo **bina Stripe CLI ke** kaam karta hai!

### How it works:

1. **Payment Success Page** Stripe se redirect hone ke baad automatically backend ko call karti hai
2. **Backend** Stripe session verify karta hai aur order place karta hai
3. **Duplicate Prevention** agar webhook bhi aa jaye, to duplicate order nahi banega

### Implementation Details:

**Backend Endpoint:**
```
POST /app/verify-stripe-payment
```

**Frontend:**
`PaymentSuccessPage.jsx` automatically verify karta hai jab user payment success pe redirect hota hai.

### Kaise test karein:

1. ✅ `.env` mein Stripe keys already set hain
2. ✅ Backend aur frontend dono running hone chahiye
3. ✅ Cart page se "Pay Now" click karein
4. ✅ Stripe checkout page pe test card use karein: `4242 4242 4242 4242`
5. ✅ Payment success hone pe automatically order place ho jayega!

### Benefits:

- ✅ **No Stripe CLI needed** for local development
- ✅ **Works immediately** - bina kuch setup ke
- ✅ **Production ready** - webhooks bhi kaam karenge
- ✅ **Duplicate safe** - ek order do baar nahi place hoga

---

## Optional: Stripe CLI (For Advanced Testing)

Agar aap production jaise testing karna chahte hain (only webhooks se), to Stripe CLI use kar sakte hain:

### Step 1: Stripe CLI Install
Download from: https://stripe.com/docs/stripe-cli

**Windows:**
1. Download: https://github.com/stripe/stripe-cli/releases/latest
2. Extract karo aur PATH mein add karo

### Step 2: Stripe CLI Login
```bash
stripe login
```
Browser mein auth karo.

### Step 3: Webhook Forward
```bash
stripe listen --forward-to localhost:5000/app/stripe-webhook
```

Ye command run karte hi aapko ek webhook secret milega:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### Step 4: Update .env
Backend `.env` mein ye secret update karo:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### Step 5: Test Payment
Ab payment karo - webhook automatically forward ho jayega!

---

## Summary

**Local Development:** Already working! Kuch karne ki zaroorat nahi.

**Production:** Webhooks automatically kaam karenge jab aap deploy karoge.
