import { createClient } from "@/utils/supabase/client";

export interface CMSContent {
    key: string;
    value: any;
    updated_at?: string;
}

// Fetch content by key
export async function getContent<T>(key: string): Promise<T | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('cms_content')
        .select('value')
        .eq('key', key)
        .single();

    if (error) {
        // console.error(`Error fetching content for ${key}:`, error);
        return null;
    }

    return data.value as T;
}

// Save content (Upsert)
export async function saveContent(key: string, value: any): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from('cms_content')
        .upsert({
            key,
            value,
            updated_at: new Date().toISOString()
        })
        .select()
        .single();

    if (error) {
        console.error(`Error saving content for ${key}:`, error);
        return false;
    }

    return true;
}
