-- Create producthunt_launches table
CREATE TABLE IF NOT EXISTS producthunt_launches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT,
  product_description TEXT,
  launch_date TIMESTAMP WITH TIME ZONE,
  title TEXT,
  tagline TEXT,
  checklist_progress JSONB DEFAULT '{}'::jsonb,
  playbook_progress JSONB DEFAULT '{}'::jsonb,
  assets_uploaded JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_producthunt_launches_user_id ON producthunt_launches(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE producthunt_launches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own launches"
  ON producthunt_launches FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own launches"
  ON producthunt_launches FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own launches"
  ON producthunt_launches FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own launches"
  ON producthunt_launches FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_producthunt_launches_updated_at
  BEFORE UPDATE ON producthunt_launches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
