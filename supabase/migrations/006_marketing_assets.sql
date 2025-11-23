-- Create marketing_assets table
CREATE TABLE IF NOT EXISTS marketing_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT,
  generated_posts JSONB DEFAULT '[]'::jsonb,
  generated_emails JSONB DEFAULT '[]'::jsonb,
  generated_ads JSONB DEFAULT '[]'::jsonb,
  press_releases JSONB DEFAULT '[]'::jsonb,
  favorites JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_marketing_assets_user_id ON marketing_assets(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE marketing_assets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own marketing assets"
  ON marketing_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own marketing assets"
  ON marketing_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketing assets"
  ON marketing_assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own marketing assets"
  ON marketing_assets FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_marketing_assets_updated_at
  BEFORE UPDATE ON marketing_assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
