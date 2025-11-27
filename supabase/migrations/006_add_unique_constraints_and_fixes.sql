-- Add UNIQUE constraint on subscriptions.user_id to prevent duplicate subscriptions
-- This ensures one user can only have one active subscription record

DO $$
BEGIN
  -- First, clean up any duplicate records (keep the most recent one)
  DELETE FROM subscriptions
  WHERE id NOT IN (
    SELECT DISTINCT ON (user_id) id
    FROM subscriptions
    ORDER BY user_id, updated_at DESC
  );

  -- Add UNIQUE constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'subscriptions_user_id_unique'
  ) THEN
    ALTER TABLE subscriptions
    ADD CONSTRAINT subscriptions_user_id_unique UNIQUE (user_id);
  END IF;
END $$;

-- Update profile trigger to properly set email field
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,  -- ✅ Now properly sets email
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

-- Update existing profiles that are missing email
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
  AND (p.email IS NULL OR p.email = '');

-- Add comment for documentation
COMMENT ON CONSTRAINT subscriptions_user_id_unique ON subscriptions
IS 'Ensures one subscription per user. Webhooks use upsert with this constraint.';
