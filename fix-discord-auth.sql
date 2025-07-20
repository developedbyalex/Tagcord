-- Fix Discord OAuth authentication
-- Update the handle_new_user function to properly handle Discord user data

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create updated function for Discord OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, discord_id, discord_username, discord_avatar, discord_discriminator)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'provider_id',
      NEW.raw_user_meta_data->>'sub',
      NEW.raw_user_meta_data->>'id'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'user_name',
      NEW.raw_user_meta_data->>'name',
      NEW.raw_user_meta_data->>'username',
      'Unknown User'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      NEW.raw_user_meta_data->>'picture',
      NEW.raw_user_meta_data->>'avatar',
      NEW.raw_user_meta_data->>'image'
    ),
    COALESCE(
      NEW.raw_user_meta_data->>'discriminator',
      '0'
    )
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and continue (prevents auth failure)
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also ensure the profiles table has the correct structure
-- Add any missing columns if they don't exist
DO $$
BEGIN
  -- Add discord_discriminator if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'discord_discriminator'
  ) THEN
    ALTER TABLE profiles ADD COLUMN discord_discriminator TEXT;
  END IF;
END $$; 