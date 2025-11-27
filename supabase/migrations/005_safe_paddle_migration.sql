-- Safe migration to update subscriptions table for Paddle
-- This handles cases where columns may already exist or have been renamed

DO $$
BEGIN
  -- Rename stripe_customer_id to paddle_customer_id if stripe column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN stripe_customer_id TO paddle_customer_id;
  END IF;

  -- Rename stripe_subscription_id to paddle_subscription_id if stripe column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE subscriptions RENAME COLUMN stripe_subscription_id TO paddle_subscription_id;
  END IF;

  -- Add paddle_customer_id if it doesn't exist (in case we're starting fresh)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'paddle_customer_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN paddle_customer_id TEXT UNIQUE;
  END IF;

  -- Add paddle_subscription_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'paddle_subscription_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN paddle_subscription_id TEXT UNIQUE;
  END IF;

  -- Add paddle_transaction_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'paddle_transaction_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN paddle_transaction_id TEXT;
  END IF;

  -- Add paddle_price_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'paddle_price_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN paddle_price_id TEXT;
  END IF;

  -- Add metadata column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Create indexes for faster lookups (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_customer_id
  ON subscriptions(paddle_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_subscription_id
  ON subscriptions(paddle_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions(status);

-- Drop old Stripe indexes if they exist
DROP INDEX IF EXISTS idx_subscriptions_stripe_customer_id;

-- Add comment for clarity
COMMENT ON TABLE subscriptions IS 'Stores user subscription data from Paddle payments';

-- Add accessed_at column to usage_tracking if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usage_tracking' AND column_name = 'accessed_at'
  ) THEN
    ALTER TABLE usage_tracking ADD COLUMN accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Update usage_tracking action column to be nullable (we now just track access)
ALTER TABLE usage_tracking ALTER COLUMN action DROP NOT NULL;
