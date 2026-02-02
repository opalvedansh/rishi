"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import OrderTracking from "@/components/orders/OrderTracking";
import { getOrderById, Order } from "@/lib/supabase/orders";
import { Loader2, ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function TrackOrderContent() {
    const { user, isLoading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadOrder() {
            if (!orderId) {
                setError("No order ID provided");
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            const orderData = await getOrderById(orderId);

            if (!orderData) {
                setError("Order not found");
            } else if (user && orderData.user_id !== user.id) {
                setError("You don't have permission to view this order");
            } else {
                setOrder(orderData);
            }

            setIsLoading(false);
        }

        if (!authLoading) {
            loadOrder();
        }
    }, [orderId, user, authLoading]);

    const formatOrderId = (id: string) => {
        return `#ORD-${id.slice(0, 6).toUpperCase()}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const totalItemCount = (order: Order) => order.items.reduce((sum, item) => sum + item.quantity, 0);

    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-neutral-50 pt-28 pb-32">
                <Container>
                    <FadeIn>
                        <div className="max-w-lg mx-auto text-center">
                            <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package className="w-10 h-10 text-neutral-300" />
                            </div>
                            <h1 className="font-display text-2xl font-bold mb-3">Order Not Found</h1>
                            <p className="text-neutral-500 mb-8">{error || "We couldn't find this order. Please check the order ID and try again."}</p>
                            <Link
                                href="/account"
                                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-800 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Go to My Account
                            </Link>
                        </div>
                    </FadeIn>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pt-28 pb-32">
            <Container>
                <FadeIn>
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Link
                            href="/account"
                            className="w-10 h-10 bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:bg-neutral-50 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <h1 className="font-display text-2xl font-bold">Track Order</h1>
                            <p className="text-neutral-500 text-sm">{formatOrderId(order.id)} • Placed on {formatDate(order.created_at)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Tracking Section */}
                        <div className="lg:col-span-2">
                            <OrderTracking order={order} />
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="space-y-6">
                            {/* Order Items */}
                            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                                <h3 className="font-display font-bold text-lg mb-4">
                                    Order Items ({totalItemCount(order)})
                                </h3>
                                <div className="space-y-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="w-16 h-20 bg-neutral-100 rounded-lg relative overflow-hidden flex-shrink-0">
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm truncate">{item.title}</p>
                                                <p className="text-xs text-neutral-500 mt-0.5">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                                                <p className="font-bold text-sm mt-2">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-neutral-100 mt-4 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total</span>
                                        <span className="font-bold text-lg">₹{order.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                                <h3 className="font-display font-bold text-lg mb-4">Delivery Address</h3>
                                <div className="text-sm text-neutral-600 space-y-1">
                                    <p className="font-medium text-neutral-900">
                                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                                    </p>
                                    <p>{order.shipping_address.address}</p>
                                    <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                                    <p className="pt-2">{order.shipping_address.phone}</p>
                                    <p>{order.shipping_address.email}</p>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                                <h3 className="font-display font-bold text-lg mb-4">Payment Details</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Payment Status</span>
                                        <span className={`font-medium capitalize ${order.payment_status === 'paid' ? 'text-green-600' :
                                                order.payment_status === 'failed' ? 'text-red-600' :
                                                    'text-yellow-600'
                                            }`}>
                                            {order.payment_status}
                                        </span>
                                    </div>
                                    {order.razorpay_payment_id && (
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Payment ID</span>
                                            <span className="font-mono text-xs">{order.razorpay_payment_id}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Order ID</span>
                                        <span className="font-mono text-xs">{order.razorpay_order_id}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </Container>
        </div>
    );
}

export default function TrackOrderPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        }>
            <TrackOrderContent />
        </Suspense>
    );
}
