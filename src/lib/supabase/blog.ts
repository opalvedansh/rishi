import { createClient } from "@/utils/supabase/client";

export type Blog = {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string | null;
    image: string | null;
    category: string | null;
    author: string | null;
    is_published: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
};

export async function getBlogs() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching blogs:', error);
        return [];
    }

    return data as Blog[];
}

export async function getPublishedBlogs() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Error fetching published blogs:', error);
        return [];
    }

    return data as Blog[];
}

export async function getBlogBySlug(slug: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        console.error('Error fetching blog by slug:', error);
        return null;
    }

    return data as Blog;
}

export async function getBlogById(id: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching blog by id:', error);
        return null;
    }

    return data as Blog;
}

export async function createBlog(blog: Partial<Blog>) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('blogs')
        .insert([blog])
        .select()
        .single();

    if (error) {
        console.error('Error creating blog:', error);
        throw error;
    }

    return data as Blog;
}

export async function updateBlog(id: string, updates: Partial<Blog>) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('blogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating blog:', error);
        throw error;
    }

    return data as Blog;
}

export async function deleteBlog(id: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting blog:', error);
        throw error;
    }

    return true;
}
