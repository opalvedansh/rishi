"use client";

import Link from "next/link";
import Image from "next/image";
import { Instagram, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import Container from "@/components/ui/Container";
import { motion } from "framer-motion";

const footerLinks = {
    shop: [
        { label: "New Arrivals", href: "/products" },
        { label: "Best Sellers", href: "/products" },
    ],
    company: [
        { label: "Our Story", href: "/about" },
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
        <footer className="relative bg-[#0A0A0A] text-[#E8DFD0] pt-24 md:pt-32 pb-8 overflow-hidden">
            {/* Layered Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Primary ambient glow */}
                <div className="absolute top-[-30%] right-[-10%] w-[70%] h-[70%] bg-[#D4A574]/[0.03] blur-[120px] rounded-full" />
                {/* Secondary subtle glow */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#3d2817]/[0.08] blur-[100px] rounded-full" />
                {/* Grain texture overlay */}
                <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
            </div>

            <Container className="relative z-10">
                {/* Hero Newsletter Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="relative mb-20 md:mb-28"
                >
                    {/* Decorative line */}
                    <div className="absolute top-0 left-0 w-16 h-[1px] bg-gradient-to-r from-[#D4A574] to-transparent" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 pt-8">
                        {/* Left: Headline */}
                        <div>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="text-xs uppercase tracking-[0.3em] text-[#D4A574] mb-6 flex items-center gap-2"
                            >
                                <Sparkles className="w-3 h-3" />
                                Stay Connected
                            </motion.p>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1] tracking-tight"
                            >
                                <span className="text-[#F3EAD8]">Join the</span>
                                <br />
                                <span className="italic bg-gradient-to-r from-[#D4A574] via-[#E8C4A0] to-[#D4A574] bg-clip-text text-transparent">
                                    movement.
                                </span>
                            </motion.h2>
                        </div>

                        {/* Right: Form + Description */}
                        <div className="flex flex-col justify-end">
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-base md:text-lg font-light text-[#E8DFD0]/50 mb-8 max-w-md"
                            >
                                Be the first to receive updates on new collections, exclusive events, and style inspiration.
                            </motion.p>

                            <motion.form
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="relative group"
                            >
                                <div className="relative flex items-center border border-[#E8DFD0]/10 rounded-full overflow-hidden bg-white/[0.02] backdrop-blur-sm hover:border-[#D4A574]/30 focus-within:border-[#D4A574]/50 transition-all duration-500">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="flex-1 bg-transparent px-6 py-4 md:py-5 text-base md:text-lg outline-none text-[#F3EAD8] placeholder:text-[#E8DFD0]/30"
                                    />
                                    <button
                                        type="submit"
                                        className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 mr-2 rounded-full bg-gradient-to-br from-[#D4A574] to-[#B8956C] text-[#0A0A0A] hover:scale-105 active:scale-95 transition-transform duration-300"
                                    >
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.form>
                        </div>
                    </div>
                </motion.div>

                {/* Divider with gradient */}
                <div className="h-[1px] bg-gradient-to-r from-transparent via-[#E8DFD0]/10 to-transparent mb-16 md:mb-20" />

                {/* Navigation Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-6 mb-16 md:mb-20">
                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="col-span-2 md:col-span-4 lg:col-span-4"
                    >
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/doree-logo.png"
                                alt="Doree"
                                width={180}
                                height={80}
                                className="h-16 md:h-20 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm font-light text-[#E8DFD0]/50 leading-relaxed mb-8 max-w-xs">
                            Redefining modern luxury with timeless essentials and exceptional craftsmanship.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3">
                            <Link
                                href="https://www.instagram.com/doree.clothing/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-center w-10 h-10 rounded-full border border-[#E8DFD0]/10 hover:border-[#D4A574]/50 hover:bg-[#D4A574]/10 transition-all duration-300"
                            >
                                <Instagram className="w-4 h-4 text-[#E8DFD0]/50 group-hover:text-[#D4A574] transition-colors duration-300" />
                            </Link>
                        </div>
                    </motion.div>

                    {/* Link Columns */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-2 lg:col-start-7"
                    >
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4A574] mb-5">
                            Explore
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#E8DFD0]/60 hover:text-[#F3EAD8] transition-colors duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4A574] mb-5">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[#E8DFD0]/60 hover:text-[#F3EAD8] transition-colors duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4A574] mb-5">
                            Support
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="group inline-flex items-center gap-1 text-sm text-[#E8DFD0]/60 hover:text-[#F3EAD8] transition-colors duration-300"
                                    >
                                        {link.label}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <div className="relative pt-8 border-t border-[#E8DFD0]/5">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-[#E8DFD0]/30 tracking-wide">
                            © {new Date().getFullYear()} Doree. All rights reserved.
                        </p>

                        <div className="flex items-center gap-6">
                            <Link href="/privacy" className="text-xs text-[#E8DFD0]/30 hover:text-[#E8DFD0]/60 transition-colors uppercase tracking-wider">
                                Privacy
                            </Link>
                            <span className="w-1 h-1 rounded-full bg-[#E8DFD0]/20" />
                            <Link href="/terms" className="text-xs text-[#E8DFD0]/30 hover:text-[#E8DFD0]/60 transition-colors uppercase tracking-wider">
                                Terms
                            </Link>
                            <span className="w-1 h-1 rounded-full bg-[#E8DFD0]/20" />
                            <span className="text-xs text-[#E8DFD0]/30 uppercase tracking-wider">
                                Made in India
                            </span>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
