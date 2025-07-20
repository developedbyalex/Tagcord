-- Migration: Add discord_url column to tags table
-- This adds support for storing Discord invite links

-- Add the discord_url column
ALTER TABLE tags ADD COLUMN discord_url TEXT;

-- Add constraint to ensure valid Discord URLs
ALTER TABLE tags ADD CONSTRAINT tags_discord_url_check 
    CHECK (discord_url IS NULL OR discord_url ~ '^https://(discord\.gg|discord\.com/invite)/[a-zA-Z0-9-]+$');

-- Add comment to explain the column
COMMENT ON COLUMN tags.discord_url IS 'Discord invite link (discord.gg or discord.com/invite)';

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_tags_discord_url ON tags(discord_url); 