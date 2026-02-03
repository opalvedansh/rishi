"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SearchOverlay from "@/components/ui/SearchOverlay";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { cartCount, wishlist } = useShop();
    const { user } = useAuth();

    return (
        <>
            <header className="sticky top-0 z-50 bg-[var(--color-main-bg)] border-b border-[var(--color-border)]">
                <Container fluid className="flex items-center justify-between h-20">
                    {/* LEFT SECTION (w-1/3) - Mobile Toggle & Desktop Nav */}
                    <div className="w-1/3 flex items-center justify-start">
                        {/* Mobile Toggle */}
                        <div className="flex items-center gap-4 lg:hidden">
                            <button className="p-2 -ml-2" onClick={() => setIsMenuOpen(true)}>
                                <Menu className="w-6 h-6" />
                            </button>
                            <button className="p-2" onClick={() => setIsSearchOpen(true)}>
                                <Search className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Desktop Navigation & Search */}
                        <nav className="hidden lg:flex items-center gap-6">
                            <Link href="/about" className="text-xs font-bold hover:text-gray-600 transition-colors uppercase tracking-widest">
                                About
                            </Link>
                            <Link href="/products" className="text-xs font-bold hover:text-gray-600 transition-colors uppercase tracking-widest">
                                Shop
                            </Link>
                            <Link href="/contact" className="text-xs font-bold hover:text-gray-600 transition-colors uppercase tracking-widest">
                                Contact
                            </Link>
                            <Link href="/blog" className="text-xs font-bold hover:text-gray-600 transition-colors uppercase tracking-widest">
                                Blog
                            </Link>
                            <button
                                className="p-2 hover:opacity-70 transition-opacity"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </nav>
                    </div>

                    {/* CENTER SECTION (w-1/3) - Logo */}
                    <div className="w-1/3 flex justify-center">
                        <Link href="/" className="relative h-16 w-auto aspect-[3/1]">
                            <Image
                                src="/doree-logo-nav.png"
                                alt="Doree"
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                    </div>

                    {/* RIGHT SECTION (w-1/3) - User, Wishlist, Cart */}
                    <div className="w-1/3 flex items-center justify-end gap-3 lg:gap-5">
                        {/* User Auth State */}
                        {user ? (
                            <Link href="/account" className="hidden lg:block p-2 hover:opacity-70 transition-opacity relative group" title="My Account">
                                <User className="w-5 h-5 text-black" />
                                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-white" />
                            </Link>
                        ) : (
                            <Link href="/login" className="hidden lg:block text-xs font-bold uppercase tracking-widest hover:text-gray-600 transition-colors">
                                Login
                            </Link>
                        )}
                        <Link href="/wishlist" className="hidden lg:block p-2 hover:opacity-70 transition-opacity relative">
                            <Heart className="w-5 h-5" />
                            {wishlist.length > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 text-[10px] bg-black text-white rounded-full flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>
                        <Link href="/cart" className="p-2 hover:opacity-70 transition-opacity relative">
                            <ShoppingBag className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 w-4 h-4 text-[10px] bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </Container>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMenuOpen(false)}
                                className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
                            />

                            {/* Drawer */}
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white/90 backdrop-blur-xl z-[70] lg:hidden flex flex-col p-8 shadow-2xl"
                            >
                                <div className="flex justify-between items-center mb-12">
                                    <div className="relative h-10 w-auto aspect-[3/1]">
                                        <Image
                                            src="/doree-logo-nav.png"
                                            alt="Doree"
                                            fill
                                            className="object-contain"
                                            priority
                                        />
                                    </div>
                                    <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2 text-black/50 hover:text-black transition-colors rounded-full hover:bg-black/5">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <nav className="flex flex-col gap-6">
                                    {[
                                        { href: "/", label: "Home" },
                                        { href: "/products", label: "Shop" },
                                        { href: "/about", label: "About" },
                                        { href: "/blog", label: "Journal" },
                                        { href: "/contact", label: "Contact" },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={item.href}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.1 }}
                                        >
                                            <Link
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className="text-3xl font-display font-medium hover:text-neutral-500 transition-colors block"
                                            >
                                                {item.label}
                                            </Link>
                                        </motion.div>
                                    ))}
                                </nav>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                    className="mt-auto pt-8 border-t border-neutral-200/50 flex flex-col gap-4"
                                >
                                    <Link href={user ? "/account" : "/login"} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-neutral-800">
                                        <User className="w-5 h-5" />
                                        <span>{user ? "My Account" : "Sign In"}</span>
                                    </Link>
                                    <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-lg font-medium text-neutral-800">
                                        <Heart className="w-5 h-5" />
                                        <span>Wishlist ({wishlist.length})</span>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>

            {/* Search Overlay */}
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Header;
