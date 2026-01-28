"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/data/products";
import FadeIn from "@/components/animations/FadeIn";
import { cn } from "@/lib/utils";

// Mock Data (same as before)
const products: Product[] = [
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
        image: "/assets/IMG_2204.PNG", // 2202 not found, using 2204
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

const tabs = ["Trending Now", "New Arrivals", "Best Sellers"];

const ProductTabs = () => {
    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <section className="py-24 bg-[#f8f6f3]"> {/* Slightly darker warm bg for contrast */}
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
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                                        activeTab === tab
                                            ? "bg-black text-white shadow-md"
                                            : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                                    )}
                                >
                                    {tab}
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
                        {products.map((product, index) => (
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
