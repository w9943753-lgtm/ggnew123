-- Run this SQL in your Supabase Dashboard > SQL Editor
-- This adds features and usage columns to the products table

-- Add features column (stores product features as JSON array)
ALTER TABLE products ADD COLUMN IF NOT EXISTS features jsonb DEFAULT '[]'::jsonb;

-- Add usage column (stores usage instructions as JSON array)  
ALTER TABLE products ADD COLUMN IF NOT EXISTS usage_instructions jsonb DEFAULT '[]'::jsonb;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'products' 
AND column_name IN ('features', 'usage_instructions');
