"use client";

import { useState, useEffect, useRef } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { searchProducts, Product, getProducts } from "@/lib/supabase/products";
import Container from "@/components/ui/Container";
import { cn } from "@/lib/utils";

interface SearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

    // Fetch trending products on mount
    useEffect(() => {
        const fetchTrending = async () => {
            const allProducts = await getProducts();
            setTrendingProducts(allProducts.slice(0, 3));
        };
        fetchTrending();
    }, []);

    // Auto-focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            setQuery(""); // Reset on close
            setSelectedIndex(-1);
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Filter products based on query
    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults([]);
                return;
            }

            const searchResults = await searchProducts(query);
            setResults(searchResults);
            setSelectedIndex(-1);
        };

        const timeoutId = setTimeout(fetchResults, 300); // Debounce
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Keyboard Navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            } else if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === "Enter") {
                if (selectedIndex >= 0 && results[selectedIndex]) {
                    onClose();
                    router.push(`/products/${results[selectedIndex].handle}`);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, results, selectedIndex, onClose, router]);

    // Highlight match helper
    const highlightMatch = (text: string, highlight: string) => {
        if (!highlight.trim()) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return (
            <span>
                {parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ?
                        <span key={i} className="bg-yellow-200 text-black">{part}</span> : part
                )}
            </span>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] bg-whiteAsync text-black bg-white"
                >
                    {/* Header with Input */}
                    <div className="border-b border-neutral-100">
                        <Container>
                            <div className="h-24 flex items-center justify-between gap-4">
                                <Search className="w-6 h-6 text-neutral-400" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search products..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-1 h-full text-2xl md:text-3xl font-display outline-none placeholder:text-neutral-300 bg-transparent"
                                />
                                <button
                                    onClick={onClose}
                                    className="p-2 -mr-2 hover:bg-neutral-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                        </Container>
                    </div>

                    {/* Results Area */}
                    <div className="overflow-y-auto h-[calc(100vh-6rem)]">
                        <Container className="py-12">
                            {query && results.length === 0 ? (
                                <div className="text-center text-neutral-400 mt-12">
                                    <p className="text-lg">No results found for "{query}"</p>
                                    <p className="text-sm mt-2">Try checking your spelling or using different keywords.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Active Results */}
                                    {results.length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {results.map((product, index) => (
                                                <Link
                                                    key={product.id}
                                                    href={`/products/${product.handle}`}
                                                    onClick={onClose}
                                                    className={cn(
                                                        "group flex gap-4 items-start p-2 rounded-xl transition-colors",
                                                        selectedIndex === index ? "bg-neutral-50" : "hover:bg-neutral-50"
                                                    )}
                                                >
                                                    <div className="relative w-20 h-24 bg-neutral-100 flex-shrink-0 rounded-md overflow-hidden">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-display text-lg mb-1 group-hover:underline decoration-1 underline-offset-4">
                                                            {highlightMatch(product.title, query)}
                                                        </h3>
                                                        <p className="text-sm text-neutral-500 mb-1">
                                                            {product.category}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-sm font-medium">
                                                            <span>₹{product.price.toLocaleString()}</span>
                                                            <ArrowRight className={cn(
                                                                "w-4 h-4 transition-all duration-300",
                                                                selectedIndex === index
                                                                    ? "opacity-100 translate-x-0"
                                                                    : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                                                            )} />
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}

                                    {/* Trending / No Query State */}
                                    {!query && (
                                        <div className="space-y-12">
                                            {/* Trending Section */}
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Trending Now</p>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {trendingProducts.map((product) => (
                                                        <Link
                                                            key={product.id}
                                                            href={`/products/${product.handle}`}
                                                            onClick={onClose}
                                                            className="group flex items-center gap-4 p-4 border border-neutral-100 rounded-lg hover:border-black transition-colors"
                                                        >
                                                            <div className="relative w-16 h-16 bg-neutral-100 rounded-md overflow-hidden">
                                                                <Image
                                                                    src={product.image}
                                                                    alt={product.title}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            </div>
                                                            <div>
                                                                <p className="font-medium group-hover:underline">{product.title}</p>
                                                                <p className="text-sm text-neutral-500">₹{product.price.toLocaleString()}</p>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Popular Keywords */}
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6">Popular Searches</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {["Knitwear", "Linen", "Summer", "Casual", "Accessories"].map(term => (
                                                        <button
                                                            key={term}
                                                            onClick={() => setQuery(term)}
                                                            className="px-4 py-2 border border-neutral-200 rounded-full text-sm hover:border-black hover:bg-black hover:text-white transition-all"
                                                        >
                                                            {term}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </Container>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
