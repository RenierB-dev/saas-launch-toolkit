-- ============================================================================
-- CONSOLIDATED SCHEMA - SaaS Launch Toolkit
-- ============================================================================
-- This migration consolidates all previous migrations into one clean schema.
-- Replaces migrations 001-006 with a single, tested, production-ready schema.
--
-- Run this INSTEAD OF the other migrations on a fresh database.
-- For existing databases, run migration 007_consolidation_fix.sql instead.
-- ============================================================================

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE profiles IS 'User profile information, synced from auth.users';

-- ============================================================================
-- SUBSCRIPTIONS TABLE (Paddle)
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Paddle payment fields
  paddle_customer_id TEXT,
  paddle_subscription_id TEXT UNIQUE,
  paddle_transaction_id TEXT,
  paddle_price_id TEXT,

  -- Subscription status
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  plan_type TEXT NOT NULL CHECK (plan_type IN ('one_time', 'monthly')),
  price_amount INTEGER NOT NULL,

  -- Subscription period
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,

  -- Additional data
  metadata JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE subscriptions IS 'User subscription data from Paddle. One subscription per user.';
COMMENT ON CONSTRAINT subscriptions_user_id_key ON subscriptions
  IS 'Ensures one subscription per user. Webhooks use upsert with this constraint.';

-- ============================================================================
-- USAGE TRACKING TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_name TEXT NOT NULL CHECK (tool_name IN (
    'producthunt_optimizer',
    'pricing_calculator',
    'launch_sequence',
    'customer_acquisition',
    'marketing_assets'
  )),
  action TEXT,  -- Nullable: can track just "accessed" without specific action
  metadata JSONB DEFAULT '{}'::jsonb,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE usage_tracking IS 'Tracks which tools users access and use';

-- ============================================================================
-- PRICING CALCULATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS pricing_calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,

  -- Pricing inputs
  pricing_model TEXT NOT NULL CHECK (pricing_model IN ('one_time', 'subscription', 'both')),
  one_time_price DECIMAL(10, 2),
  monthly_price DECIMAL(10, 2),
  annual_price DECIMAL(10, 2),

  -- Revenue projections
  target_customers INTEGER NOT NULL DEFAULT 100,
  monthly_churn_rate DECIMAL(5, 2) DEFAULT 5.0,
  conversion_rate DECIMAL(5, 2) DEFAULT 2.0,

  -- Cost assumptions
  monthly_costs DECIMAL(10, 2) DEFAULT 0,
  customer_acquisition_cost DECIMAL(10, 2) DEFAULT 0,

  -- Calculated results
  results JSONB DEFAULT '{}'::jsonb,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE pricing_calculations IS 'Saved pricing scenarios and calculations';

-- ============================================================================
-- LAUNCH SEQUENCES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS launch_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,

  -- Personalization data
  product_name TEXT,
  product_type TEXT CHECK (product_type IN ('b2b_saas', 'b2c_saas', 'marketplace', 'tool', 'other')),
  target_launch_date DATE,
  has_mvp_ready BOOLEAN DEFAULT FALSE,
  has_pricing_set BOOLEAN DEFAULT FALSE,

  -- Progress tracking
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  current_day INTEGER DEFAULT 1,
  completed_tasks_count INTEGER DEFAULT 0,
  total_tasks_count INTEGER DEFAULT 30,

  -- Settings
  email_reminders_enabled BOOLEAN DEFAULT TRUE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

COMMENT ON TABLE launch_sequences IS 'User launch sequence personalization and progress. One per user.';

-- ============================================================================
-- LAUNCH TASKS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS launch_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  sequence_id UUID REFERENCES launch_sequences(id) ON DELETE CASCADE NOT NULL,

  -- Task details
  day_number INTEGER NOT NULL CHECK (day_number >= 1 AND day_number <= 30),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('planning', 'building', 'marketing', 'preparation', 'launch', 'post_launch')),

  -- Status
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  is_skipped BOOLEAN DEFAULT FALSE,
  skipped_reason TEXT,

  -- Notes
  user_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- One task per day per sequence
  UNIQUE(sequence_id, day_number)
);

COMMENT ON TABLE launch_tasks IS 'Individual tasks within a launch sequence';

-- ============================================================================
-- FEATURE WAITLIST TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS feature_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  feature_name TEXT NOT NULL CHECK (feature_name IN (
    'producthunt_optimizer',
    'customer_acquisition',
    'marketing_assets'
  )),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Prevent duplicate signups
  UNIQUE(email, feature_name)
);

COMMENT ON TABLE feature_waitlist IS 'Waitlist for upcoming features';

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Subscriptions
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_customer_id ON subscriptions(paddle_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_subscription_id ON subscriptions(paddle_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Usage tracking
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_tool_name ON usage_tracking(tool_name);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_created_at ON usage_tracking(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_accessed_at ON usage_tracking(accessed_at DESC);

-- Pricing calculations
CREATE INDEX IF NOT EXISTS idx_pricing_calculations_user_id ON pricing_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_pricing_calculations_created_at ON pricing_calculations(created_at DESC);

-- Launch sequences
CREATE INDEX IF NOT EXISTS idx_launch_sequences_user_id ON launch_sequences(user_id);

-- Launch tasks
CREATE INDEX IF NOT EXISTS idx_launch_tasks_user_id ON launch_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_launch_tasks_sequence_id ON launch_tasks(sequence_id);
CREATE INDEX IF NOT EXISTS idx_launch_tasks_day_number ON launch_tasks(day_number);
CREATE INDEX IF NOT EXISTS idx_launch_tasks_is_completed ON launch_tasks(is_completed);

-- Feature waitlist
CREATE INDEX IF NOT EXISTS idx_feature_waitlist_feature_name ON feature_waitlist(feature_name);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_waitlist ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view their own usage"
  ON usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON usage_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Pricing calculations policies
CREATE POLICY "Users can view their own pricing calculations"
  ON pricing_calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pricing calculations"
  ON pricing_calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pricing calculations"
  ON pricing_calculations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pricing calculations"
  ON pricing_calculations FOR DELETE
  USING (auth.uid() = user_id);

-- Launch sequences policies
CREATE POLICY "Users can view their own launch sequence"
  ON launch_sequences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own launch sequence"
  ON launch_sequences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own launch sequence"
  ON launch_sequences FOR UPDATE
  USING (auth.uid() = user_id);

-- Launch tasks policies
CREATE POLICY "Users can view their own launch tasks"
  ON launch_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own launch tasks"
  ON launch_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own launch tasks"
  ON launch_tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- Feature waitlist policies (anyone can sign up)
CREATE POLICY "Anyone can insert to waitlist"
  ON feature_waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own waitlist entries"
  ON feature_waitlist FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'Auto-updates updated_at timestamp on row update';

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,  -- ✅ Properly sets email from auth.users
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION handle_new_user() IS 'Creates profile record when new user signs up';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_calculations_updated_at
  BEFORE UPDATE ON pricing_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_launch_sequences_updated_at
  BEFORE UPDATE ON launch_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_launch_tasks_updated_at
  BEFORE UPDATE ON launch_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- SCHEMA VALIDATION
-- ============================================================================

DO $$
BEGIN
  -- Verify critical constraints exist
  ASSERT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'subscriptions_user_id_key'
  ), 'Missing UNIQUE constraint on subscriptions.user_id';

  ASSERT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'launch_sequences_user_id_key'
  ), 'Missing UNIQUE constraint on launch_sequences.user_id';

  -- Verify profiles.email is NOT NULL
  ASSERT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles'
      AND column_name = 'email'
      AND is_nullable = 'NO'
  ), 'profiles.email must be NOT NULL';

  RAISE NOTICE '✅ Schema validation passed!';
END $$;
