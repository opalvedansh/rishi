-- Add in_stock column to products table
-- Run this in your Supabase SQL Editor

ALTER TABLE products ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT true;

-- Set all existing products to be in stock
UPDATE products SET in_stock = true WHERE in_stock IS NULL;
