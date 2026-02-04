import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import OrderConfirmationEmail from "@/components/emails/OrderConfirmation";
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

        // Send Email
        const { data, error: emailError } = await resend.emails.send({
            from: "Doree <orders@doree.in>", // Use a verified domain if available, else 'onboarding@resend.dev' for testing
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

        if (emailError) {
            console.error("Error sending email via Resend:", emailError);
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
