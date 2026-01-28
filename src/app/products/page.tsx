"use client";

import { useState, useMemo } from "react";
import Container from "@/components/ui/Container";
import ProductCard from "@/components/ui/ProductCard";
import FadeIn from "@/components/animations/FadeIn";
import { products } from "@/data/products";
import ProductFilterSidebar from "@/components/products/ProductFilterSidebar";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

import CustomSelect from "@/components/ui/CustomSelect";

export default function ShopPage() {
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [sortOption, setSortOption] = useState("newest");
    const [filters, setFilters] = useState<{
        category: string;
        minPrice: number;
        maxPrice: number;
        sizes: string[];
        colors: string[];
    }>({
        category: "All",
        minPrice: 0,
        maxPrice: 10000,
        sizes: [],
        colors: [],
    });

    const filteredAndSortedProducts = useMemo(() => {
        let result = products;

        // 1. Filter by Category
        if (filters.category !== "All") {
            result = result.filter(p => p.category === filters.category);
        }

        // 2. Filter by Price
        result = result.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);

        // 3. Filter by Size
        if (filters.sizes.length > 0) {
            result = result.filter(p => p.sizes?.some(s => filters.sizes.includes(s)));
        }

        // 4. Filter by Color
        if (filters.colors.length > 0) {
            result = result.filter(p => p.colors?.some(c => filters.colors.includes(c)));
        }

        // 5. Sort
        if (sortOption === "price-asc") {
            result = [...result].sort((a, b) => a.price - b.price);
        } else if (sortOption === "price-desc") {
            result = [...result].sort((a, b) => b.price - a.price);
        } else if (sortOption === "newest") {
            // Assuming higher ID is newer for now, or just default order
            // In real app, use createdAt date. Here we can use ID reverse or just keep initial order as "newest" mock
            result = result;
        }

        return result;
    }, [filters, sortOption]);

    return (
        <div className="bg-white min-h-screen pt-24 md:pt-32 pb-24">
            <Container>
                {/* Header */}
                <div className="flex flex-col gap-8 mb-16">
                    <FadeIn>
                        <h1 className="font-display text-5xl md:text-7xl text-[var(--color-heading-text)] tracking-tight">Shop</h1>
                    </FadeIn>

                    <FadeIn delay={0.1}>
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-black/5 pb-6">
                            <p className="text-neutral-500 text-sm tracking-wide">
                                Showing {filteredAndSortedProducts.length} results
                            </p>

                            <div className="flex items-center gap-6">
                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                                    className="md:hidden flex items-center gap-2 text-sm font-medium uppercase tracking-widest"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                </button>

                                {/* Sort Dropdown */}
                                <div className="flex items-center gap-3">
                                    <span className="hidden md:block text-sm text-neutral-400 uppercase tracking-widest">Sort By</span>
                                    <CustomSelect
                                        value={sortOption}
                                        onChange={setSortOption}
                                        className="w-48"
                                        options={[
                                            { label: "Newest Arrivals", value: "newest" },
                                            { label: "Price: Low to High", value: "price-asc" },
                                            { label: "Price: High to Low", value: "price-desc" },
                                        ]}
                                    />
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>

                <div className="flex flex-col md:flex-row gap-16 relative">
                    {/* Desktop Sidebar */}
                    <div className="hidden md:block">
                        <FadeIn delay={0.2}>
                            <ProductFilterSidebar filters={filters} setFilters={setFilters} />
                        </FadeIn>
                    </div>

                    {/* Mobile Filter Drawer (Simple expansion for now) */}
                    <AnimatePresence>
                        {isMobileFiltersOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden overflow-hidden w-full"
                            >
                                <ProductFilterSidebar filters={filters} setFilters={setFilters} className="mb-8" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {filteredAndSortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                {filteredAndSortedProducts.map((product, index) => (
                                    <FadeIn key={product.id} delay={index * 0.05} amount={0.1}>
                                        <ProductCard product={product} />
                                    </FadeIn>
                                ))}
                            </div>
                        ) : (
                            <FadeIn>
                                <div className="text-center py-20 bg-neutral-50 rounded-lg">
                                    <p className="text-neutral-500 mb-4">No products match your filters.</p>
                                    <button
                                        onClick={() => setFilters({
                                            category: "All",
                                            minPrice: 0,
                                            maxPrice: 10000,
                                            sizes: [],
                                            colors: [],
                                        })}
                                        className="text-black underline hover:opacity-70 transition-opacity"
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            </FadeIn>
                        )}
                    </div>
                </div>
            </Container>
        </div>
    );
}
