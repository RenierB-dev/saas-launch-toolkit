-- ============================================================================
-- FIX EXISTING SCHEMA - Migration 007
-- ============================================================================
-- This migration fixes databases that already ran migrations 001-006.
-- It consolidates the conflicting changes into the correct final state.
--
-- ONLY run this if you've already run some or all of migrations 001-006.
-- For fresh databases, use 000_consolidated_schema.sql instead.
-- ============================================================================

-- ============================================================================
-- STEP 1: Fix profiles table and trigger
-- ============================================================================

-- Ensure email column exists and is properly set up
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Drop and recreate trigger to ensure email is set correctly
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,  -- ✅ Properly sets email
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Backfill missing emails in existing profiles
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
  AND (p.email IS NULL OR p.email = '');

-- Make email NOT NULL after backfilling
ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;

-- Add UNIQUE constraint if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'profiles'::regclass AND conname = 'profiles_email_key'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_key UNIQUE (email);
  END IF;
END $$;

-- ============================================================================
-- STEP 2: Fix subscriptions table for Paddle
-- ============================================================================

-- Rename Stripe columns to Paddle if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN stripe_customer_id TO paddle_customer_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN stripe_subscription_id TO paddle_subscription_id;
  END IF;
END $$;

-- Add Paddle columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'paddle_customer_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN paddle_customer_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'paddle_subscription_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN paddle_subscription_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'paddle_transaction_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN paddle_transaction_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'paddle_price_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN paddle_price_id TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- CRITICAL: Add UNIQUE constraint on user_id
DO $$
BEGIN
  -- First, remove duplicate subscriptions (keep most recent)
  DELETE FROM subscriptions
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id
    FROM subscriptions
    ORDER BY user_id, updated_at DESC
  );

  -- Add UNIQUE constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'subscriptions'::regclass AND conname = 'subscriptions_user_id_key'
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Add UNIQUE constraint on paddle_subscription_id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'subscriptions'::regclass AND conname = 'subscriptions_paddle_subscription_id_key'
  ) THEN
    ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_paddle_subscription_id_key UNIQUE (paddle_subscription_id);
  END IF;
END $$;

-- Drop old Stripe indexes
DROP INDEX IF EXISTS idx_subscriptions_stripe_customer_id;

-- Create Paddle indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_customer_id ON subscriptions(paddle_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_subscription_id ON subscriptions(paddle_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ============================================================================
-- STEP 3: Fix usage_tracking table
-- ============================================================================

-- Add accessed_at column if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usage_tracking' AND column_name = 'accessed_at'
  ) THEN
    ALTER TABLE usage_tracking ADD COLUMN accessed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
  END IF;
END $$;

-- Make action nullable
ALTER TABLE usage_tracking ALTER COLUMN action DROP NOT NULL;

-- Add index on accessed_at
CREATE INDEX IF NOT EXISTS idx_usage_tracking_accessed_at ON usage_tracking(accessed_at DESC);

-- ============================================================================
-- STEP 4: Fix foreign key references
-- ============================================================================
-- NOTE: This is the most dangerous part. Foreign keys may reference
-- either profiles(id) or auth.users(id) depending on which migrations ran.
-- We'll standardize on auth.users(id) for all tables.

-- Helper function to rebuild foreign key constraints
DO $$
DECLARE
  table_name TEXT;
  constraint_name TEXT;
BEGIN
  -- We're going to skip this for now as it's too risky on a production DB
  -- The existing foreign keys will work fine even if inconsistent
  -- New installs should use 000_consolidated_schema.sql

  RAISE NOTICE 'Skipping foreign key rebuilding - existing constraints will work';
  RAISE NOTICE 'For new installations, use 000_consolidated_schema.sql instead';
END $$;

-- ============================================================================
-- STEP 5: Add comments for documentation
-- ============================================================================

COMMENT ON TABLE profiles IS 'User profile information, synced from auth.users';
COMMENT ON TABLE subscriptions IS 'User subscription data from Paddle. One subscription per user.';
COMMENT ON TABLE usage_tracking IS 'Tracks which tools users access and use';
COMMENT ON TABLE pricing_calculations IS 'Saved pricing scenarios and calculations';
COMMENT ON TABLE launch_sequences IS 'User launch sequence personalization and progress. One per user.';
COMMENT ON TABLE launch_tasks IS 'Individual tasks within a launch sequence';
COMMENT ON TABLE feature_waitlist IS 'Waitlist for upcoming features';

COMMENT ON CONSTRAINT subscriptions_user_id_key ON subscriptions
  IS 'Ensures one subscription per user. Webhooks use upsert with this constraint.';

COMMENT ON FUNCTION update_updated_at_column() IS 'Auto-updates updated_at timestamp on row update';
COMMENT ON FUNCTION handle_new_user() IS 'Creates profile record when new user signs up';

-- ============================================================================
-- FINAL VALIDATION
-- ============================================================================

DO $$
BEGIN
  -- Verify critical fixes
  ASSERT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email' AND is_nullable = 'NO'
  ), 'FAILED: profiles.email must be NOT NULL';

  ASSERT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conrelid = 'subscriptions'::regclass AND conname = 'subscriptions_user_id_key'
  ), 'FAILED: Missing UNIQUE constraint on subscriptions.user_id';

  ASSERT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'paddle_customer_id'
  ), 'FAILED: Missing paddle_customer_id column';

  ASSERT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usage_tracking' AND column_name = 'accessed_at'
  ), 'FAILED: Missing accessed_at column in usage_tracking';

  RAISE NOTICE '✅ Schema fixes applied successfully!';
  RAISE NOTICE '✅ profiles.email is NOT NULL';
  RAISE NOTICE '✅ subscriptions.user_id has UNIQUE constraint';
  RAISE NOTICE '✅ Paddle columns present in subscriptions';
  RAISE NOTICE '✅ usage_tracking has accessed_at column';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 Your database is now ready for payment testing!';
END $$;
