-- Create a table for CMS content storage
CREATE TABLE IF NOT EXISTS cms_content (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

-- Create policies (Allow read for everyone, write for authenticated users/admins)
-- For simplicity in this demo, we allow public read
CREATE POLICY "Allow public read access" ON cms_content
    FOR SELECT USING (true);

-- Allow authenticated users (admins) to insert/update
CREATE POLICY "Allow authenticated insert" ON cms_content
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON cms_content
    FOR UPDATE USING (auth.role() = 'authenticated');
