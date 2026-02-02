import { createClient } from "@/utils/supabase/client";

export interface Coupon {
    id: string;
    code: string;
    discount_percent: number;
    min_order_value: number;
    expires_at?: string;
    is_active: boolean;
    usage_limit?: number;
    used_count: number;
    created_at: string;
}

// Validate coupon (Checkout)
export async function validateCoupon(code: string, cartTotal: number): Promise<{ valid: boolean; message?: string; discountAmount?: number; coupon?: Coupon }> {
    const supabase = createClient();

    const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single();

    if (error || !coupon) {
        return { valid: false, message: "Invalid coupon code" };
    }

    // Check expiry
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        return { valid: false, message: "This coupon has expired" };
    }

    // Check usage limit
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        return { valid: false, message: "This coupon has reached its usage limit" };
    }

    // Check minimum order value
    if (cartTotal < coupon.min_order_value) {
        return { valid: false, message: `Minimum order value of ₹${coupon.min_order_value} required` };
    }

    // Calculate discount
    const discountAmount = Math.round((cartTotal * coupon.discount_percent) / 100);

    return {
        valid: true,
        message: `${coupon.discount_percent}% discount applied!`,
        discountAmount,
        coupon
    };
}

// Admin Operations

export async function getAllCoupons(): Promise<Coupon[]> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching coupons:', error);
        return [];
    }
    return data || [];
}

export async function createCoupon(couponData: Omit<Coupon, 'id' | 'created_at' | 'used_count'>): Promise<Coupon | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('coupons')
        .insert({
            ...couponData,
            code: couponData.code.toUpperCase(),
            used_count: 0
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating coupon:', error);
        throw error;
    }
    return data;
}

export async function toggleCouponStatus(id: string, isActive: boolean): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
        .from('coupons')
        .update({ is_active: isActive })
        .eq('id', id);

    return !error;
}

export async function deleteCoupon(id: string): Promise<boolean> {
    const supabase = createClient();
    const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

    return !error;
}

export async function incrementCouponUsage(code: string) {
    const supabase = createClient();
    // We can't easily do atomic increment with simple update in client lib without RPC, 
    // but for now fetch-update is okay or we can assume high concurrency isn't an issue yet.
    // Ideally use an RPC function for atomic increment.

    const { data: coupon } = await supabase.from('coupons').select('used_count').eq('code', code).single();
    if (coupon) {
        await supabase
            .from('coupons')
            .update({ used_count: coupon.used_count + 1 })
            .eq('code', code);
    }
}
