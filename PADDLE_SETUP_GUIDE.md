# Paddle Integration Setup Guide

This guide will help you set up and test the Paddle payment integration for the SaaS Launch Toolkit.

## ✅ What's Already Implemented

1. **Paddle Client SDK** - `lib/paddle/paddle.ts`
2. **Two-Step Signup Flow** - Plan selection + account creation
3. **Webhook Handler** - `app/api/webhooks/paddle/route.ts`
4. **Subscription Management** - Dashboard displays subscription status
5. **Database Schema** - Updated subscriptions table for Paddle

---

## 📋 Setup Steps

### 1. Run Database Migrations

You need to run the latest migration to update the subscriptions table:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run this migration:

```sql
-- File: supabase/migrations/004_update_subscriptions_for_paddle.sql
```

Or copy and paste from: `D:\projects\saas-launch-toolkit\supabase\migrations\004_update_subscriptions_for_paddle.sql`

### 2. Configure Paddle Webhook in Paddle Dashboard

1. Log into your Paddle account (sandbox or production)
2. Go to **Developer Tools** → **Notifications**
3. Click **Add Notification Destination**
4. Set up webhook:
   - **URL**: `http://localhost:3000/api/webhooks/paddle` (for local testing)
   - **URL** (Production): `https://yourdomain.com/api/webhooks/paddle`
   - **Events to Subscribe**:
     - ✅ `transaction.completed`
     - ✅ `transaction.updated`
     - ✅ `subscription.created`
     - ✅ `subscription.updated`
     - ✅ `subscription.canceled`
     - ✅ `subscription.paused`
     - ✅ `subscription.resumed`
5. Save the webhook

**Note**: For local testing, you'll need to use a tool like [ngrok](https://ngrok.com/) to expose your localhost to the internet:

```bash
ngrok http 3000
```

Then use the ngrok URL for your webhook: `https://your-ngrok-url.ngrok.io/api/webhooks/paddle`

### 3. Verify Environment Variables

Make sure your `.env.local` has these Paddle variables set:

```env
# Paddle Configuration
PADDLE_API_KEY=pdl_live_apikey_your_api_key_here
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_your_client_token_here
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PADDLE_PRICE_ID_ONETIME=pri_your_onetime_price_id
NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY=pri_your_monthly_price_id

# Supabase (needed for webhook)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

---

## 🧪 Testing the Flow

### Test Case 1: One-Time Purchase ($49)

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Navigate to signup**:
   - Go to `http://localhost:3000/signup`

3. **Select One-Time Plan** ($49)
   - Click "Select Plan" on the One-Time card

4. **Fill in account details**:
   - Full Name: Test User
   - Email: test@example.com
   - Password: test123456

5. **Click "Continue to Payment"**
   - Paddle checkout should open in a modal
   - Account is created in Supabase

6. **Complete test payment** (in Paddle Sandbox):
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any CVV

7. **Verify webhook received**:
   - Check server console for: "Received Paddle webhook: transaction.completed"
   - Check Supabase `subscriptions` table - should have new row with:
     - `status`: "active"
     - `plan_type`: "one_time"
     - `price_amount`: 4900 (in cents)

8. **Check dashboard**:
   - Navigate to `/dashboard`
   - Should see subscription card showing:
     - "Your Subscription"
     - "One-Time Purchase"
     - "$49.00"
     - Status: "Active"

### Test Case 2: Monthly Subscription ($19/month)

1. **Repeat steps 1-4** from Test Case 1

2. **Select Pro Monthly Plan** ($19/month)
   - Click "Select Plan" on the Pro Monthly card

3. **Complete payment**
   - Paddle checkout opens
   - Use test card: `4242 4242 4242 4242`

4. **Verify webhook**:
   - Should receive TWO events:
     - `transaction.completed` (initial payment)
     - `subscription.created` (subscription setup)

5. **Check Supabase**:
   - `subscriptions` table should have:
     - `status`: "active"
     - `plan_type`: "monthly"
     - `paddle_subscription_id`: present
     - `current_period_end`: future date
     - `price_amount`: 1900 (in cents)

6. **Check dashboard**:
   - Should show:
     - "Pro Monthly"
     - "$19.00"
     - "Next billing: [date]"
     - "Manage Subscription" button

---

## 🔍 Troubleshooting

### Webhook Not Received

**Problem**: Payment completes but no data in subscriptions table

**Solutions**:
1. Check ngrok is running (for local testing)
2. Verify webhook URL in Paddle dashboard is correct
3. Check server console for errors
4. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
5. Check Paddle dashboard → Developer Tools → Notifications → Event Logs

### Paddle Checkout Not Opening

**Problem**: Clicking "Continue to Payment" does nothing

**Solutions**:
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` is set
3. Verify `NEXT_PUBLIC_PADDLE_PRICE_ID_*` are correct
4. Check network tab - should see Paddle API calls

### User Created But No Subscription

**Problem**: Account exists in Supabase auth but no subscription record

**Solutions**:
1. User might have closed checkout before paying
2. Check if webhook was received (server console)
3. Manually check Paddle dashboard for transaction
4. The user can still access dashboard but will see "No Active Subscription" card

### Price Not Displaying Correctly

**Problem**: Dashboard shows wrong amount

**Solutions**:
1. Paddle stores amounts in cents (4900 = $49.00)
2. Check `formatPrice()` function in `lib/paddle/subscription-helpers.ts`
3. Verify `price_amount` in database is in cents

---

## 🎯 Next Steps After Testing

Once you've verified everything works:

1. **Switch to Production**:
   ```env
   NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
   PADDLE_API_KEY=pdl_live_apikey_production_key
   NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_production_token
   ```

2. **Update webhook URL** in Paddle dashboard to your production URL

3. **Create real price IDs** in Paddle production for $49 and $19/month

4. **Update price IDs** in `.env.local`:
   ```env
   NEXT_PUBLIC_PADDLE_PRICE_ID_ONETIME=pri_production_onetime_id
   NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY=pri_production_monthly_id
   ```

5. **Deploy to production** (Vercel, Netlify, etc.)

6. **Test with real card** (small amount first)

---

## 📝 Important Notes

### Security
- ✅ Webhook uses service role key (bypasses RLS)
- ✅ Only authenticated users can view their own subscriptions (RLS policies)
- ⚠️ TODO: Add webhook signature verification for production (Paddle provides signature)

### Data Flow
```
User → Signup Page → Supabase Auth (create account)
                   → Paddle Checkout (payment)
                   → Paddle Webhook → API Route → Supabase (subscriptions table)
                   → Dashboard (displays subscription)
```

### Webhook Events We Handle
- `transaction.completed` - One-time purchase OR first payment of subscription
- `subscription.created` - New subscription started
- `subscription.updated` - Subscription details changed
- `subscription.canceled` - User canceled subscription
- `subscription.paused` - Subscription paused
- `subscription.resumed` - Subscription resumed after pause

### What Happens When User Cancels?
- Monthly users: Can cancel from dashboard (TODO: implement cancel UI)
- Webhook receives `subscription.canceled` event
- Subscription status changes to "canceled"
- User still has access until `current_period_end`
- One-time users: Lifetime access, no cancellation

---

## 🚀 Ready to Launch!

Your Paddle integration is now complete. You have:
- ✅ Two-step signup with plan selection
- ✅ Paddle checkout integration
- ✅ Webhook handling for all events
- ✅ Subscription status in dashboard
- ✅ Database schema updated for Paddle
- ✅ Sandbox testing ready

**Next**: Test thoroughly with sandbox, then switch to production!
