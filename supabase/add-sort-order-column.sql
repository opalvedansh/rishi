-- Add sort_order column to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update existing products to have a default sort order based on created_at
-- This ensures existing products have a meaningful order initially
WITH ranked_products AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as rnk
  FROM products
)
UPDATE products
SET sort_order = ranked_products.rnk
FROM ranked_products
WHERE products.id = ranked_products.id;
