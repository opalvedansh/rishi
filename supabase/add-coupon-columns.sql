-- Add coupon fields to orders table
-- Run this in Supabase SQL Editor

ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_orders_coupon_code ON orders(coupon_code);
