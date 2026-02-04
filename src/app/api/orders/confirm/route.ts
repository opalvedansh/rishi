import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import OrderConfirmationEmail from "@/components/emails/OrderConfirmation";
import AdminNewOrderEmail from "@/components/emails/AdminNewOrder";
import { createClient } from "@/utils/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
    try {
        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
        }

        const supabase = await createClient();

        // Fetch full order details
        const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

        if (error || !order) {
            console.error("Error fetching order for email:", error);
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Calculate totals
        const items = order.items;
        const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
        const discount = order.discount_amount || 0;
        const shipping = 0; // Or fetch from order if stored
        const total = order.amount;

        // Fetch Store Settings
        const { data: settings } = await supabase
            .from('store_settings')
            .select('*')
            .single();

        // 1. Send Customer Confirmation Email
        try {
            await resend.emails.send({
                from: "Doree <orders@doree.in>",
                to: [order.shipping_address.email],
                subject: `Order Confirmation #${orderId.slice(0, 8)}`,
                react: OrderConfirmationEmail({
                    orderId: order.id,
                    customerName: `${order.shipping_address.firstName} ${order.shipping_address.lastName}`,
                    items: order.items,
                    subtotal,
                    discount,
                    shipping,
                    total,
                    shippingAddress: {
                        address: order.shipping_address.address,
                        city: order.shipping_address.city,
                        state: order.shipping_address.state,
                        zip: order.shipping_address.zip,
                    },
                }),
            });
        } catch (error) {
            console.error("Failed to send customer email:", error);
            // Don't error out, keep trying to send admin email
        }

        // 2. Send Admin Notification (if enabled)
        if (settings?.notifications?.orderConfirmation && settings?.general?.storeEmail) {
            try {
                await resend.emails.send({
                    from: "Doree Admin <orders@doree.in>",
                    to: [settings.general.storeEmail],
                    subject: `New Order! #${orderId.slice(0, 8)} - ₹${total}`,
                    react: AdminNewOrderEmail({
                        orderId: order.id,
                        customerName: `${order.shipping_address.firstName} ${order.shipping_address.lastName}`,
                        customerEmail: order.shipping_address.email,
                        items: order.items,
                        subtotal,
                        discount,
                        shipping,
                        total,
                        shippingAddress: {
                            address: order.shipping_address.address,
                            city: order.shipping_address.city,
                            state: order.shipping_address.state,
                            zip: order.shipping_address.zip,
                        },
                    }),
                });
            } catch (error) {
                console.error("Failed to send admin notification:", error);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
