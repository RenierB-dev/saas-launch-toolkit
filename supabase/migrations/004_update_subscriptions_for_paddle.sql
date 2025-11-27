-- Update subscriptions table to use Paddle instead of Stripe
-- Rename stripe_* columns to paddle_*

ALTER TABLE subscriptions
  RENAME COLUMN stripe_customer_id TO paddle_customer_id;

ALTER TABLE subscriptions
  RENAME COLUMN stripe_subscription_id TO paddle_subscription_id;

-- Add additional Paddle-specific fields
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS paddle_transaction_id TEXT;

ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS paddle_price_id TEXT;

-- Add metadata column for storing additional Paddle data
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_customer_id
  ON subscriptions(paddle_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_subscription_id
  ON subscriptions(paddle_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions(status);

-- Add comment for clarity
COMMENT ON TABLE subscriptions IS 'Stores user subscription data from Paddle payments';
