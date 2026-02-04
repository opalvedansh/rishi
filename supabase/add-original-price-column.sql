-- Add original_price column to products table if it doesn't exist
-- Run this in Supabase SQL Editor

ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price NUMERIC;

-- Optional: Update some existing products to have an original_price for testing
-- UPDATE products SET original_price = price * 1.5 WHERE original_price IS NULL;
