"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface ProductFilterSidebarProps {
    filters: {
        category: string;
        minPrice: number;
        maxPrice: number;
        sizes: string[];
        colors: string[];
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        category: string;
        minPrice: number;
        maxPrice: number;
        sizes: string[];
        colors: string[];
    }>>;
    className?: string;
}

const CATEGORIES = ["All", "Knitwear", "Trousers", "Shirts", "Accessories"];
const SIZES = ["S", "M", "L", "XL", "XS", "30", "32", "34", "36"];
const COLORS = ["Navy", "Black", "Grey", "Cream", "Beige", "White", "Blue", "Brown", "Khaki"];
const PRICE_RANGE = { min: 0, max: 10000 };

export default function ProductFilterSidebar({ filters, setFilters, className }: ProductFilterSidebarProps) {
    const [openSections, setOpenSections] = useState({
        category: true,
        price: true,
        size: true,
        color: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleCategoryChange = (cat: string) => {
        setFilters(prev => ({ ...prev, category: cat }));
    };

    const handleSizeToggle = (size: string) => {
        setFilters(prev => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes: newSizes };
        });
    };

    const handleColorToggle = (color: string) => {
        setFilters(prev => {
            const newColors = prev.colors.includes(color)
                ? prev.colors.filter(c => c !== color)
                : [...prev.colors, color];
            return { ...prev, colors: newColors };
        });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: "min" | "max") => {
        const value = parseInt(e.target.value) || 0;
        setFilters(prev => ({
            ...prev,
            [type === "min" ? "minPrice" : "maxPrice"]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            category: "All",
            minPrice: 0,
            maxPrice: 10000,
            sizes: [],
            colors: [],
        });
    };

    return (
        <aside className={cn("w-full md:w-64 flex-shrink-0", className)}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl font-bold">Filters</h3>
                <button
                    onClick={clearFilters}
                    className="text-xs text-neutral-500 hover:text-black underline transition-colors"
                >
                    Clear All
                </button>
            </div>

            <div className="space-y-6">
                {/* Category Filter */}
                <div className="border-b border-neutral-100 pb-6">
                    <button
                        onClick={() => toggleSection("category")}
                        className="flex items-center justify-between w-full mb-4"
                    >
                        <span className="font-medium text-sm uppercase tracking-wider">Category</span>
                        {openSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                        {openSections.category && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <ul className="space-y-2">
                                    {CATEGORIES.map(cat => (
                                        <li key={cat}>
                                            <button
                                                onClick={() => handleCategoryChange(cat)}
                                                className={cn(
                                                    "text-sm transition-colors",
                                                    filters.category === cat ? "font-bold text-black" : "text-neutral-500 hover:text-neutral-800"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Price Filter */}
                <div className="border-b border-neutral-100 pb-6">
                    <button
                        onClick={() => toggleSection("price")}
                        className="flex items-center justify-between w-full mb-4"
                    >
                        <span className="font-medium text-sm uppercase tracking-wider">Price Range</span>
                        {openSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                        {openSections.price && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden space-y-4"
                            >
                                <div className="flex gap-4">
                                    <div>
                                        <label className="text-[10px] text-neutral-400 uppercase">Min</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">₹</span>
                                            <input
                                                type="number"
                                                value={filters.minPrice}
                                                onChange={(e) => handlePriceChange(e, "min")}
                                                className="w-full pl-6 py-2 border border-neutral-200 text-sm rounded-md focus:outline-none focus:border-black"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-neutral-400 uppercase">Max</label>
                                        <div className="relative">
                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm">₹</span>
                                            <input
                                                type="number"
                                                value={filters.maxPrice}
                                                onChange={(e) => handlePriceChange(e, "max")}
                                                className="w-full pl-6 py-2 border border-neutral-200 text-sm rounded-md focus:outline-none focus:border-black"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Size Filter */}
                <div className="border-b border-neutral-100 pb-6">
                    <button
                        onClick={() => toggleSection("size")}
                        className="flex items-center justify-between w-full mb-4"
                    >
                        <span className="font-medium text-sm uppercase tracking-wider">Size</span>
                        {openSections.size ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                        {openSections.size && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex flex-wrap gap-2">
                                    {SIZES.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeToggle(size)}
                                            className={cn(
                                                "w-10 h-10 flex items-center justify-center border text-xs font-medium transition-all",
                                                filters.sizes.includes(size)
                                                    ? "bg-black text-white border-black"
                                                    : "border-neutral-200 text-neutral-600 hover:border-black"
                                            )}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Color Filter */}
                <div className="pb-6">
                    <button
                        onClick={() => toggleSection("color")}
                        className="flex items-center justify-between w-full mb-4"
                    >
                        <span className="font-medium text-sm uppercase tracking-wider">Color</span>
                        {openSections.color ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                        {openSections.color && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2">
                                    {COLORS.map(color => (
                                        <div key={color} className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleColorToggle(color)}
                                                className="flex items-center gap-3 group"
                                            >
                                                <div className={cn(
                                                    "w-5 h-5 border border-neutral-300 rounded-full flex items-center justify-center transition-colors",
                                                    filters.colors.includes(color) ? "bg-black border-black" : "group-hover:border-neutral-500"
                                                )}>
                                                    {filters.colors.includes(color) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className={cn("text-sm transition-colors", filters.colors.includes(color) ? "text-black font-medium" : "text-neutral-600")}>
                                                    {color}
                                                </span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </aside>
    );
}
