-- Create usage_tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tool_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, tool_name)
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_tool_name ON usage_tracking(tool_name);

-- Enable Row Level Security
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own usage tracking"
  ON usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage tracking"
  ON usage_tracking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage tracking"
  ON usage_tracking FOR UPDATE
  USING (auth.uid() = user_id);

-- Create affiliates table
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  affiliate_code TEXT UNIQUE NOT NULL,
  referrals INTEGER DEFAULT 0,
  revenue_generated NUMERIC(10, 2) DEFAULT 0,
  commission_earned NUMERIC(10, 2) DEFAULT 0,
  payout_email TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_affiliate_code ON affiliates(affiliate_code);

-- Enable Row Level Security
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for affiliates
CREATE POLICY "Users can view their own affiliate data"
  ON affiliates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own affiliate data"
  ON affiliates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own affiliate data"
  ON affiliates FOR UPDATE
  USING (auth.uid() = user_id);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'converted', 'cancelled')),
  conversion_date TIMESTAMP WITH TIME ZONE,
  revenue NUMERIC(10, 2) DEFAULT 0,
  commission NUMERIC(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);

-- Enable Row Level Security
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for referrals
CREATE POLICY "Affiliates can view their own referrals"
  ON referrals FOR SELECT
  USING (affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid()));

-- Add plan_type to profiles table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='plan_type') THEN
    ALTER TABLE profiles ADD COLUMN plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'pro'));
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='stripe_customer_id') THEN
    ALTER TABLE profiles ADD COLUMN stripe_customer_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='stripe_subscription_id') THEN
    ALTER TABLE profiles ADD COLUMN stripe_subscription_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name='profiles' AND column_name='referral_code') THEN
    ALTER TABLE profiles ADD COLUMN referral_code TEXT UNIQUE;
  END IF;
END $$;

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usage_tracking_updated_at BEFORE UPDATE ON usage_tracking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_affiliates_updated_at BEFORE UPDATE ON affiliates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_referrals_updated_at BEFORE UPDATE ON referrals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
