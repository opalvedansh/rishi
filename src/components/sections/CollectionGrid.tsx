"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { cn } from "@/lib/utils";
import { getProducts } from "@/lib/supabase/products";

interface Collection {
    title: string;
    image: string;
    count: number;
    slug: string;
    size: "large" | "small";
}

const defaultCollections: Collection[] = [
    {
        title: "Trousers",
        image: "/assets/IMG_2258.PNG",
        count: 0,
        slug: "trousers",
        size: "large",
    },
    {
        title: "Knitwear",
        image: "/assets/IMG_2363.PNG",
        count: 0,
        slug: "knitwear",
        size: "small",
    },
    {
        title: "Outerwear",
        image: "/assets/IMG_2176.PNG",
        count: 0,
        slug: "outerwear",
        size: "small",
    },
];

const CollectionGrid = () => {
    const [collections, setCollections] = useState<Collection[]>(defaultCollections);

    useEffect(() => {
        async function loadCollectionCounts() {
            try {
                const products = await getProducts();

                // Count products by category
                const categoryCounts: Record<string, number> = {};
                products.forEach(product => {
                    const category = product.category?.toLowerCase() || 'other';
                    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
                });

                // Update collection counts
                setCollections(prev => prev.map(collection => ({
                    ...collection,
                    count: categoryCounts[collection.slug] || 0,
                })));
            } catch (error) {
                console.error("Error loading collection counts:", error);
            }
        }

        loadCollectionCounts();
    }, []);

    return (
        <section className="py-24 bg-white">
            <Container>
                <FadeIn>
                    <div className="text-center mb-16">
                        <h2 className="font-display text-4xl md:text-5xl mb-4 text-[var(--color-heading-text)]">Curated Collections</h2>
                        <p className="text-neutral-500 font-light text-lg">Essentials for the modern wardrobe.</p>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[400px]">
                    {collections.map((collection, index) => (
                        <div
                            key={collection.title}
                            className={cn(
                                "relative group overflow-hidden",
                                collection.size === "large" ? "md:col-span-6 md:row-span-2" : "md:col-span-6 md:row-span-1"
                            )}
                        >
                            <FadeIn delay={index * 0.1} fullWidth className="h-full">
                                <Link
                                    href={`/products?category=${collection.slug}`}
                                    className="block w-full h-full relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-neutral-100 transition-transform duration-700 group-hover:scale-105">
                                        <Image
                                            src={collection.image}
                                            alt={collection.title}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                                    <div className="absolute bottom-0 left-0 p-8 text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <h3 className="font-display text-3xl font-medium mb-1 tracking-wide">
                                            {collection.title}
                                        </h3>
                                        <p className="text-white/80 text-sm uppercase tracking-widest font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                            {collection.count} Products
                                        </p>
                                    </div>
                                </Link>
                            </FadeIn>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default CollectionGrid;
