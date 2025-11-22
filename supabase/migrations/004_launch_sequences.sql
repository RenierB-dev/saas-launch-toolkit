-- Create launch_sequences table
CREATE TABLE IF NOT EXISTS launch_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT,
  launch_date TIMESTAMP WITH TIME ZONE,
  daily_progress JSONB DEFAULT '{}'::jsonb,
  completed_tasks INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 90,
  email_reminders BOOLEAN DEFAULT false,
  reminder_time TEXT DEFAULT '09:00',
  weekly_summary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_launch_sequences_user_id ON launch_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_launch_sequences_launch_date ON launch_sequences(launch_date);

-- Enable Row Level Security (RLS)
ALTER TABLE launch_sequences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own launch sequences"
  ON launch_sequences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own launch sequences"
  ON launch_sequences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own launch sequences"
  ON launch_sequences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own launch sequences"
  ON launch_sequences FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_launch_sequences_updated_at
  BEFORE UPDATE ON launch_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
