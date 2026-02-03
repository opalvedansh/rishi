"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { getProducts, Product as DBProduct } from "@/lib/supabase/products";
import { getContent } from "@/lib/supabase/content";

const FEATURED_PROMO_KEY = "featured_promotion_products";

interface FeaturedPromoItem {
    productId: string;
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    discount: string;
}

interface DisplayProduct {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    handle: string;
    price: number;
    badge?: string;
    discount?: string;
}

// Fallback data when localStorage is empty
const fallbackProducts: DisplayProduct[] = [
    {
        title: "Winter Collection",
        subtitle: "Limited Edition",
        description: "Discover our exclusive winter essentials, crafted with premium materials for warmth and timeless style.",
        image: "/assets/IMG_2363.PNG",
        handle: "merino-turtle-neck",
        price: 4200,
        badge: "Limited Edition",
        discount: "30% OFF",
    },
    {
        title: "The Oxford Heritage",
        subtitle: "Timeless Knitwear",
        description: "A classic reborn. Premium wool with a textured weave that provides warmth without bulk. Perfect for layering.",
        image: "/assets/IMG_2355.PNG",
        handle: "oxford-heritage-knit",
        price: 3499,
        badge: "New Arrival",
    },
    {
        title: "Cambridge Cable-Knit",
        subtitle: "Luxury Comfort",
        description: "Crafted from a luxurious blend of wool and cashmere. The intricate cable pattern adds texture and sophistication.",
        image: "/assets/IMG_2204.PNG",
        handle: "cambridge-cable-knit",
        price: 2999,
        badge: "Best Seller",
        discount: "Save ₹1,500",
    },
];

const FeaturedPromotion = () => {
    const [products, setProducts] = useState<DisplayProduct[]>(fallbackProducts);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadPromoProducts() {
            try {
                const savedPromo = await getContent<FeaturedPromoItem[]>(FEATURED_PROMO_KEY);

                if (savedPromo) {
                    const promoItems = savedPromo;

                    // Check if any products are selected
                    const hasSelectedProducts = promoItems.some(item => item.productId);

                    if (hasSelectedProducts) {
                        // Fetch all products from database
                        const allProducts = await getProducts();

                        // Build display products from saved config
                        const displayProducts: DisplayProduct[] = promoItems
                            .map(item => {
                                const dbProduct = allProducts.find(p => p.id === item.productId);
                                if (!dbProduct) return null;

                                const result: DisplayProduct = {
                                    title: item.title || dbProduct.title,
                                    subtitle: item.subtitle,
                                    description: item.description || dbProduct.description || '',
                                    image: dbProduct.image,
                                    handle: dbProduct.handle,
                                    price: dbProduct.price,
                                    badge: item.badge || undefined,
                                    discount: item.discount || undefined,
                                };
                                return result;
                            })
                            .filter((p): p is DisplayProduct => p !== null);

                        if (displayProducts.length > 0) {
                            setProducts(displayProducts);
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading promo products:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadPromoProducts();
    }, []);

    return (
        <section className="py-24 bg-white overflow-hidden">
            <Container>
                <div className="space-y-32">
                    {products.map((product, index) => {
                        const isReversed = index % 2 === 1;

                        return (
                            <div
                                key={product.handle}
                                className={`grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center`}
                                style={{ direction: isReversed ? "rtl" : "ltr" }}
                            >
                                {/* Image */}
                                <FadeIn direction={isReversed ? "right" : "left"} delay={0.1}>
                                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl" style={{ direction: "ltr" }}>
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            fill
                                            className="object-cover transition-transform duration-700 hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                </FadeIn>

                                {/* Text Content */}
                                <FadeIn direction={isReversed ? "left" : "right"} delay={0.2}>
                                    <div className="space-y-6" style={{ direction: "ltr" }}>
                                        {product.badge && (
                                            <span className="inline-block px-4 py-1.5 bg-neutral-100 rounded-full text-xs uppercase tracking-widest text-neutral-600">
                                                {product.badge}
                                            </span>
                                        )}
                                        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight text-neutral-900">
                                            {product.title}
                                        </h2>
                                        <p className="text-neutral-500 text-lg max-w-md font-light leading-relaxed">
                                            {product.description}
                                        </p>

                                        {/* Product Info Box */}
                                        <div className="bg-neutral-50 rounded-xl p-6 border border-neutral-100 max-w-md">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs uppercase tracking-widest text-neutral-400">
                                                    {product.subtitle}
                                                </span>
                                                <span className="font-display text-2xl text-neutral-900">
                                                    ₹{product.price.toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-sm text-neutral-500 mb-4">
                                                Crafted with care • Free shipping over ₹2,000
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <Link
                                                    href={`/products/${product.handle}`}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 bg-black text-white px-6 py-3 font-bold uppercase tracking-wide text-sm hover:bg-neutral-800 transition-colors rounded-lg"
                                                >
                                                    View Details
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                    </svg>
                                                </Link>
                                                {product.discount && (
                                                    <span className="text-lg font-display text-amber-500 whitespace-nowrap">
                                                        {product.discount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </FadeIn>
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
};

export default FeaturedPromotion;
