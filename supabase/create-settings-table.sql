-- Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  general JSONB DEFAULT '{}'::jsonb,
  shipping JSONB DEFAULT '{}'::jsonb,
  notifications JSONB DEFAULT '{}'::jsonb,
  social JSONB DEFAULT '{}'::jsonb,
  payment JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Everyone can read settings (needed for frontend to know store name, social links etc.)
CREATE POLICY "Public can view settings" ON store_settings
  FOR SELECT
  USING (true);

-- Only authenticated users (admins) can update
CREATE POLICY "Authenticated users can update settings" ON store_settings
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Only authenticated users (admins) can insert (only needed once)
CREATE POLICY "Authenticated users can insert settings" ON store_settings
  FOR INSERT
  USING (auth.role() = 'authenticated');

-- Ensure only one row exists (Singleton pattern)
CREATE UNIQUE INDEX IF NOT EXISTS one_row_only ON store_settings((true));

-- Insert default row if not exists
INSERT INTO store_settings (general, shipping, notifications, social, payment)
VALUES (
    '{"storeName": "Doree", "storeEmail": "Doreebysvd@gmail.com", "currency": "INR", "timezone": "Asia/Kolkata", "storePhone": "+91 98765 43210", "storeAddress": "Flat no 130, Surya Vihar Part 2, Sector 91, Faridabad, Haryana - 121003"}',
    '{"deliveryDays": "3-5", "processingDays": "1-2", "expressShippingRate": "199", "freeShippingThreshold": "999", "standardShippingRate": "99"}',
    '{"lowStock": true, "newsletter": true, "newCustomer": false, "orderShipped": true, "orderDelivered": true, "orderConfirmation": true}',
    '{"facebook": "https://facebook.com/doree", "instagram": "https://instagram.com/doree", "whatsapp": "+919876543210"}',
    '{"codEnabled": true, "upiEnabled": true, "razorpayKeyId": "", "razorpayKeySecret": ""}'
) ON CONFLICT DO NOTHING;
