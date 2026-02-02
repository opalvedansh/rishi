"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Plus, Check, PackageX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
    className?: string;
    index?: number;
}

const ProductCard = ({ product, className, index = 0 }: ProductCardProps) => {
    const { addToCart, toggleWishlist, isInWishlist } = useShop();
    const [isAdding, setIsAdding] = useState(false);

    // Safety check for product existence
    if (!product) return null;

    const isLiked = isInWishlist(product.id || "");
    const inStock = product.in_stock ?? true;

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!inStock) return;

        setIsAdding(true);
        // Default to first size or "M"
        addToCart(product, 1, product.sizes?.[0] || "M");

        // Show success state briefly
        setTimeout(() => {
            setIsAdding(false);
        }, 1500);
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={cn("group block relative", className)}
        >
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4 cursor-pointer rounded-sm">
                {/* Tag ID */}
                {product.tag && inStock && (
                    <span className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm text-black text-[10px] uppercase font-bold px-2 py-1 tracking-wider shadow-sm">
                        {product.tag}
                    </span>
                )}

                {/* Out of Stock Badge */}
                {!inStock && (
                    <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                        <span className="bg-black text-white text-[10px] uppercase font-bold px-3 py-1.5 tracking-wider flex items-center gap-1">
                            <PackageX className="w-3 h-3" />
                            Sold Out
                        </span>
                    </div>
                )}

                {/* Discount Badge */}
                {inStock && product.originalPrice && product.originalPrice > product.price && (
                    <span className="absolute top-2 right-2 left-auto z-10 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 tracking-wider shadow-sm rounded-sm">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={cn(
                        "absolute top-2 right-2 z-20 p-2 rounded-full transition-all duration-300 transform shadow-sm",
                        isLiked
                            ? "bg-white text-red-500 opacity-100"
                            : "bg-white/70 backdrop-blur-sm text-black hover:bg-white hover:scale-110 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-x-4 lg:group-hover:translate-x-0"
                    )}
                >
                    <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
                </button>

                <Link href={`/products/${product.handle}`} className="block w-full h-full">
                    {/* Main Image */}
                    <div className="absolute inset-0 bg-neutral-200 lg:group-hover:scale-105 transition-transform duration-700 ease-out">
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    </div>
                </Link>

                {/* Quick Add Button - Floating FAB on Mobile, Hover on Desktop */}
                {inStock && (
                    <button
                        onClick={handleQuickAdd}
                        disabled={isAdding}
                        className={cn(
                            "absolute bottom-3 right-3 z-20 w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300",
                            isAdding
                                ? "bg-black text-white"
                                : "bg-white text-black hover:bg-black hover:text-white",
                            // Desktop: hidden initially, show on hover. Mobile: Always visible.
                            "opacity-100 lg:opacity-0 lg:translate-y-4 lg:group-hover:opacity-100 lg:group-hover:translate-y-0"
                        )}
                    >
                        {isAdding ? <Check className="w-4 h-4 lg:w-5 lg:h-5" /> : <Plus className="w-4 h-4 lg:w-5 lg:h-5" />}
                    </button>
                )}
            </div>

            <div className="flex flex-col items-start px-0.5">
                <h3 className="font-display text-base lg:text-lg mb-1 lg:group-hover:underline decoration-1 underline-offset-4 decoration-neutral-400 leading-tight">
                    <Link href={`/products/${product.handle}`}>
                        {product.title}
                    </Link>
                </h3>

                <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-black">
                        ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                        <span className="text-neutral-400 line-through text-xs">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[10px] font-bold text-green-600">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
