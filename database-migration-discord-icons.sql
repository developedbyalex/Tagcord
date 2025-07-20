-- Migration: Add discord_icon_id column to tags table
-- This adds support for Discord's official guild icons

-- Add the discord_icon_id column
ALTER TABLE tags ADD COLUMN discord_icon_id INTEGER;

-- Set default value for existing records (icon ID 2)
UPDATE tags SET discord_icon_id = 2 WHERE discord_icon_id IS NULL;

-- Make the column required for future inserts
ALTER TABLE tags ALTER COLUMN discord_icon_id SET NOT NULL;

-- Add constraint to ensure valid icon IDs (2-21, excluding 1)
ALTER TABLE tags ADD CONSTRAINT tags_discord_icon_id_check 
    CHECK (discord_icon_id >= 2 AND discord_icon_id <= 21);

-- Add comment to explain the column
COMMENT ON COLUMN tags.discord_icon_id IS 'Discord guild icon ID (2-21) from discordresources.com/img/guilds/{id}.svg'; 