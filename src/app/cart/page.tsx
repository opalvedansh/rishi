"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShieldCheck, Truck, Loader2 } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { cn } from "@/lib/utils";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const FREE_SHIPPING_THRESHOLD = 5000;

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login?redirect=/cart");
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotal;

    return (
        <div className="min-h-screen bg-white pt-32 pb-32">
            <Container>
                {/* Header Section */}
                <FadeIn>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-black/10 pb-8">
                        <div>
                            <h1 className="font-display text-5xl md:text-6xl text-[var(--color-heading-text)] mb-4">Your Bag</h1>
                            <p className="text-neutral-500 tracking-wide">
                                {cart.length} {cart.length === 1 ? 'Item' : 'Items'} in your cart
                            </p>
                        </div>
                        <div className="text-right hidden md:block">
                            <Link href="/products" className="text-sm font-bold uppercase tracking-widest hover:text-neutral-600 transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </FadeIn>

                {cart.length === 0 ? (
                    <FadeIn delay={0.1}>
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-24 h-24 rounded-full bg-neutral-50 flex items-center justify-center mb-6">
                                <Truck className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h2 className="font-display text-2xl mb-4">Your cart is empty</h2>
                            <p className="text-neutral-500 mb-8 max-w-md">
                                Looks like you haven't added anything to your bag. We have some amazing new arrivals waiting for you.
                            </p>
                            <Link
                                href="/products"
                                className="h-14 px-10 bg-black text-white flex items-center justify-center text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all duration-300"
                            >
                                Explore Collection
                            </Link>
                        </div>
                    </FadeIn>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                        {/* Cart Items List */}
                        <div className="flex-1">
                            {/* Free Shipping Progress */}
                            <FadeIn delay={0.1}>
                                <div className="mb-12 bg-neutral-50 p-6 rounded-sm">
                                    <div className="flex justify-between items-center mb-3 text-sm">
                                        <span className="font-medium">
                                            {remainingForFreeShipping > 0
                                                ? `Spend ₹${remainingForFreeShipping.toLocaleString()} more for free shipping`
                                                : "You've unlocked free shipping!"}
                                        </span>
                                        <span className="font-bold">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-black transition-all duration-1000 ease-out"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </FadeIn>

                            <div className="space-y-12">
                                {cart.map((item, index) => (
                                    <FadeIn key={`${item.id}-${item.selectedSize}`} delay={0.1 + (index * 0.05)}>
                                        <div className="flex gap-6 md:gap-10 group">
                                            {/* Product Image */}
                                            <Link href={`/products/${item.handle}`} className="relative w-32 h-40 md:w-40 md:h-52 bg-neutral-100 flex-shrink-0 overflow-hidden">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                />
                                            </Link>

                                            {/* Info */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <Link href={`/products/${item.handle}`} className="font-display text-xl md:text-2xl hover:text-neutral-600 transition-colors">
                                                            {item.title}
                                                        </Link>
                                                        <span className="font-medium text-lg hidden md:block">
                                                            ₹{(item.price * item.quantity).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-neutral-500 text-sm mb-4">Size: {item.selectedSize} | {item.category}</p>
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-6">
                                                        {/* Quantity Selector */}
                                                        <div className="flex items-center border border-neutral-200 h-10">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                                                disabled={item.quantity <= 1}
                                                                className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-50 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                                                className="w-10 h-full flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                                                            className="text-xs text-neutral-400 hover:text-red-600 underline underline-offset-4 transition-colors"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>

                                                    <span className="font-medium text-lg md:hidden">
                                                        ₹{(item.price * item.quantity).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="w-full lg:w-[400px] flex-shrink-0 mt-8 lg:mt-0">
                            <FadeIn delay={0.2}>
                                <div className="bg-neutral-50 p-8 lg:p-10 sticky top-32">
                                    <h2 className="font-display text-2xl mb-8">Order Summary</h2>

                                    <div className="space-y-4 mb-8 pb-8 border-b border-black/5">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-600">Subtotal</span>
                                            <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-600">Shipping</span>
                                            <span className="text-neutral-900 font-medium">
                                                {remainingForFreeShipping <= 0 ? "Free" : "Calculated at checkout"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-neutral-600">Tax</span>
                                            <span className="text-neutral-400 text-xs">Calculated at checkout</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-baseline mb-8">
                                        <span className="font-display text-xl">Total</span>
                                        <span className="font-display text-3xl">₹{cartTotal.toLocaleString()}</span>
                                    </div>

                                    <Link href="/checkout" className="w-full bg-black text-white h-16 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-900 transition-all flex items-center justify-center gap-4 group mb-6">
                                        <span>Proceed to Checkout</span>
                                        <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </Link>

                                    <div className="flex items-center justify-center gap-2 text-neutral-500 text-xs">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span>Secure Checkout</span>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                )}
            </Container>
        </div>
    );
}
