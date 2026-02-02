import { createClient } from "@/utils/supabase/client";

// Order delivery status progression
export type DeliveryStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'in_transit'
    | 'out_for_delivery'
    | 'delivered'
    | 'cancelled'
    | 'returned';

// Payment status
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface TrackingUpdate {
    status: DeliveryStatus;
    message: string;
    timestamp: string;
    location?: string;
}

export interface Order {
    id: string;
    user_id: string;
    razorpay_order_id: string;
    razorpay_payment_id: string | null;
    amount: number;
    payment_status: PaymentStatus;
    delivery_status: DeliveryStatus;
    tracking_number?: string;
    courier_name?: string;
    estimated_delivery?: string;
    tracking_updates: TrackingUpdate[];
    shipping_address: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        zip: string;
    };
    items: {
        id: string;
        title: string;
        price: number;
        quantity: number;
        image: string;
        selectedSize: string;
    }[];
    created_at: string;
    updated_at: string;
}

export interface CreateOrderData {
    user_id: string;
    razorpay_order_id: string;
    amount: number;
    shipping_address: Order['shipping_address'];
    items: Order['items'];
}

// Customer care details
export const CUSTOMER_CARE = {
    phone: '+91 85108 03096',
    whatsapp: '+91 8510803096',
    email: 'support@doree.in',
    hours: 'Mon-Sat, 9:00 AM - 8:00 PM IST',
};

// Delivery status configuration
export const DELIVERY_STEPS: { status: DeliveryStatus; label: string; description: string }[] = [
    { status: 'confirmed', label: 'Order Confirmed', description: 'Your order has been placed successfully' },
    { status: 'processing', label: 'Processing', description: 'We are preparing your order' },
    { status: 'shipped', label: 'Shipped', description: 'Your order is on the way' },
    { status: 'in_transit', label: 'In Transit', description: 'Order is in transit to your city' },
    { status: 'out_for_delivery', label: 'Out for Delivery', description: 'Your order is out for delivery' },
    { status: 'delivered', label: 'Delivered', description: 'Order has been delivered' },
];

export function getDeliveryStepIndex(status: DeliveryStatus): number {
    if (status === 'pending') return -1;
    if (status === 'cancelled' || status === 'returned') return -2;
    return DELIVERY_STEPS.findIndex(step => step.status === status);
}

export async function createOrder(data: CreateOrderData): Promise<Order | null> {
    const supabase = createClient();

    const initialTracking: TrackingUpdate[] = [{
        status: 'pending',
        message: 'Order placed, awaiting payment',
        timestamp: new Date().toISOString(),
    }];

    const { data: order, error } = await supabase
        .from('orders')
        .insert({
            user_id: data.user_id,
            razorpay_order_id: data.razorpay_order_id,
            amount: data.amount,
            payment_status: 'pending',
            delivery_status: 'pending',
            tracking_updates: initialTracking,
            shipping_address: data.shipping_address,
            items: data.items,
        })
        .select()
        .single();

    if (error) {
        console.error('Error creating order:', error);
        return null;
    }

    return order;
}

export async function updateOrderPayment(
    razorpay_order_id: string,
    razorpay_payment_id: string,
    payment_status: 'paid' | 'failed'
): Promise<Order | null> {
    const supabase = createClient();

    // First get the current order to update tracking
    const { data: currentOrder } = await supabase
        .from('orders')
        .select('tracking_updates')
        .eq('razorpay_order_id', razorpay_order_id)
        .single();

    const existingUpdates = currentOrder?.tracking_updates || [];

    const newUpdate: TrackingUpdate = {
        status: payment_status === 'paid' ? 'confirmed' : 'cancelled',
        message: payment_status === 'paid'
            ? 'Payment successful! Order confirmed'
            : 'Payment failed. Order cancelled',
        timestamp: new Date().toISOString(),
    };

    const { data: order, error } = await supabase
        .from('orders')
        .update({
            razorpay_payment_id,
            payment_status,
            delivery_status: payment_status === 'paid' ? 'confirmed' : 'cancelled',
            tracking_updates: [...existingUpdates, newUpdate],
            updated_at: new Date().toISOString(),
        })
        .eq('razorpay_order_id', razorpay_order_id)
        .select()
        .single();

    if (error) {
        console.error('Error updating order:', error);
        return null;
    }

    return order;
}

export async function updateDeliveryStatus(
    orderId: string,
    delivery_status: DeliveryStatus,
    message: string,
    location?: string
): Promise<Order | null> {
    const supabase = createClient();

    // First get the current order to update tracking
    const { data: currentOrder } = await supabase
        .from('orders')
        .select('tracking_updates')
        .eq('id', orderId)
        .single();

    const existingUpdates = currentOrder?.tracking_updates || [];

    const newUpdate: TrackingUpdate = {
        status: delivery_status,
        message,
        timestamp: new Date().toISOString(),
        location,
    };

    const { data: order, error } = await supabase
        .from('orders')
        .update({
            delivery_status,
            tracking_updates: [...existingUpdates, newUpdate],
            updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

    if (error) {
        console.error('Error updating delivery status:', error);
        return null;
    }

    return order;
}

export async function updateOrderTracking(
    orderId: string,
    trackingNumber: string,
    courierName: string,
    estimatedDelivery?: string
): Promise<Order | null> {
    const supabase = createClient();

    const { data: order, error } = await supabase
        .from('orders')
        .update({
            tracking_number: trackingNumber,
            courier_name: courierName,
            estimated_delivery: estimatedDelivery,
            updated_at: new Date().toISOString(),
        })
        .eq('id', orderId)
        .select()
        .single();

    if (error) {
        console.error('Error updating tracking info:', error);
        return null;
    }

    return order;
}

export async function getOrdersByUser(user_id: string): Promise<Order[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return data || [];
}

export async function getOrderById(id: string): Promise<Order | null> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching order:', error);
        return null;
    }

    return data;
}

export async function getAllOrders(): Promise<Order[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return [];
    }

    return data || [];
}
