-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  image TEXT,
  category TEXT,
  author TEXT DEFAULT 'Admin',
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Public can view published blogs
CREATE POLICY "Public can view published blogs" ON blogs
  FOR SELECT
  USING (is_published = true);

-- Admins can do everything
-- Note: Assuming auth.uid() checks or similar logic exists, or openness for now if using client-side admin checks (though RLS is better).
-- For this project context, we often make it permissive for authenticated users or specific emails if configured in Supabase.
-- For simplicity in this SQL (which user runs manually), we'll allow all access to authenticated users for now, or public read/write if easy development.
-- BETTER: Authenticated users can do all (Create, Update, Delete)
CREATE POLICY "Authenticated users can manage blogs" ON blogs
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create an index on slug for fast lookups
CREATE INDEX IF NOT EXISTS blogs_slug_idx ON blogs (slug);
