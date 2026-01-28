"use client";

import Container from "@/components/ui/Container";
import { useShop } from "@/context/ShopContext";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";
import { cn } from "@/lib/utils";

export default function WishlistPage() {
    const { wishlist, toggleWishlist, addToCart } = useShop();

    const handleMoveToBag = (product: any) => {
        addToCart(product, 1, product.sizes?.[0] || "M"); // Default to Medium for quick add
        toggleWishlist(product); // Remove from wishlist after adding
    };

    return (
        <div className="min-h-screen bg-white pt-32 pb-32">
            <Container>
                {/* Header Section */}
                <FadeIn>
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-black/10 pb-8">
                        <div>
                            <h1 className="font-display text-5xl md:text-6xl text-[var(--color-heading-text)] mb-4">My Wishlist</h1>
                            <p className="text-neutral-500 tracking-wide">
                                {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} saved for later
                            </p>
                        </div>
                        <div className="text-right hidden md:block">
                            <Link href="/products" className="text-sm font-bold uppercase tracking-widest hover:text-neutral-600 transition-colors">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </FadeIn>

                {wishlist.length === 0 ? (
                    <FadeIn delay={0.1}>
                        <div className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-24 h-24 rounded-full bg-neutral-50 flex items-center justify-center mb-6">
                                <ShoppingBag className="w-8 h-8 text-neutral-400" />
                            </div>
                            <h2 className="font-display text-2xl mb-4">Your wishlist is empty</h2>
                            <p className="text-neutral-500 mb-8 max-w-md">
                                Keep track of your favorite pieces here. Start exploring our latest collections to find something you love.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {wishlist.map((item, index) => (
                            <FadeIn key={item.id} delay={index * 0.05}>
                                <div className="group relative">
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => toggleWishlist(item)}
                                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-black hover:text-white"
                                        title="Remove from Wishlist"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>

                                    {/* Image */}
                                    <Link href={`/products/${item.handle}`} className="block relative aspect-[4/5] bg-neutral-100 overflow-hidden mb-6">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                        />

                                        {/* Quick Add Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleMoveToBag(item);
                                                }}
                                                className="w-full h-12 bg-white text-black font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-colors shadow-lg"
                                            >
                                                <span>Move to Bag</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </Link>

                                    {/* Info */}
                                    <div className="text-center">
                                        {item.tag && (
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2 block">{item.tag}</span>
                                        )}
                                        <h3 className="font-display text-xl mb-2">
                                            <Link href={`/products/${item.handle}`} className="hover:underline underline-offset-4 decoration-1">
                                                {item.title}
                                            </Link>
                                        </h3>
                                        <p className="font-medium text-neutral-900">₹{item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
