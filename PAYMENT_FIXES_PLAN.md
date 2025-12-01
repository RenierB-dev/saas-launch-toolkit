# 🔧 Payment Flow - Comprehensive Fixes Plan

**Created:** 2025-11-29
**Status:** In Progress (1/12 complete)
**Approach:** Sequential Fix & Test (Low Risk)
**Estimated Total Time:** 5-6 hours

---

## 📊 Progress Overview

```
Sprint 1: Unblock & Stabilize     [█░░░] 1/2 complete
Sprint 2: Core Payment Flow       [░░░░] 0/2 complete
Sprint 3: Security Hardening      [░░░░] 0/3 complete
Sprint 4: Polish (Optional)       [░░░░] 0/3 complete
Sprint 5: Ship It                 [░░░░] 0/2 complete
```

**Overall Progress:** 1/12 tasks (8%)

---

## 🎯 Sprint 1: Unblock & Stabilize (~1 hour)

**Goal:** Fix build issues and environment variable handling

### ✅ Task 1: Install Missing Dependencies (COMPLETED)
- **Status:** ✅ Done
- **Time Taken:** 5 minutes
- **Changes:**
  - Installed `@radix-ui/react-alert-dialog`
  - Installed `@types/canvas-confetti`
  - Removed unused `lib/stripe` directory
- **Result:** Build now succeeds with no errors
- **Test:** ✅ `npm run build` passes

---

### ⏳ Task 2: Fix Paddle Environment Variables

**Priority:** 🔴 Critical
**Estimated Time:** 15 minutes
**File:** [lib/paddle/paddle.ts](lib/paddle/paddle.ts)

**Problem:**
```typescript
// Current code - BROKEN in production
const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
const environment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT
```
This dynamic access pattern fails in Next.js production builds.

**Solution Options:**

#### Option A: Direct Inline Access (RECOMMENDED) ✅
```typescript
export async function getPaddle(): Promise<Paddle | null> {
  if (paddleInstance) return paddleInstance

  // ✅ Direct access - Next.js inlines these at build time
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  const environment = (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production'

  if (!clientToken) {
    console.error("Paddle client token not found")
    return null
  }

  try {
    paddleInstance = await initializePaddle({
      token: clientToken,
      environment: environment,
    }) || null
    return paddleInstance
  } catch (error) {
    console.error("Failed to initialize Paddle:", error)
    return null
  }
}
```

**Why this is recommended:**
- Simplest fix
- Next.js handles env var inlining correctly
- No architecture changes needed
- Works in all environments

#### Option B: Configuration File
Create `lib/paddle/config.ts`:
```typescript
export const paddleConfig = {
  clientToken: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
  environment: (process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || 'sandbox') as 'sandbox' | 'production',
}
```

**Pros:** Centralized config
**Cons:** Extra file, more complexity

#### Option C: Component-Level Props
Pass env vars from server components down to client.

**Pros:** Most "correct" architecturally
**Cons:** Requires refactoring multiple components

**Testing After Fix:**
1. Build project: `npm run build`
2. Start production server: `npm start`
3. Navigate to `/signup`
4. Open browser console - should see Paddle initializing
5. Check no "Paddle client token not found" errors

---

## 🛡️ Sprint 2: Core Payment Flow (~1 hour)

**Goal:** User-facing error handling and secure API routes

### ⏳ Task 3: Add User-Facing Error Handling

**Priority:** 🔴 Critical
**Estimated Time:** 20 minutes
**Files:**
- [lib/paddle/paddle.ts](lib/paddle/paddle.ts)
- [app/signup/page.tsx](app/signup/page.tsx)

**Problem:**
When Paddle fails to initialize, checkout fails silently. Users create accounts but can't pay.

**Solution:**

**File: lib/paddle/paddle.ts**
```typescript
export function openCheckout(
  priceId: string,
  userId: string,
  email?: string,
  onError?: (message: string) => void
) {
  getPaddle().then((paddle) => {
    if (!paddle) {
      const errorMsg = "Payment system unavailable. Please refresh and try again."
      console.error("Paddle not initialized")
      onError?.(errorMsg)
      return
    }

    try {
      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: email ? { email } : undefined,
        customData: { userId },
        settings: {
          successUrl: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/signup/success?userId=${userId}`,
        },
      })
    } catch (error) {
      const errorMsg = "Failed to open payment checkout. Please try again."
      console.error("Checkout error:", error)
      onError?.(errorMsg)
    }
  }).catch((error) => {
    const errorMsg = "Payment initialization failed. Please refresh the page."
    console.error("Paddle initialization error:", error)
    onError?.(errorMsg)
  })
}
```

**File: app/signup/page.tsx (line ~138)**
```typescript
// Open Paddle checkout with user ID and error handling
setTimeout(() => {
  openCheckout(
    selectedPlan.priceId,
    data.user!.id,
    formData.email,
    (errorMessage) => {
      // Handle Paddle errors
      toast.error(errorMessage)
      setLoading(false)
      // Optionally: Add retry button
    }
  )
}, 500)
```

**Alternative Option: Retry Logic**
Add a retry button in the error toast:
```typescript
toast.error(errorMessage, {
  action: {
    label: "Retry",
    onClick: () => {
      openCheckout(selectedPlan.priceId, data.user!.id, formData.email)
    }
  }
})
```

**Testing:**
1. Start dev server
2. Temporarily break Paddle (use invalid token in .env.local)
3. Try to sign up
4. Should see user-friendly error message
5. Restore valid token - should work again

---

### ⏳ Task 4: Move Subscription Cancellation to API Route

**Priority:** 🔴 Critical
**Estimated Time:** 30 minutes
**Files:**
- NEW: `app/api/subscription/cancel/route.ts`
- UPDATE: [lib/paddle/subscription-helpers.ts](lib/paddle/subscription-helpers.ts)

**Problem:**
Current code tries to call Paddle API from browser:
```typescript
// ❌ BROKEN - Browser can't access PADDLE_API_KEY
const paddleApiKey = process.env.PADDLE_API_KEY
```

**Solution:**

**Create: app/api/subscription/cancel/route.ts**
```typescript
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    // Verify user is authenticated
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (subError || !subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      )
    }

    // Only monthly subscriptions can be canceled
    if (subscription.plan_type !== "monthly") {
      return NextResponse.json(
        { error: "One-time purchases cannot be canceled" },
        { status: 400 }
      )
    }

    if (!subscription.paddle_subscription_id) {
      return NextResponse.json(
        { error: "No Paddle subscription ID found" },
        { status: 400 }
      )
    }

    // Call Paddle API (server-side only)
    const paddleApiKey = process.env.PADDLE_API_KEY
    const paddleEnvironment = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "sandbox"

    if (!paddleApiKey) {
      console.error("PADDLE_API_KEY not configured")
      return NextResponse.json(
        { error: "Payment system not configured" },
        { status: 500 }
      )
    }

    const baseUrl =
      paddleEnvironment === "production"
        ? "https://api.paddle.com"
        : "https://sandbox-api.paddle.com"

    const response = await fetch(
      `${baseUrl}/subscriptions/${subscription.paddle_subscription_id}/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paddleApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          effective_from: "next_billing_period",
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Paddle cancellation failed:", errorText)
      return NextResponse.json(
        { error: "Failed to cancel subscription" },
        { status: response.status }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error canceling subscription:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

**Update: lib/paddle/subscription-helpers.ts**
```typescript
export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  try {
    const response = await fetch("/api/subscription/cancel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const data = await response.json()
      console.error("Failed to cancel subscription:", data.error)
      toast.error(data.error || "Failed to cancel subscription")
      return false
    }

    toast.success("Subscription will cancel at end of billing period")
    return true
  } catch (error) {
    console.error("Error canceling subscription:", error)
    toast.error("Failed to cancel subscription. Please try again.")
    return false
  }
}
```

**Testing:**
1. Create a monthly subscription (use test flow)
2. Go to `/dashboard/settings`
3. Click "Cancel Subscription"
4. Should see API call to `/api/subscription/cancel`
5. Check Paddle dashboard - subscription should be scheduled for cancellation

---

## 🔒 Sprint 3: Security Hardening (~45 min)

**Goal:** Protect against attacks and unauthorized access

### ⏳ Task 5: Reduce Webhook Replay Window

**Priority:** 🟠 High
**Estimated Time:** 1 minute
**File:** [app/api/webhooks/paddle/route.ts:93](app/api/webhooks/paddle/route.ts#L93)

**Change:**
```typescript
// Before: 5 minutes (too long)
if (webhookAge > 300) {

// After: 3 minutes (industry standard)
if (webhookAge > 180) {
```

**Why:** Reduces window for replay attacks from 5 to 3 minutes.

**Testing:** Minimal - just verify webhooks still work.

---

### ⏳ Task 6: Add Duplicate Webhook Protection

**Priority:** 🟠 High
**Estimated Time:** 25 minutes
**Files:**
- NEW: `supabase/migrations/008_webhook_events.sql`
- UPDATE: [app/api/webhooks/paddle/route.ts](app/api/webhooks/paddle/route.ts)

**Problem:**
Paddle retries failed webhooks. Same event could be processed multiple times.

**Solution Options:**

#### Option A: Database Table (RECOMMENDED) ✅
Create table to track processed events.

**Create: supabase/migrations/008_webhook_events.sql**
```sql
-- Webhook event tracking to prevent duplicates
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_webhook_events_event_id ON webhook_events(event_id);

-- Clean up old events after 30 days (optional)
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at);
```

**Update: app/api/webhooks/paddle/route.ts (after signature verification)**
```typescript
// After line 103 (parsing verified body)
const event = body as PaddleWebhookEvent

// Check if we've already processed this event
const { data: existingEvent } = await supabaseAdmin
  .from("webhook_events")
  .select("id")
  .eq("event_id", event.event_id)
  .single()

if (existingEvent) {
  console.log("Duplicate webhook event, skipping:", event.event_id)
  return NextResponse.json({ received: true }, { status: 200 })
}

// Record this event
await supabaseAdmin.from("webhook_events").insert({
  event_id: event.event_id,
  event_type: event.event_type,
})

console.log("Received verified Paddle webhook:", event.event_type)
```

**Why this is recommended:**
- Prevents duplicate processing
- Keeps audit trail
- Paddle-recommended approach

#### Option B: In-Memory Cache
Use a Map to track recent event IDs.

**Pros:** No database changes
**Cons:** Lost on server restart, doesn't work with multiple instances

**Testing:**
1. Send same webhook twice (use Paddle sandbox replay feature)
2. Check logs - should see "Duplicate webhook event, skipping"
3. Verify subscription is only created once

---

### ⏳ Task 7: Validate Success Page Access

**Priority:** 🟠 High
**Estimated Time:** 20 minutes
**File:** [app/signup/success/page.tsx](app/signup/success/page.tsx)

**Problem:**
User could navigate to `/signup/success` without paying.

**Solution:**

```typescript
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
// ... other imports ...
import { createClient } from "@/lib/supabase/client"
import { getUserSubscription } from "@/lib/paddle/subscription-helpers"

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(0)
  const [validated, setValidated] = useState(false)

  useEffect(() => {
    // Validate user has active subscription
    async function validateAccess() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        console.warn("No user found, redirecting to signup")
        router.replace("/signup")
        return
      }

      // Check if user has a subscription
      const subscription = await getUserSubscription()

      if (!subscription || subscription.status !== "active") {
        console.warn("No active subscription, redirecting to signup")
        router.replace("/signup")
        return
      }

      // Valid access - show success page
      setValidated(true)
    }

    validateAccess()
  }, [router])

  useEffect(() => {
    // Only fire confetti after validation
    if (!validated) return

    // ... existing confetti code ...
  }, [validated])

  // Show loading while validating
  if (!validated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // ... rest of component ...
}
```

**Alternative Option: Server-Side Validation**
Make success page a server component and validate on server.

**Pros:** More secure
**Cons:** No client-side animations (confetti)

**Recommendation:** Use client-side validation (above) since Paddle redirects with transaction ID in URL, and we're checking database anyway.

**Testing:**
1. Navigate directly to `/signup/success` (not logged in)
2. Should redirect to `/signup`
3. Complete real signup and payment
4. Should show success page with confetti

---

## ✨ Sprint 4: Polish (~1.5 hours) - OPTIONAL

**Goal:** Improve user experience and performance

### ⏳ Task 8: Fix Signup Flow Race Condition

**Priority:** 🟡 Medium
**Estimated Time:** 30 minutes
**File:** [app/signup/page.tsx](app/signup/page.tsx)

**Problem:**
```typescript
// Arbitrary delay - bad UX
setTimeout(() => {
  openCheckout(selectedPlan.priceId, data.user!.id, formData.email)
}, 500)
```

**Solution Options:**

#### Option A: Immediate Open with Paddle Events (RECOMMENDED) ✅
```typescript
// Remove setTimeout completely
openCheckout(
  selectedPlan.priceId,
  data.user!.id,
  formData.email,
  (error) => {
    toast.error(error)
    setLoading(false)
  }
)

// Add Paddle event listeners
useEffect(() => {
  if (typeof window === 'undefined') return

  // Listen for Paddle checkout events
  window.addEventListener('paddle-checkout-close', () => {
    setLoading(false)
  })

  return () => {
    window.removeEventListener('paddle-checkout-close', () => {})
  }
}, [])
```

**Why this is recommended:**
- No arbitrary delay
- Handles modal close
- Better UX

#### Option B: Keep Delay, Add Modal Listeners
Keep 500ms delay but add listeners.

**Pros:** More conservative
**Cons:** Still has delay

#### Option C: Promise Chain
```typescript
try {
  const { data, error } = await supabase.auth.signUp({...})
  if (error) throw error

  await openCheckoutAsync(selectedPlan.priceId, data.user!.id, formData.email)
} catch (error) {
  toast.error(error.message)
  setLoading(false)
}
```

**Testing:**
1. Sign up with valid email/password
2. Checkout should open immediately
3. Close Paddle modal - loading should stop
4. No console errors

---

### ⏳ Task 9: Add Database Indexes

**Priority:** 🟡 Medium
**Estimated Time:** 15 minutes
**File:** NEW: `supabase/migrations/009_add_indexes.sql`

**Create: supabase/migrations/009_add_indexes.sql**
```sql
-- Indexes for better query performance

-- Subscriptions table
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_subscription_id
  ON subscriptions(paddle_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_customer_id
  ON subscriptions(paddle_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions(status);

-- Profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_email
  ON profiles(email);

-- Analytics (if exists)
-- Uncomment if you have analytics table
-- CREATE INDEX IF NOT EXISTS idx_analytics_user_id
--   ON analytics(user_id);

-- CREATE INDEX IF NOT EXISTS idx_analytics_created_at
--   ON analytics(created_at DESC);
```

**Why these indexes:**
- `paddle_subscription_id`: Used in webhook lookups
- `paddle_customer_id`: Used in customer queries
- `status`: Used to filter active subscriptions
- `email`: Used in user lookups

**Testing:**
1. Run migration in Supabase SQL Editor
2. Check query performance (should be faster)
3. No breaking changes

---

### ⏳ Task 10: Improve Error Messages

**Priority:** 🟡 Medium
**Estimated Time:** 30 minutes
**Files:** Multiple payment-related files

**Current Problems:**
- Generic "Failed to..." messages
- No actionable guidance
- Missing context

**Solution: Specific Error Messages**

**File: app/signup/page.tsx**
```typescript
// Replace generic errors with specific ones
if (!formData.email || !formData.password) {
  toast.error("Email and password are required", {
    description: "Please fill in all required fields to continue"
  })
  return
}

if (formData.password.length < 6) {
  toast.error("Password too short", {
    description: "Password must be at least 6 characters long"
  })
  return
}

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
if (!emailRegex.test(formData.email)) {
  toast.error("Invalid email address", {
    description: "Please enter a valid email address"
  })
  return
}

// Supabase errors
if (error.message.includes("already registered")) {
  toast.error("Email already in use", {
    description: "This email is already registered. Try logging in instead.",
    action: {
      label: "Go to Login",
      onClick: () => router.push("/login")
    }
  })
  return
}
```

**File: lib/paddle/paddle.ts**
```typescript
// Better error context
if (!clientToken) {
  console.error("Paddle client token not found in environment variables")
  return null
}

if (!paddle) {
  const errorMsg = "Unable to connect to payment system. Please check:\n1. Your internet connection\n2. Try refreshing the page\n3. Contact support if issue persists"
  onError?.(errorMsg)
  return
}
```

**Testing:**
1. Test each error condition
2. Verify user-friendly messages appear
3. Check action buttons work (e.g., "Go to Login")

---

## 🚀 Sprint 5: Ship It (~2 hours)

**Goal:** Validate everything works end-to-end

### ⏳ Task 11: End-to-End Testing

**Priority:** 🟢 Essential
**Estimated Time:** 2 hours
**Reference:** [TESTING_GUIDE.md](TESTING_GUIDE.md)

**Testing Checklist:**

#### Pre-Testing Setup
- [ ] Run database migration (000 or 007)
- [ ] Configure `.env.local` with Paddle sandbox keys
- [ ] Create Paddle sandbox products ($49 one-time, $19/month)
- [ ] Get Paddle price IDs
- [ ] Configure webhook URL (ngrok or Vercel)

#### Test: One-Time Purchase Flow
- [ ] Navigate to `/signup`
- [ ] Select "Launch Toolkit" ($49 one-time)
- [ ] Enter email: `test-onetime@example.com`
- [ ] Enter password: `testpass123`
- [ ] Click "Continue to Payment"
- [ ] Paddle checkout opens
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete payment
- [ ] Redirected to `/signup/success`
- [ ] See confetti animation
- [ ] Check database: subscription created with `plan_type='one_time'`
- [ ] Check webhook logs: `transaction.completed` event received

#### Test: Monthly Subscription Flow
- [ ] Sign out
- [ ] Navigate to `/signup`
- [ ] Select "Pro Monthly" ($19/month)
- [ ] Enter email: `test-monthly@example.com`
- [ ] Enter password: `testpass123`
- [ ] Complete checkout with test card
- [ ] Verify subscription created with `plan_type='monthly'`
- [ ] Check webhook logs: `subscription.created` event received

#### Test: Error Handling
- [ ] Try signup with existing email - see error
- [ ] Try password < 6 chars - see error
- [ ] Try invalid email - see error
- [ ] Close Paddle modal - loading stops
- [ ] Navigate to `/signup/success` directly - redirected

#### Test: Subscription Management
- [ ] Login as monthly subscriber
- [ ] Go to `/dashboard/settings`
- [ ] See subscription details
- [ ] Click "Cancel Subscription"
- [ ] Confirm cancellation
- [ ] Check Paddle dashboard - subscription scheduled to cancel

#### Test: Security
- [ ] Send duplicate webhook - should be ignored
- [ ] Send webhook with old timestamp - should be rejected
- [ ] Send webhook with invalid signature - should be rejected

#### Test: Performance
- [ ] Page load times < 2 seconds
- [ ] Checkout opens instantly
- [ ] No console errors
- [ ] Build size reasonable

**Issues Found:** (Document here)

---

### ⏳ Task 12: Clean Up Test Data

**Priority:** 🟢 Essential
**Estimated Time:** 15 minutes
**Reference:** CLAUDE.md says "delete test users and start fresh"

**Create: cleanup-test-data.sql**
```sql
-- WARNING: This deletes ALL test data!
-- Only run in development/sandbox environment

-- Delete test subscriptions
DELETE FROM subscriptions
WHERE user_id IN (
  SELECT id FROM auth.users
  WHERE email LIKE 'test-%@example.com'
);

-- Delete test webhook events
DELETE FROM webhook_events
WHERE created_at < NOW() - INTERVAL '1 day';

-- Delete test users (Supabase handles this via dashboard)
-- Go to: Authentication > Users > Select test users > Delete

-- Verify cleanup
SELECT 'Remaining subscriptions:', COUNT(*) FROM subscriptions;
SELECT 'Remaining webhook events:', COUNT(*) FROM webhook_events;
```

**Manual Steps:**
1. Go to Supabase Dashboard
2. Authentication > Users
3. Filter for `test-` emails
4. Select all test users
5. Click Delete

**After Cleanup:**
- [ ] No test users remain
- [ ] No test subscriptions remain
- [ ] Fresh database for production
- [ ] Ready to deploy

---

## 📋 Quick Reference

### File Changes Summary

| File | Change Type | Priority |
|------|-------------|----------|
| [lib/paddle/paddle.ts](lib/paddle/paddle.ts) | Update | 🔴 Critical |
| [app/signup/page.tsx](app/signup/page.tsx) | Update | 🔴 Critical |
| [lib/paddle/subscription-helpers.ts](lib/paddle/subscription-helpers.ts) | Update | 🔴 Critical |
| `app/api/subscription/cancel/route.ts` | Create | 🔴 Critical |
| [app/api/webhooks/paddle/route.ts](app/api/webhooks/paddle/route.ts) | Update | 🟠 High |
| `supabase/migrations/008_webhook_events.sql` | Create | 🟠 High |
| [app/signup/success/page.tsx](app/signup/success/page.tsx) | Update | 🟠 High |
| `supabase/migrations/009_add_indexes.sql` | Create | 🟡 Medium |
| `cleanup-test-data.sql` | Create | 🟢 Essential |

### Testing Checkpoints

- **After Task 1-2:** Build succeeds, Paddle initializes
- **After Task 3-4:** Signup flow works end-to-end
- **After Task 5-7:** Security measures in place
- **After Task 8-10:** UX is polished
- **After Task 11-12:** Production ready

### Time Estimates

| Sprint | Tasks | Time | Cumulative |
|--------|-------|------|------------|
| Sprint 1 | 1-2 | 20 min | 20 min |
| Sprint 2 | 3-4 | 50 min | 1h 10m |
| Sprint 3 | 5-7 | 46 min | 2h |
| Sprint 4 | 8-10 | 1h 15m | 3h 15m |
| Sprint 5 | 11-12 | 2h 15m | 5h 30m |

---

## 🎯 Next Session Checklist

Before starting next task:
- [ ] Current task tested and working
- [ ] Changes committed to git
- [ ] Todo list updated
- [ ] No build errors
- [ ] Ready for next task

---

## 📝 Notes & Decisions

### Why Sequential Fix & Test?
- Low risk approach requested
- Catch issues early
- Build confidence
- Can stop at any checkpoint

### Why These Priorities?
- **Critical (🔴):** Blocks all testing/deployment
- **High (🟠):** Security/production issues
- **Medium (🟡):** UX polish (can ship without)
- **Essential (🟢):** Required before production

### Options Philosophy
For each task, I provide:
1. **Recommended option** (✅) - Best balance of effort/value
2. **Alternative options** - Different trade-offs
3. **Why recommended** - Clear reasoning

This lets you:
- Trust the recommendation
- Understand alternatives
- Make informed decisions
- Customize if needed

---

**Last Updated:** 2025-11-29 after Task 1 completion
**Next Task:** Task 2 - Fix Paddle Environment Variables
