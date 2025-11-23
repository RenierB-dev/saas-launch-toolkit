-- Create customer_acquisition table
CREATE TABLE IF NOT EXISTS customer_acquisition (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  channels_trying JSONB DEFAULT '[]'::jsonb,
  communities_joined JSONB DEFAULT '[]'::jsonb,
  customers JSONB DEFAULT '[]'::jsonb,
  total_customers INTEGER DEFAULT 0,
  notes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_customer_acquisition_user_id ON customer_acquisition(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_acquisition_total_customers ON customer_acquisition(total_customers);

-- Enable Row Level Security (RLS)
ALTER TABLE customer_acquisition ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own customer acquisition"
  ON customer_acquisition FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own customer acquisition"
  ON customer_acquisition FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customer acquisition"
  ON customer_acquisition FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customer acquisition"
  ON customer_acquisition FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_customer_acquisition_updated_at
  BEFORE UPDATE ON customer_acquisition
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
