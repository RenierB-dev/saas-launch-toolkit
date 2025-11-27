-- First, drop the broken trigger and function if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the handle_new_user function (FIXED)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Add email column to profiles if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Now add the new tables for our tools

-- Create pricing_calculations table
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

  -- Calculated results (stored for quick access)
  results JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create launch_sequences table
CREATE TABLE IF NOT EXISTS launch_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Personalization data
  product_name TEXT,
  product_type TEXT CHECK (product_type IN ('b2b_saas', 'b2c_saas', 'marketplace', 'tool', 'other')),
  target_launch_date DATE,
  has_mvp_ready BOOLEAN DEFAULT FALSE,
  has_pricing_set BOOLEAN DEFAULT FALSE,

  -- Progress tracking
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  current_day INTEGER DEFAULT 1,
  completed_tasks_count INTEGER DEFAULT 0,
  total_tasks_count INTEGER DEFAULT 30,

  -- Settings
  email_reminders_enabled BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- One sequence per user
  UNIQUE(user_id)
);

-- Create launch_tasks table
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

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- One task per day per user
  UNIQUE(user_id, sequence_id, day_number)
);

-- Create waitlist table for "coming soon" features
CREATE TABLE IF NOT EXISTS feature_waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  feature_name TEXT NOT NULL CHECK (feature_name IN ('producthunt_optimizer', 'customer_acquisition', 'marketing_assets')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

  -- Prevent duplicate signups
  UNIQUE(email, feature_name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pricing_calculations_user_id ON pricing_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_pricing_calculations_created_at ON pricing_calculations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_launch_sequences_user_id ON launch_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_launch_tasks_user_id ON launch_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_launch_tasks_sequence_id ON launch_tasks(sequence_id);
CREATE INDEX IF NOT EXISTS idx_launch_tasks_day_number ON launch_tasks(day_number);
CREATE INDEX IF NOT EXISTS idx_launch_tasks_is_completed ON launch_tasks(is_completed);
CREATE INDEX IF NOT EXISTS idx_feature_waitlist_feature_name ON feature_waitlist(feature_name);

-- Enable Row Level Security on new tables
ALTER TABLE pricing_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE launch_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_waitlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pricing_calculations
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

-- RLS Policies for launch_sequences
CREATE POLICY "Users can view their own launch sequence"
  ON launch_sequences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own launch sequence"
  ON launch_sequences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own launch sequence"
  ON launch_sequences FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for launch_tasks
CREATE POLICY "Users can view their own launch tasks"
  ON launch_tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own launch tasks"
  ON launch_tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own launch tasks"
  ON launch_tasks FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for feature_waitlist (anyone can sign up)
CREATE POLICY "Anyone can insert to waitlist"
  ON feature_waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own waitlist entries"
  ON feature_waitlist FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to update updated_at on the new tables
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
