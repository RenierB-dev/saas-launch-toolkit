-- Webhook event tracking to prevent duplicate processing
-- Created: 2025-11-29
-- Purpose: Track processed webhook events to prevent duplicate processing when Paddle retries

-- Create webhook_events table
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast event_id lookups (most common query)
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id ON webhook_events(event_id);

-- Index for cleanup queries (optional - can delete old events)
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON webhook_events(created_at);

-- Add comment for documentation
COMMENT ON TABLE webhook_events IS 'Tracks processed Paddle webhook events to prevent duplicate processing';
COMMENT ON COLUMN webhook_events.event_id IS 'Unique Paddle event ID from webhook payload';
COMMENT ON COLUMN webhook_events.event_type IS 'Type of webhook event (e.g., transaction.completed)';
COMMENT ON COLUMN webhook_events.processed_at IS 'When this event was successfully processed';

-- Optional: Function to clean up old webhook events (older than 30 days)
-- Uncomment if you want automatic cleanup
-- CREATE OR REPLACE FUNCTION cleanup_old_webhook_events()
-- RETURNS void AS $$
-- BEGIN
--   DELETE FROM webhook_events
--   WHERE created_at < NOW() - INTERVAL '30 days';
-- END;
-- $$ LANGUAGE plpgsql;
