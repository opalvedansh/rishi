"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { cn } from "@/lib/utils";

const footerLinks = {
    shop: [
        { label: "New Arrivals", href: "/collections/new-arrivals" },
        { label: "Best Sellers", href: "/collections/best-sellers" },
        { label: "Trousers", href: "/collections/trousers" },
        { label: "Knitwear", href: "/collections/knitwear" },
        { label: "Accessories", href: "/collections/accessories" },
    ],
    company: [
        { label: "Our Story", href: "/about" },
        { label: "Sustainability", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
    ],
    support: [
        { label: "Contact Us", href: "/contact" },
        { label: "Shipping & Returns", href: "/shipping-returns" },
        { label: "Size Guide", href: "#" },
        { label: "FAQ", href: "#" },
    ],
};

const Footer = () => {
    return (
        <footer className="bg-black text-white pt-24 pb-12 overflow-hidden">
            <Container>
                {/* Newsletter Section - Big Impact */}
                <div className="mb-24 flex flex-col items-center text-center">
                    <FadeIn direction="up">
                        <h2 className="font-display text-4xl md:text-6xl mb-6">Join Our World</h2>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.1}>
                        <p className="text-white/60 text-lg md:text-xl font-light mb-10 max-w-lg mx-auto">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                    </FadeIn>

                    <FadeIn direction="up" delay={0.2} fullWidth className="max-w-md mx-auto w-full">
                        <form className="relative group">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-transparent border-b border-white/30 py-4 text-lg outline-none focus:border-white transition-colors placeholder:text-white/30 text-white"
                            />
                            <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors">
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </form>
                    </FadeIn>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20 border-t border-white/10 pt-16">
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-1">
                        <FadeIn delay={0.1}>
                            <Link href="/" className="font-display text-3xl font-bold tracking-tight mb-6 block">Doree</Link>
                            <p className="text-white/60 mb-6 font-light">
                                Redefining modern luxury with timeless essentials and exceptional craftsmanship.
                            </p>
                            <div className="flex gap-4">
                                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                    <Link key={i} href="#" className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300">
                                        <Icon className="w-5 h-5" />
                                    </Link>
                                ))}
                            </div>
                        </FadeIn>
                    </div>

                    {/* Link Columns */}
                    <div className="col-span-1">
                        <FadeIn delay={0.2}>
                            <h3 className="font-medium text-lg mb-6">Shop</h3>
                            <ul className="space-y-4">
                                {footerLinks.shop.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-white/60 hover:text-white transition-colors font-light text-sm tracking-wide">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </FadeIn>
                    </div>

                    <div className="col-span-1">
                        <FadeIn delay={0.3}>
                            <h3 className="font-medium text-lg mb-6">Company</h3>
                            <ul className="space-y-4">
                                {footerLinks.company.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-white/60 hover:text-white transition-colors font-light text-sm tracking-wide">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </FadeIn>
                    </div>

                    <div className="col-span-1 lg:col-span-1">
                        <FadeIn delay={0.4}>
                            <h3 className="font-medium text-lg mb-6">Support</h3>
                            <ul className="space-y-4">
                                {footerLinks.support.map((link) => (
                                    <li key={link.label}>
                                        <Link href={link.href} className="text-white/60 hover:text-white transition-colors font-light text-sm tracking-wide">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </FadeIn>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-light text-white/40 uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} Doree. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span>Currency: INR</span>
                        <span>Country: India</span>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
