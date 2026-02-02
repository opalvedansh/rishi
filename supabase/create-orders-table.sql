-- Create/Update orders table for Razorpay integration with tracking
-- Run this in your Supabase SQL Editor

-- Drop existing table if needed (comment out if you want to keep data)
-- DROP TABLE IF EXISTS orders;

CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL UNIQUE,
    razorpay_payment_id TEXT,
    amount NUMERIC NOT NULL,
    
    -- Payment status
    payment_status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    -- Delivery status with full tracking
    delivery_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (delivery_status IN (
            'pending',
            'confirmed', 
            'processing', 
            'shipped', 
            'in_transit', 
            'out_for_delivery', 
            'delivered',
            'cancelled',
            'returned'
        )),
    
    -- Tracking information
    tracking_number TEXT,
    courier_name TEXT,
    estimated_delivery TEXT,
    tracking_updates JSONB DEFAULT '[]'::jsonb,
    
    -- Order details
    shipping_address JSONB NOT NULL,
    items JSONB NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_status ON orders(delivery_status);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Service role has full access" ON orders;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view own orders"
    ON orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own orders
CREATE POLICY "Users can insert own orders"
    ON orders
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Allow updating orders (for payment status)
CREATE POLICY "Users can update own orders"
    ON orders
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Allow all authenticated users to read (for admin)
-- Note: In production, you should add proper admin role checks
CREATE POLICY "Authenticated users can read all orders"
    ON orders
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Allow all authenticated users to update (for admin status changes)
CREATE POLICY "Authenticated users can update orders"
    ON orders
    FOR UPDATE
    TO authenticated
    USING (true);

-- If you already have the table and just need to add new columns, run these ALTER statements instead:
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending';
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS courier_name TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_updates JSONB DEFAULT '[]'::jsonb;

-- To migrate existing 'status' column to new columns:
-- UPDATE orders SET payment_status = status WHERE status IN ('pending', 'paid', 'failed', 'refunded');
-- UPDATE orders SET delivery_status = 'confirmed' WHERE status = 'paid';
