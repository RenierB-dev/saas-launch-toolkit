# 🧪 Testing Guide - Payment Flow

**Last Updated**: 2025-11-27
**Status**: Ready for testing

---

## ✅ What's Been Implemented

The complete payment flow is now functional:

1. ✅ **Two-step signup**: Plan selection → Account creation
2. ✅ **Supabase integration**: User account creation with profile
3. ✅ **Paddle integration**: Checkout opens with user ID
4. ✅ **Webhook handler**: Processes payments and creates subscriptions
5. ✅ **Success page**: Confetti celebration and dashboard access

---

## 🎯 Pre-Testing Checklist

### 1. Database Setup

**Option A: Fresh Database (Recommended)**

```sql
-- In Supabase SQL Editor, run:
-- File: supabase/migrations/000_consolidated_schema.sql
```

**Option B: Fix Existing Database**

```sql
-- In Supabase SQL Editor, run:
-- File: supabase/migrations/007_fix_existing_schema.sql
```

See `supabase/migrations/README.md` for details.

### 2. Environment Variables

Create `.env.local` with these values (use `.env.example` as template):

```bash
# Supabase (from your Supabase dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Paddle Sandbox (for testing)
PADDLE_API_KEY=pdl_test_apikey_YOUR_SANDBOX_KEY
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=test_YOUR_SANDBOX_TOKEN
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox

# Price IDs (from Paddle Dashboard → Catalog)
NEXT_PUBLIC_PADDLE_PRICE_ID_ONETIME=pri_sandbox_onetime_id
NEXT_PUBLIC_PADDLE_PRICE_ID_MONTHLY=pri_sandbox_monthly_id

# Webhook Secret (from Paddle Dashboard → Developer Tools → Notifications)
PADDLE_WEBHOOK_SECRET=pdl_ntfset_YOUR_WEBHOOK_SECRET

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Paddle Sandbox Setup

1. **Create Paddle Account**: https://sandbox-vendors.paddle.com/signup
2. **Get API Keys**: Paddle Dashboard → Developer Tools → Authentication
3. **Create Products**:
   - Navigate to: Catalog → Products
   - Create "Launch Toolkit" ($49 one-time)
   - Create "Pro Monthly" ($19/month recurring)
   - Copy the Price IDs to `.env.local`

---

## 🚀 Testing Steps

### Step 1: Start Development Server

```bash
npm run dev
```

The app should start on `http://localhost:3000`

**Verify**: No errors in console, page loads correctly

---

### Step 2: Test Plan Selection

1. Navigate to: `http://localhost:3000/signup`
2. You should see two pricing cards:
   - **Launch Toolkit**: $49 one-time
   - **Pro Monthly**: $19/month
3. Click **"Select Plan"** on either card
4. You should see the account creation form (Step 2)

**Expected**:
- ✅ Two pricing cards displayed
- ✅ "Best Value" badge on one-time plan
- ✅ Step indicator shows "1" highlighted
- ✅ Clicking "Select Plan" advances to Step 2
- ✅ Step indicator shows checkmark on Step 1

---

### Step 3: Test Account Creation

1. Fill in the form:
   - **Full Name**: Test User
   - **Email**: test@example.com (use a real email you control)
   - **Password**: testpassword123
2. Click **"Continue to Payment"**

**Expected**:
- ✅ Button shows loading spinner and "Creating account..."
- ✅ Toast notification: "Account created! Opening payment..."
- ✅ Paddle checkout overlay opens
- ✅ Email is pre-filled in Paddle checkout

**If it fails**:
- Check browser console for errors
- Verify Supabase keys in `.env.local`
- Check Paddle client token is correct

---

### Step 4: Test Paddle Checkout (Without Webhook)

1. In Paddle checkout, use test card: `4242 4242 4242 4242`
2. Expiry: Any future date (e.g., 12/25)
3. CVC: Any 3 digits (e.g., 123)
4. Complete payment

**Expected**:
- ✅ Payment processes successfully
- ✅ Redirects to `/signup/success`
- ✅ Confetti animation plays
- ✅ Success message: "Welcome Aboard! 🎉"
- ✅ Checklist items animate in

**At this point**: User account exists, but subscription won't be in database yet (webhook not configured).

---

### Step 5: Configure Webhook (For Full Flow)

To test the complete flow with subscription creation, you need to expose your local server to Paddle.

#### Option A: Using ngrok (Recommended for Testing)

1. **Download ngrok**: https://ngrok.com/download
2. **Start ngrok**:
   ```bash
   ngrok http 3000
   ```
3. **Copy the HTTPS URL**: e.g., `https://abc123.ngrok.io`
4. **Configure Paddle Webhook**:
   - Go to: Paddle Dashboard → Developer Tools → Notifications
   - Click "Add Notification Destination"
   - URL: `https://abc123.ngrok.io/api/webhooks/paddle`
   - Select all events:
     - transaction.completed
     - transaction.updated
     - subscription.created
     - subscription.updated
     - subscription.canceled
   - Save

#### Option B: Deploy to Vercel First

1. Deploy to Vercel (get permanent URL)
2. Use that URL for webhook configuration

---

### Step 6: Test Complete Flow with Webhook

1. **Start fresh** (clear Supabase users if testing again)
2. Go through signup flow (Steps 1-4)
3. **Watch webhook logs**:
   - In terminal where `npm run dev` is running
   - You should see: "Received verified Paddle webhook: transaction.completed"
4. **Check database**:
   - Go to Supabase Dashboard → Table Editor → subscriptions
   - You should see a new subscription record with:
     - `user_id`: Your user's ID
     - `paddle_customer_id`: Set
     - `status`: "active"
     - `plan_type`: "one_time" or "monthly"

**Expected**:
- ✅ Webhook receives payment notification
- ✅ Subscription created in database
- ✅ User can access dashboard
- ✅ Dashboard shows subscription status

---

## 🔍 Verification Checklist

After completing a test payment, verify:

### Database Checks

```sql
-- 1. Check user profile was created with email
SELECT id, email, full_name, created_at
FROM profiles
WHERE email = 'test@example.com';

-- 2. Check subscription was created
SELECT user_id, paddle_customer_id, status, plan_type, price_amount
FROM subscriptions
WHERE user_id = 'YOUR_USER_ID_FROM_STEP_1';

-- 3. Verify only ONE subscription per user
SELECT user_id, COUNT(*) as subscription_count
FROM subscriptions
GROUP BY user_id
HAVING COUNT(*) > 1;
-- Should return 0 rows (no duplicates)
```

### App Checks

1. **Login**: Can you log in with the test account?
   - Go to `/login`
   - Enter email and password
   - Should redirect to `/dashboard`

2. **Dashboard**: Does it show subscription status?
   - Navigate to `/dashboard`
   - Check subscription status card

3. **Settings**: Can you see subscription details?
   - Navigate to `/dashboard/settings`
   - Check subscription information displays

4. **Tools**: Can you access all tools?
   - Try Pricing Calculator
   - Try Launch Sequence
   - All should be accessible

---

## 🐛 Troubleshooting

### Issue: "Account created!" but Paddle doesn't open

**Cause**: Paddle client token invalid or environment wrong

**Fix**:
1. Check `.env.local` has `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
2. Verify `NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox`
3. Restart dev server after changing `.env.local`
4. Check browser console for Paddle errors

---

### Issue: Payment succeeds but no subscription in database

**Cause**: Webhook not configured or not receiving events

**Fix**:
1. Check webhook is configured in Paddle
2. Verify ngrok is running (if using ngrok)
3. Check webhook URL matches: `https://your-url/api/webhooks/paddle`
4. Look for webhook errors in terminal
5. Verify `PADDLE_WEBHOOK_SECRET` matches Paddle dashboard

---

### Issue: "Failed to create account" error

**Cause**: Supabase credentials invalid or user already exists

**Fix**:
1. Check Supabase URL and keys in `.env.local`
2. Try a different email address
3. Check Supabase logs in dashboard
4. Verify auth is enabled in Supabase

---

### Issue: profiles.email is NULL in database

**Cause**: Database migration not run or trigger not working

**Fix**:
1. Run migration `007_fix_existing_schema.sql`
2. Verify trigger exists:
   ```sql
   SELECT trigger_name, event_manipulation, action_statement
   FROM information_schema.triggers
   WHERE trigger_name = 'on_auth_user_created';
   ```
3. Test trigger manually:
   ```sql
   -- Check if profile was created
   SELECT * FROM profiles WHERE email IS NULL;

   -- Backfill missing emails
   UPDATE profiles p
   SET email = u.email
   FROM auth.users u
   WHERE p.id = u.id AND p.email IS NULL;
   ```

---

### Issue: Webhook signature verification fails

**Cause**: Webhook secret doesn't match

**Fix**:
1. Get webhook secret from Paddle Dashboard → Developer Tools → Notifications
2. Copy to `.env.local` as `PADDLE_WEBHOOK_SECRET`
3. Restart dev server
4. Trigger new webhook (make new test payment)

---

### Issue: Duplicate subscriptions for one user

**Cause**: Missing UNIQUE constraint on subscriptions.user_id

**Fix**:
1. Run migration `007_fix_existing_schema.sql`
2. Verify constraint:
   ```sql
   SELECT constraint_name
   FROM information_schema.table_constraints
   WHERE table_name = 'subscriptions'
     AND constraint_type = 'UNIQUE'
     AND constraint_name = 'subscriptions_user_id_key';
   ```
3. Should return 1 row. If not, run:
   ```sql
   -- Remove duplicates
   DELETE FROM subscriptions
   WHERE id NOT IN (
     SELECT DISTINCT ON (user_id) id
     FROM subscriptions
     ORDER BY user_id, updated_at DESC
   );

   -- Add constraint
   ALTER TABLE subscriptions
   ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
   ```

---

## 📊 Test Results Template

Use this checklist to track your testing:

```
Test Date: _______________
Tester: _______________

[ ] Database migration ran successfully (000 or 007)
[ ] Environment variables configured
[ ] Dev server starts without errors
[ ] Plan selection page loads
[ ] Can select a plan and advance to Step 2
[ ] Account creation form validation works
[ ] Supabase signup succeeds
[ ] Paddle checkout opens with pre-filled email
[ ] Payment completes successfully
[ ] Redirects to success page
[ ] Confetti plays
[ ] Webhook receives notification (if configured)
[ ] Subscription created in database
[ ] Can log in with test account
[ ] Dashboard shows subscription status
[ ] All tools are accessible

Issues Found:
_______________________________________________
_______________________________________________

Notes:
_______________________________________________
_______________________________________________
```

---

## 🎉 Success Criteria

Your payment flow is working correctly if:

✅ User can select a plan
✅ User can create account
✅ Paddle checkout opens
✅ Payment completes
✅ Success page shows with confetti
✅ Subscription appears in database (when webhook configured)
✅ User can log in and access tools

---

## 🚀 Ready for Production?

Before deploying to production:

1. [ ] Test complete flow in sandbox
2. [ ] Fix all database schema issues
3. [ ] Configure webhook with permanent URL
4. [ ] Test webhook delivery
5. [ ] Verify RLS policies work
6. [ ] Switch to LIVE Paddle keys
7. [ ] Test one real payment (smallest amount)
8. [ ] Monitor webhook logs
9. [ ] Verify subscription in production database

See `PRODUCTION_DEPLOYMENT_CHECKLIST.md` for full deployment guide.

---

**Questions? Issues? Check `HONEST_STATUS_REPORT.md` for current project status.**
