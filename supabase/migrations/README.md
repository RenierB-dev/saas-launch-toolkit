# Database Migrations Guide

## ⚠️ IMPORTANT: Read This First

This folder contains multiple migration files. **DO NOT run all of them!**

Migrations 001-006 have conflicts and should NOT be run together. They were created during development and have schema inconsistencies.

---

## 🆕 Fresh Database (Recommended)

If you're setting up a **new database** or can **reset your existing database**:

### Run ONLY this migration:
```sql
000_consolidated_schema.sql
```

This is a clean, tested schema with:
- ✅ Proper email handling in profiles
- ✅ Paddle payment fields
- ✅ UNIQUE constraint on subscriptions.user_id
- ✅ All foreign keys pointing to auth.users(id)
- ✅ Usage tracking with accessed_at field
- ✅ All RLS policies
- ✅ Validated and tested

**This is the recommended approach.**

---

## 🔧 Existing Database (Has Data)

If you've already run migrations 001-006 and have user data:

### Run this migration to fix your schema:
```sql
007_fix_existing_schema.sql
```

This migration:
- ✅ Fixes the profiles trigger to set email correctly
- ✅ Backfills missing emails
- ✅ Converts Stripe columns to Paddle
- ✅ Adds UNIQUE constraint on subscriptions.user_id
- ✅ Removes duplicate subscriptions
- ✅ Adds missing usage_tracking.accessed_at column
- ✅ Makes usage_tracking.action nullable

**This is safe to run on production databases with existing users.**

---

## 🗂️ File Reference

| File | Purpose | Run This? |
|------|---------|-----------|
| `000_consolidated_schema.sql` | Clean schema for fresh databases | ✅ Fresh DB only |
| `001_initial_schema.sql` | Original schema (Stripe) | ❌ Deprecated |
| `002_pricing_and_launch_tables.sql` | Added pricing/launch tools | ❌ Deprecated |
| `003_fix_and_add_missing_tables.sql` | Attempted fixes | ❌ Deprecated |
| `004_update_subscriptions_for_paddle.sql` | Stripe→Paddle conversion | ❌ Deprecated |
| `005_safe_paddle_migration.sql` | Safe Paddle migration | ❌ Deprecated |
| `006_add_unique_constraints_and_fixes.sql` | Critical fixes | ❌ Deprecated |
| `007_fix_existing_schema.sql` | Fixes for existing DBs | ✅ Existing DB only |

---

## 🚀 Quick Start

### Option A: Fresh Database (Recommended)

1. **Reset your Supabase database** (if it has test data)
2. Go to Supabase Dashboard → SQL Editor
3. Run **`000_consolidated_schema.sql`**
4. ✅ Done! Your schema is ready.

### Option B: Fix Existing Database

1. Go to Supabase Dashboard → SQL Editor
2. Run **`007_fix_existing_schema.sql`**
3. Check the console for success messages
4. ✅ Done! Your schema is fixed.

---

## 🔍 How to Verify Your Schema

After running migrations, verify everything is correct:

```sql
-- Check profiles.email is NOT NULL
SELECT column_name, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'email';
-- Should show: is_nullable = 'NO'

-- Check subscriptions has UNIQUE constraint on user_id
SELECT conname, contype
FROM pg_constraint
WHERE conrelid = 'subscriptions'::regclass
  AND conname = 'subscriptions_user_id_key';
-- Should return 1 row with contype = 'u' (unique)

-- Check Paddle columns exist
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'subscriptions'
  AND column_name LIKE 'paddle%';
-- Should show: paddle_customer_id, paddle_subscription_id,
--              paddle_transaction_id, paddle_price_id

-- Check usage_tracking has accessed_at
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'usage_tracking' AND column_name = 'accessed_at';
-- Should return 1 row
```

---

## 🐛 Troubleshooting

### "Column already exists" error
- You're trying to run 000 on a database that already has tables
- Solution: Use 007_fix_existing_schema.sql instead

### "Constraint already exists" error
- Your database already has the fixes applied
- Solution: You're good! No action needed.

### "Profiles.email cannot be null" error
- Your trigger isn't setting email correctly
- Solution: Run 007_fix_existing_schema.sql

### Duplicate subscription records
- Multiple subscriptions exist for one user
- Solution: Run 007_fix_existing_schema.sql (it removes duplicates)

---

## 📊 Schema Overview

After running migrations, you'll have these tables:

| Table | Purpose | Key Constraints |
|-------|---------|-----------------|
| `profiles` | User profiles | email NOT NULL, UNIQUE |
| `subscriptions` | Paddle subscriptions | user_id UNIQUE (one per user) |
| `usage_tracking` | Tool usage logs | None |
| `pricing_calculations` | Saved pricing scenarios | None |
| `launch_sequences` | 30-day launch plans | user_id UNIQUE (one per user) |
| `launch_tasks` | Individual launch tasks | (sequence_id, day_number) UNIQUE |
| `feature_waitlist` | Feature request signups | (email, feature_name) UNIQUE |

---

## 🔒 Security Notes

All tables have Row Level Security (RLS) enabled:
- Users can only see/modify their own data
- Webhook endpoints use service role key to bypass RLS
- All foreign keys use ON DELETE CASCADE for data cleanup

---

## 💡 Need Help?

1. **Fresh database issues**: Make sure you ran ONLY 000_consolidated_schema.sql
2. **Existing database issues**: Make sure you ran 007_fix_existing_schema.sql
3. **Still broken**: Check the verification queries above to see what's wrong

---

**Last Updated**: 2025-11-27
**Schema Version**: 007 (consolidated)
