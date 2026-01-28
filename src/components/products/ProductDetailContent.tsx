"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { Heart, Minus, Plus, Star, Check } from "lucide-react";
import { AccordionItem } from "@/components/ui/Accordion";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";
import SizeGuideModal from "@/components/ui/SizeGuideModal";

interface ProductDetailContentProps {
    product: Product;
    relatedProducts: Product[];
}

export default function ProductDetailContent({ product, relatedProducts }: ProductDetailContentProps) {
    const router = useRouter();
    const [selectedSize, setSelectedSize] = useState("M");
    const [quantity, setQuantity] = useState(1);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart, toggleWishlist, isInWishlist } = useShop();

    // Fallback/Default data if missing in product object
    const sizes = product.sizes || ["XS", "S", "M", "L", "XL"];
    const details = product.details || [
        "Premium Quality Material",
        "Expert Craftsmanship",
        "Designed for Comfort",
        "Machine Washable"
    ];
    const images = product.images && product.images.length > 0 ? product.images : [product.image, product.image, product.image];
    // Default rating if missing
    const rating = product.rating || 4.8;
    const reviewCount = product.reviewCount || 12;

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(product, quantity, selectedSize);
        setTimeout(() => setIsAdding(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity, selectedSize);
        router.push("/cart");
    };

    const isLiked = isInWishlist(product.id);

    return (
        <div className="bg-white min-h-screen pt-24 md:pt-32">
            <Container fluid className="px-0 md:px-0">
                <div className="flex flex-col lg:flex-row">
                    {/* Left: Image Gallery (Sticky) */}
                    <div className="w-full lg:w-3/5 lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto lg:no-scrollbar">
                        {/* Mobile Carousel (Horizontal Scroll) */}
                        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar md:hidden">
                            {images.map((img, i) => (
                                <div key={i} className="min-w-full flex-shrink-0 snap-start relative aspect-[3/4] bg-neutral-100">
                                    <Image
                                        src={img}
                                        alt={`${product.title} View ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={i === 0}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Desktop Grid (Vertical Stack) */}
                        <div className="hidden md:grid grid-cols-2 gap-1 lg:block lg:space-y-1">
                            {images.map((img, i) => (
                                <div key={i} className="relative aspect-[3/4] lg:aspect-[4/5] bg-neutral-100 w-full">
                                    <Image
                                        src={img}
                                        alt={`${product.title} View ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        priority={i === 0}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details (Scrollable) */}
                    <div className="w-full lg:w-2/5 px-6 md:px-12 py-12 lg:py-0 lg:pl-16 lg:pr-24">
                        <div className="lg:max-w-lg sticky top-32">
                            {/* Breadcrumbs */}
                            <FadeIn>
                                <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-6 uppercase tracking-wider font-medium">
                                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                                    <span>/</span>
                                    <Link href="/products" className="hover:text-black transition-colors">Shop</Link>
                                    <span>/</span>
                                    <span className="text-black line-clamp-1">{product.title}</span>
                                </nav>
                            </FadeIn>

                            <FadeIn delay={0.1}>
                                {product.tag && (
                                    <span className="block text-xs font-bold uppercase tracking-widest text-[#a67c52] mb-4">{product.tag}</span>
                                )}
                                <h1 className="font-display text-4xl md:text-5xl mb-2 leading-tight">{product.title}</h1>

                                {/* Rating Section */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex items-center text-[#a67c52]">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("w-4 h-4", i < Math.floor(rating) ? "fill-current" : "text-neutral-300")} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium text-neutral-500">
                                        ({reviewCount} Reviews)
                                    </span>
                                </div>

                                <p className="text-2xl font-medium mb-8">₹{product.price.toLocaleString()}</p>
                            </FadeIn>

                            <FadeIn delay={0.1}>
                                <p className="text-neutral-500 font-light leading-relaxed mb-8 text-lg">
                                    {product.description || "Experience luxury with this premium piece, crafted for the modern individual."}
                                </p>
                            </FadeIn>

                            {/* Size Selector */}
                            <FadeIn delay={0.2}>
                                <div className="mb-8">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold uppercase tracking-wide">Size</span>
                                        <button
                                            onClick={() => setIsSizeGuideOpen(true)}
                                            className="text-xs underline text-neutral-500 hover:text-black"
                                        >
                                            Size Guide
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={cn(
                                                    "w-12 h-12 flex items-center justify-center border transition-all duration-200",
                                                    selectedSize === size
                                                        ? "border-black bg-black text-white"
                                                        : "border-neutral-200 text-neutral-600 hover:border-black"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </FadeIn>

                            {/* Actions */}
                            <FadeIn delay={0.3}>
                                <div className="flex gap-4 mb-10">
                                    <div className="flex items-center border border-neutral-200 w-32 justify-between px-4 h-14">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-neutral-400 hover:text-black">
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="font-medium">{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)} className="text-neutral-400 hover:text-black">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleAddToCart}
                                        disabled={isAdding}
                                        className="flex-1 bg-black text-white h-14 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        {isAdding ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                <span>Added</span>
                                            </>
                                        ) : (
                                            "Add to Cart"
                                        )}
                                    </button>
                                    <button
                                        onClick={handleBuyNow}
                                        className="flex-1 border border-black text-black h-14 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-colors"
                                    >
                                        Buy Now
                                    </button>
                                    <button
                                        onClick={() => toggleWishlist(product)}
                                        className={cn(
                                            "w-14 h-14 border border-neutral-200 flex items-center justify-center transition-colors hover:border-black",
                                            isLiked ? "text-red-500 border-red-200 hover:border-red-500" : "text-neutral-500 hover:text-black"
                                        )}
                                    >
                                        <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                                    </button>
                                </div>
                            </FadeIn>

                            {/* Additional Info with Accordions */}
                            <FadeIn delay={0.4}>
                                <div className="mt-8 border-t border-neutral-200">
                                    <AccordionItem title="Details & Care" defaultOpen>
                                        <ul className="list-disc list-inside space-y-2">
                                            {details.map((detail, i) => (
                                                <li key={i}>{detail}</li>
                                            ))}
                                        </ul>
                                    </AccordionItem>
                                    <AccordionItem title="Shipping & Returns">
                                        <p className="text-sm">
                                            Free shipping on orders over ₹5,000. We ship worldwide via DHL Express.
                                            Returns are accepted within 14 days of delivery, provided the items are unworn and tags are attached.
                                        </p>
                                    </AccordionItem>
                                    <AccordionItem title="Sizing">
                                        <p className="text-sm">
                                            Fits true to size. Take your normal size. Model is 6'1" and wears a size M.
                                        </p>
                                    </AccordionItem>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Complete the Look Section */}
            <section className="py-24 border-t border-neutral-100">
                <Container>
                    <FadeIn>
                        <h2 className="font-display text-3xl md:text-4xl mb-12 text-[var(--color-heading-text)]">Complete the Look</h2>
                    </FadeIn>

                    <div className="flex gap-6 overflow-x-auto pb-4 snap-x no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                        {relatedProducts.map((item, index) => (
                            <div key={item.id} className="min-w-[280px] md:min-w-[320px] snap-start">
                                <FadeIn delay={index * 0.1}>
                                    <ProductCard product={item} />
                                </FadeIn>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Sticky Mobile Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 lg:hidden z-50 flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase text-neutral-500">{product.title}</span>
                    <span className="font-medium">₹{product.price.toLocaleString()}</span>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className="flex-1 bg-black text-white h-12 font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
                >
                    {isAdding ? "Added" : "Add to Cart"}
                </button>
            </div>

            {/* Size Guide Modal */}
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
        </div>
    );
}
