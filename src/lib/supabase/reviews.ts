import { createClient } from "@/utils/supabase/client";

export interface Review {
    id: string;
    product_id: string;
    name: string;
    email?: string;
    heading?: string;
    rating: number;
    comment?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

// Fetch approved reviews for a product (Public View)
export async function getReviewsByProductId(productId: string): Promise<Review[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }

    return data || [];
}

// Fetch all reviews (Admin View)
export async function getAllReviews(): Promise<Review[]> {
    const supabase = createClient();

    // Join with products to get product title if needed, but for now just reviews
    const { data, error } = await supabase
        .from('reviews')
        .select(`
            *,
            products (
                title,
                image
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching all reviews:', error);
        return [];
    }

    // Flattening the structure if needed, or returning as is. 
    // Typescript might complain about the join structure not matching Review interface exactly if we don't handle it.
    // For now, let's cast or adjust the return type if we want product info.
    // We'll stick to basic Review interface for the main return, but we might extend it later.
    return data as any || [];
}

// Create a new review (Public Submit)
export async function createReview(review: Omit<Review, 'id' | 'created_at' | 'status'>): Promise<Review | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('reviews')
        .insert({
            ...review,
            status: 'pending'
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating review:', error);
        throw error;
    }

    return data;
}

// Update review status (Admin)
export async function updateReviewStatus(id: string, status: ReviewStatus): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id);

    if (error) {
        console.error('Error updating review status:', error);
        return false;
    }

    return true;
}

// Update review content (Admin Edit)
export async function updateReviewContent(id: string, updates: Partial<Pick<Review, 'name' | 'heading' | 'rating' | 'comment'>>): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', id);

    if (error) {
        console.error('Error updating review content:', error);
        return false;
    }

    return true;
}

// Delete review (Admin)
export async function deleteReview(id: string): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting review:', error);
        return false;
    }

    return true;
}
