import { createClient } from "@/utils/supabase/client";

export interface Product {
    id: string;
    title: string;
    handle: string;
    price: number;
    original_price?: number;
    image: string;
    images?: string[];
    tag?: string;
    category?: string;
    description?: string;
    sizes?: string[];
    colors?: string[];
    details?: string[];
    rating?: number;
    review_count?: number;
    in_stock?: boolean;
    sort_order?: number;
    created_at?: string;
}

// Transform DB product to frontend format (snake_case -> camelCase for compatibility)
export function transformProduct(dbProduct: any): Product {
    return {
        id: dbProduct.id,
        title: dbProduct.title,
        handle: dbProduct.handle,
        price: dbProduct.price,
        original_price: dbProduct.original_price,
        image: dbProduct.image,
        images: dbProduct.images || [],
        tag: dbProduct.tag,
        category: dbProduct.category,
        description: dbProduct.description,
        sizes: dbProduct.sizes || [],
        colors: dbProduct.colors || [],
        details: dbProduct.details || [],
        rating: dbProduct.rating,
        review_count: dbProduct.review_count,
        in_stock: dbProduct.in_stock ?? true,
        sort_order: dbProduct.sort_order ?? 0,
        created_at: dbProduct.created_at,
    };
}

// Fetch all products
export async function getProducts(): Promise<Product[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    return (data || []).map(transformProduct);
}

// Fetch single product by handle
export async function getProductByHandle(handle: string): Promise<Product | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("handle", handle)
        .single();

    if (error) {
        console.error("Error fetching product:", error);
        return null;
    }

    return data ? transformProduct(data) : null;
}

// Create new product (Admin)
export async function createProduct(product: Omit<Product, "id" | "created_at">): Promise<Product | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("products")
        .insert({
            title: product.title,
            handle: product.handle,
            price: product.price,
            original_price: product.original_price,
            image: product.image,
            images: product.images || [],
            tag: product.tag,
            category: product.category,
            description: product.description,
            sizes: product.sizes || [],
            colors: product.colors || [],
            details: product.details || [],
            rating: product.rating || 0,
            review_count: product.review_count || 0,
            in_stock: product.in_stock ?? true,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating product:", error);
        throw new Error(error.message);
    }

    return data ? transformProduct(data) : null;
}

// Update product (Admin)
export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("products")
        .update({
            title: updates.title,
            handle: updates.handle,
            price: updates.price,
            original_price: updates.original_price,
            image: updates.image,
            images: updates.images,
            tag: updates.tag,
            category: updates.category,
            description: updates.description,
            sizes: updates.sizes,
            colors: updates.colors,
            details: updates.details,
            rating: updates.rating,
            review_count: updates.review_count,
            in_stock: updates.in_stock,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Error updating product:", error);
        throw new Error(error.message);
    }

    return data ? transformProduct(data) : null;
}

// Delete product (Admin)
export async function deleteProduct(id: string): Promise<boolean> {
    const supabase = createClient();

    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting product:", error);
        throw new Error(error.message);
    }

    return true;
}

// Update product sort order (Admin)
export async function updateProductOrder(items: { id: string; sort_order: number }[]): Promise<boolean> {
    const supabase = createClient();

    // We use Promise.all to update in parallel as Supabase upsert with partial data 
    // can be tricky regarding not-null constraints if viewed as an insert.
    // For small batch sizes (products < 100), this is acceptable.
    const updates = items.map((item) =>
        supabase
            .from("products")
            .update({ sort_order: item.sort_order })
            .eq("id", item.id)
    );

    const results = await Promise.all(updates);

    const hasError = results.some((result) => result.error);
    if (hasError) {
        console.error("Error updating product order");
        return false;
    }

    return true;
}
