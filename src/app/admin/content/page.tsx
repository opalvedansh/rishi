"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Save, ImageIcon, Type, Star, Check, X, Loader2, Layout, ChevronDown, ChevronUp, TrendingUp, Sparkles, Award } from "lucide-react";
import { getProducts, Product } from "@/lib/supabase/products";
import { getContent, saveContent } from "@/lib/supabase/content";

const THE_EDIT_KEY = "the_edit_products";
const FEATURED_PROMO_KEY = "featured_promotion_products";
const HERO_CONTENT_KEY = "homepage_hero";
const ABOUT_STORY_KEY = "about_story";

interface TheEditConfig {
    trendingNow: string[];
    newArrivals: string[];
    bestSellers: string[];
}

interface FeaturedPromoItem {
    productId: string;
    title: string;
    subtitle: string;
    description: string;
    badge: string;
    discount: string;
}

const defaultEditConfig: TheEditConfig = {
    trendingNow: [],
    newArrivals: [],
    bestSellers: [],
};

const defaultPromoItems: FeaturedPromoItem[] = [
    { productId: "", title: "Winter Collection", subtitle: "Limited Edition", description: "Discover our exclusive winter essentials, crafted with premium materials for warmth and timeless style.", badge: "Limited Edition", discount: "30% OFF" },
    { productId: "", title: "The Oxford Heritage", subtitle: "Timeless Knitwear", description: "A classic reborn. Premium wool with a textured weave that provides warmth without bulk.", badge: "New Arrival", discount: "" },
    { productId: "", title: "Cambridge Cable-Knit", subtitle: "Luxury Comfort", description: "Crafted from a luxurious blend of wool and cashmere. The intricate cable pattern adds sophistication.", badge: "Best Seller", discount: "Save ₹1,500" },
];

const tabConfig = [
    { key: "trendingNow" as const, label: "Trending Now", icon: TrendingUp, color: "text-red-500", bgColor: "from-red-50 to-orange-50" },
    { key: "newArrivals" as const, label: "New Arrivals", icon: Sparkles, color: "text-blue-500", bgColor: "from-blue-50 to-cyan-50" },
    { key: "bestSellers" as const, label: "Best Sellers", icon: Award, color: "text-amber-500", bgColor: "from-amber-50 to-yellow-50" },
];

export default function AdminContentPage() {
    // Mock Content Blocks
    const [contentBlocks] = useState([
        {
            id: "hero-section",
            title: "Homepage Hero",
            type: "hero",
            data: {
                heading: "Timeless Elegance, Reimagined.",
                subheading: "Discover the new collection of premium essentials.",
                image: "/assets/hero-bg.jpg"
            }
        },
        {
            id: "about-story",
            title: "About - Our Story",
            type: "text",
            data: {
                heading: "Crafting with Passion",
                content: "We believe in the power of quality materials and expert craftsmanship..."
            }
        }
    ]);

    // Products state
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);

    // The Edit state (tab-based)
    const [editConfig, setEditConfig] = useState<TheEditConfig>(defaultEditConfig);
    const [activeEditTab, setActiveEditTab] = useState<keyof TheEditConfig>("trendingNow");
    const [savingEdit, setSavingEdit] = useState(false);

    // Featured Promotion state
    const [promoItems, setPromoItems] = useState<FeaturedPromoItem[]>(defaultPromoItems);
    const [savingPromo, setSavingPromo] = useState(false);
    const [expandedPromo, setExpandedPromo] = useState<number | null>(0);

    // Load products and saved data
    useEffect(() => {
        async function loadData() {
            setIsLoadingProducts(true);
            try {
                const products = await getProducts();
                setAllProducts(products);

                // Load The Edit config
                const savedEdit = await getContent<TheEditConfig>(THE_EDIT_KEY);
                if (savedEdit) {
                    // Validate IDs exist
                    const validated: TheEditConfig = {
                        trendingNow: (savedEdit.trendingNow || []).filter((id: string) => products.some(p => p.id === id)),
                        newArrivals: (savedEdit.newArrivals || []).filter((id: string) => products.some(p => p.id === id)),
                        bestSellers: (savedEdit.bestSellers || []).filter((id: string) => products.some(p => p.id === id)),
                    };
                    setEditConfig(validated);
                }

                // Load Featured Promotion
                const savedPromo = await getContent<FeaturedPromoItem[]>(FEATURED_PROMO_KEY);
                if (savedPromo) {
                    setPromoItems(savedPromo);
                }

                // Load Hero Content
                const savedHero = await getContent<any>(HERO_CONTENT_KEY);
                /* Note: We would need to update contentBlocks state here, but for simplicity
                   and to avoid massive state refactoring, we'll implement Hero editing properly 
                   when we touch the Hero component migration. For now ensuring these keys align. */

            } catch (error) {
                console.error("Error loading products:", error);
            } finally {
                setIsLoadingProducts(false);
            }
        }
        loadData();
    }, []);

    const handleSave = (id: string) => {
        alert(`Content for ${id} saved!`);
    };

    const toggleEditProduct = (productId: string) => {
        setEditConfig(prev => {
            const currentTab = prev[activeEditTab];
            if (currentTab.includes(productId)) {
                return { ...prev, [activeEditTab]: currentTab.filter(id => id !== productId) };
            } else if (currentTab.length < 4) {
                return { ...prev, [activeEditTab]: [...currentTab, productId] };
            }
            return prev;
        });
    };

    const saveEditConfig = async () => {
        setSavingEdit(true);
        try {
            await saveContent(THE_EDIT_KEY, editConfig);
            setTimeout(() => {
                setSavingEdit(false);
                alert("The Edit products saved! Refresh the homepage to see changes.");
            }, 500);
        } catch (error) {
            console.error("Error saving edit config:", error);
            setSavingEdit(false);
        }
    };

    const updatePromoItem = (index: number, field: keyof FeaturedPromoItem, value: string) => {
        setPromoItems(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const savePromoItems = async () => {
        setSavingPromo(true);
        try {
            await saveContent(FEATURED_PROMO_KEY, promoItems);
            setTimeout(() => {
                setSavingPromo(false);
                alert("Featured Promotion saved! Refresh the homepage to see changes.");
            }, 500);
        } catch (error) {
            console.error("Error saving promo items:", error);
            setSavingPromo(false);
        }
    };

    const getProductById = (id: string) => allProducts.find(p => p.id === id);
    const currentTabProducts = editConfig[activeEditTab];
    const currentTabConfig = tabConfig.find(t => t.key === activeEditTab)!;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-neutral-900">Content Management</h1>
                    <p className="text-neutral-500 mt-1">Edit website content, text, and images.</p>
                </div>
            </div>

            {/* The Edit Section - Tab Based */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50">
                    <h3 className="font-bold flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-500" />
                        The Edit
                        <span className="text-xs font-normal text-neutral-500 ml-2">
                            Homepage product tabs
                        </span>
                    </h3>
                    <button
                        onClick={saveEditConfig}
                        disabled={savingEdit}
                        className="text-xs font-bold uppercase tracking-wider text-green-600 hover:text-green-700 flex items-center gap-1 disabled:opacity-50"
                    >
                        {savingEdit ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Save
                    </button>
                </div>

                {/* Tab Buttons */}
                <div className="flex border-b border-neutral-100">
                    {tabConfig.map(tab => {
                        const Icon = tab.icon;
                        const isActive = activeEditTab === tab.key;
                        const count = editConfig[tab.key].length;

                        return (
                            <button
                                key={tab.key}
                                onClick={() => setActiveEditTab(tab.key)}
                                className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${isActive
                                    ? `bg-gradient-to-r ${tab.bgColor} ${tab.color} border-b-2 border-current`
                                    : "text-neutral-500 hover:bg-neutral-50"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/50" : "bg-neutral-100"}`}>
                                    {count}/4
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="p-6">
                    {/* Selected Products Preview */}
                    <div className="mb-6">
                        <label className="block text-xs font-bold uppercase text-neutral-500 mb-3 flex items-center gap-2">
                            <currentTabConfig.icon className={`w-3 h-3 ${currentTabConfig.color}`} />
                            {currentTabConfig.label} Products ({currentTabProducts.length}/4)
                        </label>
                        {currentTabProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {currentTabProducts.map((productId, index) => {
                                    const product = getProductById(productId);
                                    if (!product) return null;

                                    return (
                                        <div key={productId} className="relative bg-neutral-50 rounded-lg border border-neutral-200 overflow-hidden group">
                                            <div className="aspect-[3/4] relative">
                                                <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                <button
                                                    onClick={() => toggleEditProduct(productId)}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                                <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${activeEditTab === "trendingNow" ? "bg-red-500" :
                                                    activeEditTab === "newArrivals" ? "bg-blue-500" : "bg-amber-500"
                                                    }`}>
                                                    {index + 1}
                                                </div>
                                            </div>
                                            <div className="p-2">
                                                <p className="text-xs font-medium truncate">{product.title}</p>
                                                <p className="text-xs text-neutral-500">₹{product.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-neutral-50 rounded-lg border border-dashed border-neutral-300 p-8 text-center">
                                <currentTabConfig.icon className={`w-8 h-8 mx-auto mb-2 ${currentTabConfig.color} opacity-30`} />
                                <p className="text-neutral-500 text-sm">No products in {currentTabConfig.label}</p>
                                <p className="text-neutral-400 text-xs mt-1">Select products from below</p>
                            </div>
                        )}
                    </div>

                    {/* Product Selection Grid */}
                    <div>
                        <label className="block text-xs font-bold uppercase text-neutral-500 mb-3">
                            Available Products
                            {currentTabProducts.length >= 4 && <span className="text-amber-600 font-normal ml-2">(Max 4 reached)</span>}
                        </label>
                        {isLoadingProducts ? (
                            <div className="flex items-center justify-center h-32">
                                <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
                            </div>
                        ) : allProducts.length === 0 ? (
                            <div className="bg-neutral-50 rounded-lg border border-dashed border-neutral-300 p-8 text-center">
                                <p className="text-neutral-500 text-sm">No products in database</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-3 max-h-[300px] overflow-y-auto p-1">
                                {allProducts.map((product) => {
                                    const isSelected = currentTabProducts.includes(product.id);
                                    const canSelect = isSelected || currentTabProducts.length < 4;

                                    // Check if product is in other tabs
                                    const inOtherTabs = Object.entries(editConfig)
                                        .filter(([key]) => key !== activeEditTab)
                                        .some(([, ids]) => ids.includes(product.id));

                                    return (
                                        <button
                                            key={product.id}
                                            onClick={() => canSelect && toggleEditProduct(product.id)}
                                            disabled={!canSelect}
                                            className={`relative rounded-lg border-2 overflow-hidden transition-all ${isSelected
                                                ? `border-current ring-2 ${currentTabConfig.color}`
                                                : canSelect
                                                    ? "border-neutral-200 hover:border-neutral-400"
                                                    : "border-neutral-100 opacity-50 cursor-not-allowed"
                                                }`}
                                        >
                                            <div className="aspect-[3/4] relative">
                                                <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                {isSelected && (
                                                    <div className={`absolute inset-0 bg-current/20 flex items-center justify-center ${currentTabConfig.color}`}>
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${activeEditTab === "trendingNow" ? "bg-red-500" :
                                                            activeEditTab === "newArrivals" ? "bg-blue-500" : "bg-amber-500"
                                                            }`}>
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                                {inOtherTabs && !isSelected && (
                                                    <div className="absolute top-1 right-1 w-4 h-4 bg-neutral-500 rounded-full flex items-center justify-center">
                                                        <Check className="w-2.5 h-2.5 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-1.5 bg-white">
                                                <p className="text-[10px] font-medium truncate">{product.title}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Featured Promotion Section (Zigzag) */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
                    <h3 className="font-bold flex items-center gap-2">
                        <Layout className="w-4 h-4 text-purple-500" />
                        Featured Promotion (Zigzag)
                        <span className="text-xs font-normal text-neutral-500 ml-2">
                            3 product showcase with descriptions
                        </span>
                    </h3>
                    <button
                        onClick={savePromoItems}
                        disabled={savingPromo}
                        className="text-xs font-bold uppercase tracking-wider text-green-600 hover:text-green-700 flex items-center gap-1 disabled:opacity-50"
                    >
                        {savingPromo ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                        Save
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {promoItems.map((item, index) => {
                        const selectedProduct = getProductById(item.productId);
                        const isExpanded = expandedPromo === index;

                        return (
                            <div key={index} className="border border-neutral-200 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setExpandedPromo(isExpanded ? null : index)}
                                    className="w-full p-4 flex items-center justify-between bg-neutral-50 hover:bg-neutral-100 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                        </div>
                                        {selectedProduct ? (
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-16 relative rounded overflow-hidden">
                                                    <Image src={selectedProduct.image} alt={selectedProduct.title} fill className="object-cover" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="font-medium text-sm">{item.title || selectedProduct.title}</p>
                                                    <p className="text-xs text-neutral-500">{item.subtitle}</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-neutral-500 text-sm">No product selected</span>
                                        )}
                                    </div>
                                    {isExpanded ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                                </button>

                                {isExpanded && (
                                    <div className="p-4 border-t border-neutral-200 space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Select Product</label>
                                            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 max-h-[200px] overflow-y-auto">
                                                {allProducts.map((product) => (
                                                    <button
                                                        key={product.id}
                                                        onClick={() => updatePromoItem(index, 'productId', product.id)}
                                                        className={`relative rounded-lg border-2 overflow-hidden transition-all ${item.productId === product.id ? "border-purple-500 ring-2 ring-purple-200" : "border-neutral-200 hover:border-neutral-400"}`}
                                                    >
                                                        <div className="aspect-[3/4] relative">
                                                            <Image src={product.image} alt={product.title} fill className="object-cover" />
                                                            {item.productId === product.id && (
                                                                <div className="absolute inset-0 bg-purple-500/20 flex items-center justify-center">
                                                                    <Check className="w-4 h-4 text-purple-600" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Title</label>
                                                <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => updatePromoItem(index, 'title', e.target.value)}
                                                    placeholder="e.g. Winter Collection"
                                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Subtitle</label>
                                                <input
                                                    type="text"
                                                    value={item.subtitle}
                                                    onChange={(e) => updatePromoItem(index, 'subtitle', e.target.value)}
                                                    placeholder="e.g. Limited Edition"
                                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Badge</label>
                                                <input
                                                    type="text"
                                                    value={item.badge}
                                                    onChange={(e) => updatePromoItem(index, 'badge', e.target.value)}
                                                    placeholder="e.g. New Arrival"
                                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Discount Text</label>
                                                <input
                                                    type="text"
                                                    value={item.discount}
                                                    onChange={(e) => updatePromoItem(index, 'discount', e.target.value)}
                                                    placeholder="e.g. 30% OFF"
                                                    className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Description</label>
                                            <textarea
                                                value={item.description}
                                                onChange={(e) => updatePromoItem(index, 'description', e.target.value)}
                                                rows={3}
                                                placeholder="Describe the product..."
                                                className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-purple-500 resize-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Other Content Blocks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {contentBlocks.map((block) => (
                    <div key={block.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                            <h3 className="font-bold flex items-center gap-2">
                                {block.type === 'hero' && <ImageIcon className="w-4 h-4 text-blue-500" />}
                                {block.type === 'text' && <Type className="w-4 h-4 text-orange-500" />}
                                {block.title}
                            </h3>
                            <button
                                onClick={() => handleSave(block.id)}
                                className="text-xs font-bold uppercase tracking-wider text-green-600 hover:text-green-700 flex items-center gap-1"
                            >
                                <Save className="w-3 h-3" />
                                Save
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {block.data.image && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Background/Hero Image</label>
                                    <div className="aspect-video bg-neutral-100 rounded-lg relative overflow-hidden group border border-neutral-200">
                                        <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-bold">Change Image</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Heading</label>
                                <input
                                    type="text"
                                    defaultValue={block.data.heading}
                                    className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-colors font-display font-medium"
                                />
                            </div>
                            {block.data.subheading && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Subheading</label>
                                    <input
                                        type="text"
                                        defaultValue={block.data.subheading}
                                        className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                                    />
                                </div>
                            )}
                            {block.data.content && (
                                <div>
                                    <label className="block text-xs font-bold uppercase text-neutral-500 mb-2">Body Content</label>
                                    <textarea
                                        defaultValue={block.data.content}
                                        rows={4}
                                        className="w-full px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
