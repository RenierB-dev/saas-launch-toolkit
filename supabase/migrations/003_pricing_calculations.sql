-- Create pricing_calculations table
CREATE TABLE IF NOT EXISTS pricing_calculations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT,
  competitors JSONB DEFAULT '[]'::jsonb,
  van_westendorp_data JSONB,
  value_based_inputs JSONB,
  selected_model TEXT,
  pricing_tiers JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_pricing_calculations_user_id ON pricing_calculations(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE pricing_calculations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
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

-- Create trigger to update updated_at
CREATE TRIGGER update_pricing_calculations_updated_at
  BEFORE UPDATE ON pricing_calculations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
