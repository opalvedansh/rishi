"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Plus, Check, PackageX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/data/products";
import { useShop } from "@/context/ShopContext";
import { useState } from "react";

interface ProductCardProps {
    product: Product;
    className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
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
        <div className={cn("group block relative", className)}>
            <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 mb-4 cursor-pointer">
                {/* Tag ID */}
                {product.tag && inStock && (
                    <span className="absolute top-0 left-0 z-10 bg-black text-white text-[10px] uppercase font-medium px-3 py-1.5 tracking-wider">
                        {product.tag}
                    </span>
                )}

                {/* Out of Stock Badge */}
                {!inStock && (
                    <span className="absolute top-0 left-0 z-10 bg-red-500 text-white text-[10px] uppercase font-semibold px-3 py-1.5 tracking-wider flex items-center gap-1">
                        <PackageX className="w-3 h-3" />
                        Out of Stock
                    </span>
                )}

                {/* Wishlist Button */}
                <button
                    onClick={handleWishlist}
                    className={cn(
                        "absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-300 transform",
                        isLiked
                            ? "bg-white text-red-500 opacity-100"
                            : "bg-white/50 text-black/50 hover:bg-white hover:text-black opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                    )}
                >
                    <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                </button>

                <Link href={`/products/${product.handle}`} className="block w-full h-full">
                    {/* Main Image */}
                    <div className="absolute inset-0 bg-neutral-200 transition-transform duration-700 ease-out group-hover:scale-105">
                        <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    </div>

                    {/* Overlay on hover */}
                    <div className={cn(
                        "absolute inset-0 transition-colors duration-500",
                        !inStock
                            ? "bg-black/20"
                            : "bg-black/0 group-hover:bg-black/5"
                    )} />
                </Link>

                {/* "Quick Add" Circle Button on Hover */}
                {inStock && (
                    <button
                        onClick={handleQuickAdd}
                        disabled={isAdding}
                        className={cn(
                            "absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 delay-100",
                            isAdding
                                ? "bg-black text-white opacity-100 translate-y-0"
                                : "bg-white text-black opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-black hover:text-white"
                        )}
                    >
                        {isAdding ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                    </button>
                )}
            </div>

            <div className="flex flex-col items-start px-1">
                <h3 className="font-display text-lg mb-1 group-hover:underline decoration-1 underline-offset-4 decoration-neutral-400">
                    <Link href={`/products/${product.handle}`}>
                        {product.title}
                    </Link>
                </h3>

                <div className="flex items-center gap-3 text-sm font-medium">
                    <span className="text-neutral-900">
                        ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                        <span className="text-neutral-400 line-through text-xs">₹{product.originalPrice.toLocaleString()}</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
