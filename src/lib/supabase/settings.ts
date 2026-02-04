import { createClient } from "@/utils/supabase/client";

export type StoreSettings = {
    id: string;
    general: {
        storeName: string;
        storeEmail: string;
        storePhone: string;
        storeAddress: string;
        currency: string;
        timezone: string;
    };
    shipping: {
        freeShippingThreshold: string;
        standardShippingRate: string;
        expressShippingRate: string;
        processingDays: string;
        deliveryDays: string;
    };
    notifications: {
        orderConfirmation: boolean;
        orderShipped: boolean;
        orderDelivered: boolean;
        lowStock: boolean;
        newCustomer: boolean;
        newsletter: boolean;
    };
    social: {
        instagram: string;
        facebook: string;
        whatsapp: string;
    };
    payment: {
        razorpayKeyId: string;
        razorpayKeySecret: string;
        codEnabled: boolean;
        upiEnabled: boolean;
    };
};

export async function getSettings() {
    const supabase = createClient();
    const { data, error } = await supabase
        .from('store_settings')
        .select('*')
        .single();

    if (error) {
        console.error('Error fetching settings:', error);
        return null;
    }

    return data as StoreSettings;
}

export async function updateSettings(updates: Partial<StoreSettings>) {
    const supabase = createClient();

    // First get the ID (assuming only one row)
    const { data: currentSettings } = await supabase
        .from('store_settings')
        .select('id')
        .single();

    if (!currentSettings) throw new Error("Settings not initialized");

    const { data, error } = await supabase
        .from('store_settings')
        .update(updates)
        .eq('id', currentSettings.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating settings:', error);
        throw error;
    }

    return data as StoreSettings;
}
