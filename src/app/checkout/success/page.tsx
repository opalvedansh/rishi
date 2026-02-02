"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, ShoppingBag, Truck, Package, Phone, MessageCircle } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { motion } from "framer-motion";
import { getOrderById, Order, CUSTOMER_CARE } from "@/lib/supabase/orders";
import Image from "next/image";

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        async function loadOrder() {
            if (orderId) {
                const orderData = await getOrderById(orderId);
                setOrder(orderData);
            }
        }
        loadOrder();
    }, [orderId]);

    const formatOrderId = (id: string) => {
        return `ORD-${id.slice(0, 6).toUpperCase()}`;
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center pt-24 pb-24">
            <Container>
                <div className="max-w-xl mx-auto text-center">
                    <FadeIn>
                        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                                className="w-24 h-24 bg-green-100 rounded-full absolute inset-0 animate-ping opacity-20"
                            />
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Check className="w-10 h-10 text-green-600" />
                            </motion.div>
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl mb-4 text-[var(--color-heading-text)]">Order Confirmed!</h1>
                        <p className="text-neutral-500 text-lg mb-8">
                            Thank you for your purchase. Your order <span className="text-black font-medium">#{order ? formatOrderId(order.id) : '...'}</span> has been successfully placed.
                        </p>

                        {/* Order Preview */}
                        {order && (
                            <div className="bg-neutral-50 p-6 rounded-xl mb-8 text-left">
                                <h3 className="font-medium mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Order Summary
                                </h3>
                                <div className="flex gap-4 mb-4">
                                    <div className="flex -space-x-3">
                                        {order.items.slice(0, 3).map((item, index) => (
                                            <div key={index} className="w-12 h-14 rounded-lg overflow-hidden border-2 border-white relative">
                                                <Image src={item.image} alt={item.title} fill className="object-cover" />
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="w-12 h-14 rounded-lg bg-neutral-200 border-2 border-white flex items-center justify-center text-xs font-bold">
                                                +{order.items.length - 3}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-neutral-600">
                                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                                        </p>
                                        <p className="font-bold">₹{order.amount.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-neutral-600">
                                    <p className="font-medium text-neutral-900">Delivering to:</p>
                                    <p>{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                                    <p>{order.shipping_address.address}, {order.shipping_address.city}</p>
                                </div>
                            </div>
                        )}

                        {/* What's Next */}
                        <div className="bg-neutral-50 p-6 rounded-xl mb-8 text-left">
                            <h3 className="font-medium mb-3">What happens next?</h3>
                            <ul className="text-sm text-neutral-600 space-y-3">
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                        <Check className="w-3 h-3 text-green-600" />
                                    </div>
                                    <span>You will receive an order confirmation email shortly.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <Package className="w-3 h-3 text-blue-600" />
                                    </div>
                                    <span>Our team will pack your order with care within 24-48 hours.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                        <Truck className="w-3 h-3 text-purple-600" />
                                    </div>
                                    <span>You'll get a shipping notification with tracking details once it's on the way!</span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            {order && (
                                <Link
                                    href={`/track-order?id=${order.id}`}
                                    className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                >
                                    <Truck className="w-4 h-4" />
                                    Track Order
                                </Link>
                            )}
                            <Link
                                href="/products"
                                className="bg-white border border-neutral-200 text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                Continue Shopping
                            </Link>
                        </div>

                        {/* Customer Support */}
                        <div className="bg-neutral-900 text-white p-6 rounded-xl text-left">
                            <h3 className="font-medium mb-2">Need Help?</h3>
                            <p className="text-sm text-neutral-400 mb-4">Our customer support team is here to assist you.</p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href={`tel:${CUSTOMER_CARE.phone}`}
                                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-sm transition-colors"
                                >
                                    <Phone className="w-4 h-4" />
                                    {CUSTOMER_CARE.phone}
                                </a>
                                <a
                                    href={`https://wa.me/${CUSTOMER_CARE.whatsapp.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-full text-sm transition-colors"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    WhatsApp
                                </a>
                            </div>
                            <p className="text-xs text-neutral-500 mt-3">{CUSTOMER_CARE.hours}</p>
                        </div>
                    </FadeIn>
                </div>
            </Container>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-neutral-200 border-t-black rounded-full animate-spin" />
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
