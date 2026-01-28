"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Container from "@/components/ui/Container";
import SearchOverlay from "@/components/ui/SearchOverlay";
import { useShop } from "@/context/ShopContext";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { cartCount, wishlist } = useShop();

    return (
        <>
            <header className="sticky top-0 z-50 bg-[var(--color-main-bg)] border-b border-[var(--color-border)]">
                <Container className="flex items-center justify-between h-20">
                    {/* Mobile Menu & Search (Left) */}
                    <div className="flex items-center gap-4 lg:hidden w-1/3">
                        <button className="p-2 -ml-2" onClick={() => setIsMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                        <button className="p-2" onClick={() => setIsSearchOpen(true)}>
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Desktop Menu (Left - Spacer) */}
                    <div className="hidden lg:block w-1/3" />

                    {/* Logo (Center) */}
                    <div className="w-1/3 flex justify-center">
                        <Link href="/" className="font-display text-3xl font-bold tracking-tight">
                            Doree
                        </Link>
                    </div>

                    {/* Icons (Right) */}
                    <div className="flex items-center justify-between w-1/3 pl-4 md:pl-8">
                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
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
                        </nav>

                        {/* Icons Group */}
                        <div className="flex items-center justify-end gap-3 lg:gap-5 ml-auto">
                            <button
                                className="hidden lg:block p-2 hover:opacity-70 transition-opacity"
                                onClick={() => setIsSearchOpen(true)}
                            >
                                <Search className="w-5 h-5" />
                            </button>
                            <Link href="/account" className="hidden lg:block p-2 hover:opacity-70 transition-opacity">
                                <User className="w-5 h-5" />
                            </Link>
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
                                className="fixed top-0 left-0 bottom-0 w-[80%] max-w-sm bg-white z-[70] lg:hidden flex flex-col p-8"
                            >
                                <div className="flex justify-between items-center mb-12">
                                    <span className="font-display text-2xl font-bold">Doree</span>
                                    <button onClick={() => setIsMenuOpen(false)} className="p-2 -mr-2">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <nav className="flex flex-col gap-6">
                                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-neutral-500 transition-colors">
                                        Home
                                    </Link>
                                    <Link href="/products" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-neutral-500 transition-colors">
                                        Shop
                                    </Link>
                                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-neutral-500 transition-colors">
                                        About
                                    </Link>
                                    <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-neutral-500 transition-colors">
                                        Journal
                                    </Link>
                                    <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-xl font-medium hover:text-neutral-500 transition-colors">
                                        Contact
                                    </Link>
                                </nav>

                                <div className="mt-auto pt-8 border-t border-neutral-100 flex flex-col gap-4">
                                    <Link href="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-neutral-600">
                                        <User className="w-5 h-5" />
                                        <span>My Account</span>
                                    </Link>
                                    <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-neutral-600">
                                        <Heart className="w-5 h-5" />
                                        <span>Wishlist ({wishlist.length})</span>
                                    </Link>
                                </div>
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
