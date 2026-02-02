"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/data/products";
import FadeIn from "@/components/animations/FadeIn";
import { cn } from "@/lib/utils";
import { getProducts, Product as DBProduct } from "@/lib/supabase/products";

const THE_EDIT_KEY = "theEditProducts";

interface TheEditConfig {
    trendingNow: string[];
    newArrivals: string[];
    bestSellers: string[];
}

// Fallback mock data (used when no products are configured)
const fallbackProducts: Product[] = [
    {
        id: "1",
        title: "The Oxford Heritage Knit",
        price: 3499,
        image: "/assets/IMG_2355.PNG",
        handle: "oxford-heritage-knit",
        tag: "New",
    },
    {
        id: "2",
        title: "Cambridge Cable-Knit",
        price: 2999,
        originalPrice: 4500,
        image: "/assets/IMG_2204.PNG",
        handle: "cambridge-cable-knit",
        tag: "Sale",
    },
    {
        id: "3",
        title: "Lucas Cotton Sweater",
        price: 3200,
        image: "/assets/IMG_2354.PNG",
        handle: "lucas-cotton-sweater",
    },
    {
        id: "4",
        title: "Alcott Fine-Gauge Crewneck",
        price: 2800,
        image: "/assets/IMG_2369.PNG",
        handle: "alcott-fine-gauge",
    },
];

type TabKey = "trendingNow" | "newArrivals" | "bestSellers";

const tabs: { key: TabKey; label: string }[] = [
    { key: "trendingNow", label: "Trending Now" },
    { key: "newArrivals", label: "New Arrivals" },
    { key: "bestSellers", label: "Best Sellers" },
];

// Transform DB product to frontend Product format
function transformToFrontend(dbProduct: DBProduct): Product {
    return {
        id: dbProduct.id,
        title: dbProduct.title,
        price: dbProduct.price,
        originalPrice: dbProduct.original_price,
        image: dbProduct.image,
        handle: dbProduct.handle,
        tag: dbProduct.tag,
        description: dbProduct.description,
        images: dbProduct.images,
        sizes: dbProduct.sizes,
        colors: dbProduct.colors,
        details: dbProduct.details,
        category: dbProduct.category,
        rating: dbProduct.rating,
        reviewCount: dbProduct.review_count,
    };
}

const ProductTabs = () => {
    const [activeTab, setActiveTab] = useState<TabKey>("trendingNow");
    const [tabProducts, setTabProducts] = useState<Record<TabKey, Product[]>>({
        trendingNow: fallbackProducts,
        newArrivals: fallbackProducts,
        bestSellers: fallbackProducts,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const savedConfig = localStorage.getItem(THE_EDIT_KEY);

                if (savedConfig) {
                    const config: TheEditConfig = JSON.parse(savedConfig);

                    // Check if any tab has products configured
                    const hasConfig = config.trendingNow.length > 0 ||
                        config.newArrivals.length > 0 ||
                        config.bestSellers.length > 0;

                    if (hasConfig) {
                        // Fetch all products from database
                        const allProducts = await getProducts();

                        // Build products for each tab
                        const newTabProducts: Record<TabKey, Product[]> = {
                            trendingNow: config.trendingNow
                                .map(id => allProducts.find(p => p.id === id))
                                .filter((p): p is DBProduct => p !== undefined)
                                .map(transformToFrontend),
                            newArrivals: config.newArrivals
                                .map(id => allProducts.find(p => p.id === id))
                                .filter((p): p is DBProduct => p !== undefined)
                                .map(transformToFrontend),
                            bestSellers: config.bestSellers
                                .map(id => allProducts.find(p => p.id === id))
                                .filter((p): p is DBProduct => p !== undefined)
                                .map(transformToFrontend),
                        };

                        // Use fallback for empty tabs
                        if (newTabProducts.trendingNow.length === 0) newTabProducts.trendingNow = fallbackProducts;
                        if (newTabProducts.newArrivals.length === 0) newTabProducts.newArrivals = fallbackProducts;
                        if (newTabProducts.bestSellers.length === 0) newTabProducts.bestSellers = fallbackProducts;

                        setTabProducts(newTabProducts);
                    }
                }
            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadProducts();
    }, []);

    const currentProducts = tabProducts[activeTab];

    return (
        <section className="py-24 bg-[#f8f6f3]">
            <Container>
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-16">
                    <FadeIn direction="right">
                        <div>
                            <h2 className="font-display text-4xl mb-2 text-[var(--color-heading-text)]">The Edit</h2>
                            <p className="text-neutral-500 font-light">Curated essentials for the modern lifestyle.</p>
                        </div>
                    </FadeIn>

                    <FadeIn direction="left" delay={0.2}>
                        <div className="flex gap-2 md:gap-4 mt-6 md:mt-0 bg-white p-1.5 rounded-full shadow-sm">
                            {tabs.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                                        activeTab === tab.key
                                            ? "bg-black text-white shadow-md"
                                            : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </FadeIn>
                </div>

                <div className="min-h-[500px]">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 md:gap-8"
                    >
                        {currentProducts.map((product, index) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                <div className="text-center mt-16">
                    <FadeIn direction="up" delay={0.4}>
                        <button className="group inline-flex items-center gap-2 border-b border-black pb-1 uppercase tracking-widest text-xs font-semibold hover:opacity-60 transition-opacity">
                            View All Products
                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </button>
                    </FadeIn>
                </div>
            </Container>
        </section>
    );
};

export default ProductTabs;
