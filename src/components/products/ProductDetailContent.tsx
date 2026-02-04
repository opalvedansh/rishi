"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import {
    Heart, Minus, Plus, Star, Check, ChevronLeft, ChevronRight,
    Truck, Shield, RotateCcw, Award, Zap, Package, Clock,
    Share2, ZoomIn, Copy, X as CloseIcon, MessageCircle, AlertCircle
} from "lucide-react";
import { AccordionItem } from "@/components/ui/Accordion";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/data/products";
import { cn } from "@/lib/utils";
import { useShop } from "@/context/ShopContext";
import SizeGuideModal from "@/components/ui/SizeGuideModal";
import { motion, AnimatePresence } from "framer-motion";
import ReviewSection from "@/components/reviews/ReviewSection";
import { getReviewsByProductId } from "@/lib/supabase/reviews";

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
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
    const imageRef = useRef<HTMLDivElement>(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);
    const { addToCart, toggleWishlist, isInWishlist } = useShop();

    // Fallback/Default data if missing in product object
    const sizes = product.sizes || ["XS", "S", "M", "L", "XL"];
    const details = product.details || [
        "Premium Quality Material",
        "Expert Craftsmanship",
        "Designed for Comfort",
        "Machine Washable"
    ];
    const images = product.images && product.images.length > 0 ? product.images : [product.image];
    const inStock = product.in_stock ?? true;

    // Dynamic rating and review count from approved reviews
    const [rating, setRating] = useState(product.rating || 0);
    const [reviewCount, setReviewCount] = useState(product.reviewCount || 0);

    useEffect(() => {
        async function fetchReviewStats() {
            const reviews = await getReviewsByProductId(product.id);
            if (reviews.length > 0) {
                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                const avgRating = totalRating / reviews.length;
                setRating(Math.round(avgRating * 10) / 10); // Round to 1 decimal
                setReviewCount(reviews.length);
            } else {
                setRating(0);
                setReviewCount(0);
            }
        }
        fetchReviewStats();
    }, [product.id]);

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(product, quantity, selectedSize);
        setTimeout(() => setIsAdding(false), 2000);
    };

    const handleBuyNow = () => {
        addToCart(product, quantity, selectedSize);
        router.push("/checkout");
    };

    const handleShare = async () => {
        const shareUrl = typeof window !== "undefined" ? window.location.href : "";
        const shareTitle = product.title;
        const shareText = `Check out ${product.title} at Doree - ₹${product.price}`;

        // Try native Web Share API first (works on mobile)
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled or error - open modal as fallback
                if ((err as Error).name !== "AbortError") {
                    setShowShareModal(true);
                }
            }
        } else {
            // Desktop - show share modal
            setShowShareModal(true);
        }
    };

    const copyToClipboard = async () => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const getShareUrl = (platform: string) => {
        const url = encodeURIComponent(typeof window !== "undefined" ? window.location.href : "");
        const text = encodeURIComponent(`Check out ${product.title} at Doree - ₹${product.price}`);

        switch (platform) {
            case "whatsapp":
                return `https://wa.me/?text=${text}%20${url}`;
            case "twitter":
                return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            case "facebook":
                return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            default:
                return "";
        }
    };

    const isLiked = isInWishlist(product.id);

    const nextImage = () => {
        setSelectedImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    const originalPrice = product.originalPrice || (product as any).original_price;

    const discount = originalPrice
        ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
        : 0;

    return (
        <div className="bg-[#FAFAFA] min-h-screen pt-20 md:pt-24">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-neutral-100">
                <Container>
                    <nav className="py-3 flex items-center gap-2 text-sm text-neutral-500">
                        <Link href="/" className="hover:text-[#C9A86C] transition-colors">Home</Link>
                        <span className="text-neutral-300">/</span>
                        <Link href="/products" className="hover:text-[#C9A86C] transition-colors">Shop</Link>
                        <span className="text-neutral-300">/</span>
                        {product.category && (
                            <>
                                <Link href={`/products?category=${product.category}`} className="hover:text-[#C9A86C] transition-colors">
                                    {product.category}
                                </Link>
                                <span className="text-neutral-300">/</span>
                            </>
                        )}
                        <span className="text-neutral-900 font-medium truncate max-w-[200px]">{product.title}</span>
                    </nav>
                </Container>
            </div>

            <Container className="py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Left: Thumbnails (Desktop) */}
                    <div className="hidden lg:flex lg:col-span-1 flex-col gap-3">
                        {images.map((img, i) => (
                            <motion.button
                                key={i}
                                onClick={() => setSelectedImageIndex(i)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    "relative aspect-[3/4] rounded-lg overflow-hidden border-2 transition-all",
                                    selectedImageIndex === i
                                        ? "border-[#C9A86C] shadow-lg shadow-[#C9A86C]/20"
                                        : "border-transparent hover:border-neutral-300"
                                )}
                            >
                                <Image
                                    src={img}
                                    alt={`View ${i + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </motion.button>
                        ))}
                    </div>

                    {/* Center: Main Image */}
                    <div className="lg:col-span-6">
                        <FadeIn>
                            {/* Main Image Container */}
                            <div
                                ref={imageRef}
                                className="relative aspect-[3/4] lg:aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-xl group cursor-zoom-in"
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onMouseMove={handleMouseMove}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedImageIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute inset-0"
                                    >
                                        <Image
                                            src={images[selectedImageIndex]}
                                            alt={product.title}
                                            fill
                                            className={cn(
                                                "object-cover transition-transform duration-300",
                                                isZoomed && "scale-150"
                                            )}
                                            style={isZoomed ? {
                                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
                                            } : undefined}
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>

                                {/* Zoom hint */}
                                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ZoomIn className="w-3 h-3" />
                                    Hover to zoom
                                </div>

                                {/* Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                        >
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                        >
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </>
                                )}

                                {/* Discount Badge */}
                                {discount > 0 && (
                                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                        {discount}% OFF
                                    </div>
                                )}

                                {/* Image Counter */}
                                {images.length > 1 && (
                                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-4 py-1.5 rounded-full font-medium">
                                        {selectedImageIndex + 1} / {images.length}
                                    </div>
                                )}
                            </div>

                            {/* Mobile Thumbnails */}
                            {images.length > 1 && (
                                <div className="flex lg:hidden gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImageIndex(i)}
                                            className={cn(
                                                "relative w-16 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                                                selectedImageIndex === i
                                                    ? "border-[#C9A86C]"
                                                    : "border-neutral-200"
                                            )}
                                        >
                                            <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </FadeIn>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-5">
                        <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm sticky top-24">
                            <FadeIn>
                                {/* Brand & Tag */}
                                <div className="flex items-center gap-3 mb-4">
                                    {product.tag && (
                                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#C9A86C] to-[#B8956A] px-3 py-1 rounded-full">
                                            <Zap className="w-3 h-3" />
                                            {product.tag}
                                        </span>
                                    )}
                                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Doree Collection</span>
                                </div>

                                {/* Title */}
                                <h1 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900 mb-3 leading-tight">
                                    {product.title}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center gap-1">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        "w-4 h-4",
                                                        i < Math.floor(rating)
                                                            ? "fill-[#FFB800] text-[#FFB800]"
                                                            : "fill-neutral-200 text-neutral-200"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-neutral-900 ml-1">
                                            {reviewCount > 0 ? rating.toFixed(1) : "N/A"}
                                        </span>
                                    </div>
                                    <span className="text-sm text-[#007185] hover:text-[#C9A86C] cursor-pointer hover:underline">
                                        {reviewCount > 0 ? `${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}` : 'No reviews yet'}
                                    </span>
                                </div>

                                {/* Price Section */}
                                <div className="bg-gradient-to-r from-neutral-50 to-neutral-100/50 rounded-xl p-4 mb-6">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-3xl font-bold text-neutral-900">₹{product.price.toLocaleString()}</span>
                                        {originalPrice && originalPrice > product.price && (
                                            <>
                                                <span className="text-lg text-neutral-400 line-through">
                                                    ₹{originalPrice.toLocaleString()}
                                                </span>
                                                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                                                    <span>{discount}% OFF</span>
                                                    <span>•</span>
                                                    <span>Save ₹{(originalPrice - product.price).toLocaleString()}</span>
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs text-neutral-500 mt-1">Inclusive of all taxes</p>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-xl text-center">
                                        <Truck className="w-5 h-5 text-[#C9A86C] mb-1" />
                                        <span className="text-[10px] font-bold uppercase text-neutral-600">Free Delivery</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-xl text-center">
                                        <RotateCcw className="w-5 h-5 text-[#C9A86C] mb-1" />
                                        <span className="text-[10px] font-bold uppercase text-neutral-600">Easy Returns</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-neutral-50 rounded-xl text-center">
                                        <Shield className="w-5 h-5 text-[#C9A86C] mb-1" />
                                        <span className="text-[10px] font-bold uppercase text-neutral-600">Secure Pay</span>
                                    </div>
                                </div>

                                {/* Size Selector */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-bold text-neutral-900">Size: <span className="font-normal text-neutral-600">{selectedSize}</span></span>
                                        <button
                                            onClick={() => setIsSizeGuideOpen(true)}
                                            className="text-sm text-[#007185] hover:text-[#C9A86C] hover:underline font-medium"
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
                                                    "min-w-[48px] h-12 px-4 flex items-center justify-center rounded-lg font-medium transition-all border-2",
                                                    selectedSize === size
                                                        ? "border-[#C9A86C] bg-[#C9A86C]/10 text-[#C9A86C]"
                                                        : "border-neutral-200 text-neutral-600 hover:border-[#C9A86C] hover:bg-[#C9A86C]/5"
                                                )}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="mb-6">
                                    <span className="text-sm font-bold text-neutral-900 mb-3 block">Quantity</span>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center border-2 border-neutral-200 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-12 h-12 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 h-12 flex items-center justify-center font-bold text-lg border-x-2 border-neutral-200">
                                                {quantity}
                                            </span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-12 h-12 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        {inStock ? (
                                            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                                                <Check className="w-4 h-4" />
                                                In Stock
                                            </span>
                                        ) : (
                                            <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                Out of Stock
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 mb-6">
                                    {!inStock && (
                                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 mb-3">
                                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium text-red-700">This product is currently out of stock</p>
                                                <p className="text-xs text-red-500">Add to wishlist to be notified when available</p>
                                            </div>
                                        </div>
                                    )}
                                    <motion.button
                                        onClick={handleAddToCart}
                                        disabled={isAdding || !inStock}
                                        whileHover={inStock ? { scale: 1.02 } : {}}
                                        whileTap={inStock ? { scale: 0.98 } : {}}
                                        className={cn(
                                            "w-full h-14 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                                            !inStock
                                                ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                                : isAdding
                                                    ? "bg-green-500 text-white"
                                                    : "bg-black text-white hover:bg-neutral-800 shadow-lg"
                                        )}
                                    >
                                        {isAdding ? (
                                            <>
                                                <Check className="w-5 h-5" />
                                                Added to Cart!
                                            </>
                                        ) : !inStock ? (
                                            "Out of Stock"
                                        ) : (
                                            "Add to Cart"
                                        )}
                                    </motion.button>

                                    <motion.button
                                        onClick={handleBuyNow}
                                        disabled={!inStock}
                                        whileHover={inStock ? { scale: 1.02 } : {}}
                                        whileTap={inStock ? { scale: 0.98 } : {}}
                                        className={cn(
                                            "w-full h-14 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg border-2",
                                            !inStock
                                                ? "bg-neutral-200 text-neutral-400 border-neutral-200 cursor-not-allowed"
                                                : "bg-neutral-900 text-white border-neutral-900 hover:bg-white hover:text-neutral-900"
                                        )}
                                    >
                                        {inStock ? "Buy Now" : "Unavailable"}
                                    </motion.button>
                                </div>

                                {/* Wishlist & Share */}
                                <div className="flex gap-3 mb-6">
                                    <button
                                        onClick={() => toggleWishlist(product)}
                                        className={cn(
                                            "flex-1 h-12 border-2 rounded-xl flex items-center justify-center gap-2 font-medium text-sm transition-all",
                                            isLiked
                                                ? "border-red-200 bg-red-50 text-red-500"
                                                : "border-neutral-200 text-neutral-600 hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                                        )}
                                    >
                                        <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
                                        {isLiked ? "Wishlisted" : "Add to Wishlist"}
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="w-12 h-12 border-2 border-neutral-200 rounded-xl flex items-center justify-center text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 transition-colors"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Share Modal */}
                                <AnimatePresence>
                                    {showShareModal && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                                            onClick={() => setShowShareModal(false)}
                                        >
                                            <motion.div
                                                initial={{ scale: 0.9, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.9, opacity: 0 }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                                            >
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="font-bold text-lg">Share this product</h3>
                                                    <button
                                                        onClick={() => setShowShareModal(false)}
                                                        className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors"
                                                    >
                                                        <CloseIcon className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                {/* Product Preview */}
                                                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl mb-6">
                                                    <div className="w-16 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
                                                        <Image src={images[0]} alt={product.title} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium text-sm truncate">{product.title}</p>
                                                        <p className="text-[#C9A86C] font-bold">₹{product.price.toLocaleString()}</p>
                                                    </div>
                                                </div>

                                                {/* Copy URL */}
                                                <button
                                                    onClick={copyToClipboard}
                                                    className={cn(
                                                        "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all mb-4",
                                                        copied
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                                    )}
                                                >
                                                    {copied ? (
                                                        <>
                                                            <Check className="w-4 h-4" />
                                                            Link Copied!
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Copy className="w-4 h-4" />
                                                            Copy Link
                                                        </>
                                                    )}
                                                </button>

                                                {/* Social Share Buttons */}
                                                <div className="grid grid-cols-3 gap-3">
                                                    <a
                                                        href={getShareUrl("whatsapp")}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 transition-colors"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                                                            <MessageCircle className="w-5 h-5 text-white" />
                                                        </div>
                                                        <span className="text-xs font-medium text-neutral-700">WhatsApp</span>
                                                    </a>
                                                    <a
                                                        href={getShareUrl("twitter")}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition-colors"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-[#1DA1F2] flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs font-medium text-neutral-700">Twitter</span>
                                                    </a>
                                                    <a
                                                        href={getShareUrl("facebook")}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#1877F2]/10 hover:bg-[#1877F2]/20 transition-colors"
                                                    >
                                                        <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-xs font-medium text-neutral-700">Facebook</span>
                                                    </a>
                                                </div>
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Delivery Info */}
                                <div className="border-2 border-neutral-100 rounded-xl p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Package className="w-5 h-5 text-[#C9A86C] mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">Free Delivery</p>
                                            <p className="text-xs text-neutral-500">Free delivery on the purchase of ₹3000 or above</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Clock className="w-5 h-5 text-[#C9A86C] mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">Delivery in 3-5 business days</p>
                                            <p className="text-xs text-neutral-500">Order within <span className="text-red-500 font-medium">2h 34m</span> for same day dispatch</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <RotateCcw className="w-5 h-5 text-[#C9A86C] mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-neutral-900">7 Days Easy Return</p>
                                            <p className="text-xs text-neutral-500">Free return within 7 days for an exchange</p>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>

                {/* Product Details Section */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Description */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
                        <FadeIn>
                            <h2 className="text-xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#C9A86C]" />
                                About This Product
                            </h2>
                            <p className="text-neutral-600 leading-relaxed mb-6">
                                {product.description || "Experience luxury with this premium piece, crafted for the modern individual. Made with the finest materials and attention to detail, this piece combines timeless elegance with contemporary style."}
                            </p>

                            {/* Product Highlights */}
                            <h3 className="text-lg font-bold text-neutral-900 mb-4">Product Highlights</h3>
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {details.map((detail, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                        {detail}
                                    </div>
                                ))}
                            </div>

                            {/* Accordions */}
                            <div className="border-t border-neutral-100 pt-6">
                                <AccordionItem title="Shipping & Returns" defaultOpen>
                                    <p className="text-sm text-neutral-600">
                                        Free shipping on orders over ₹5,000. We ship worldwide via premium carriers.
                                        Returns are accepted within 7 days of delivery, provided the items are unworn and tags are attached.
                                    </p>
                                </AccordionItem>
                                <AccordionItem title="Care Instructions">
                                    <p className="text-sm text-neutral-600">
                                        Machine wash cold on gentle cycle. Do not bleach. Tumble dry low.
                                        Iron on low heat if needed. For best results, wash with like colors.
                                    </p>
                                </AccordionItem>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Why Choose Us */}
                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 lg:p-8 text-white">
                        <FadeIn>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-[#C9A86C]" />
                                Why Doree?
                            </h3>
                            <div className="space-y-4">
                                {[
                                    { icon: Shield, title: "100% Authentic", desc: "Guaranteed genuine products" },
                                    { icon: Truck, title: "Pan India Delivery", desc: "We deliver everywhere in India" },
                                    { icon: RotateCcw, title: "Easy Returns", desc: "Hassle-free 7-day returns" },
                                    { icon: Zap, title: "Premium Quality", desc: "Only the finest materials" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#C9A86C]/20 flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-5 h-5 text-[#C9A86C]" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.title}</p>
                                            <p className="text-sm text-neutral-400">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </Container>

            {/* Review Section */}
            <ReviewSection productId={product.id} />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="py-16 bg-white mt-12">
                    <Container>
                        <FadeIn>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900">
                                    You Might Also Like
                                </h2>
                                <Link href="/products" className="text-sm font-medium text-[#007185] hover:text-[#C9A86C] hover:underline">
                                    View All Products →
                                </Link>
                            </div>
                        </FadeIn>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                            {relatedProducts.slice(0, 4).map((item, index) => (
                                <FadeIn key={item.id} delay={index * 0.1}>
                                    <ProductCard product={item} />
                                </FadeIn>
                            ))}
                        </div>
                    </Container>
                </section>
            )}

            {/* Sticky Mobile Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-neutral-200 lg:hidden z-50 shadow-2xl">
                <div className="flex gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-neutral-500 mb-0.5">Price</p>
                        <p className="text-lg font-bold">₹{product.price.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || !inStock}
                        className={cn(
                            "flex-[2] h-12 rounded-lg font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2",
                            !inStock
                                ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                                : isAdding
                                    ? "bg-green-500 text-white"
                                    : "bg-black text-white"
                        )}
                    >
                        {isAdding ? <Check className="w-4 h-4" /> : null}
                        {isAdding ? "Added!" : !inStock ? "Sold Out" : "Add to Cart"}
                    </button>
                </div>
            </div>

            {/* Size Guide Modal */}
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
        </div>
    );
}
