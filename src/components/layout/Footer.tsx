"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, ArrowRight, ArrowUpRight } from "lucide-react";
import Container from "@/components/ui/Container";
import { motion } from "framer-motion";

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
        <footer className="relative bg-[#050505] text-[#E0D5C7] pt-32 pb-12 overflow-hidden">
            {/* Ambient Background Gradient */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] left-[20%] w-[60%] h-[60%] bg-[#3d2817]/10 blur-[150px] rounded-full mix-blend-screen" />
            </div>

            <Container className="relative z-10">
                {/* Top Section: Newsletter & Brand Message */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-32">
                    <div className="lg:col-span-7 flex flex-col justify-between">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8 text-[#F3EAD8]"
                            >
                                Join the <br /> <span className="italic text-white/40">movement.</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="text-lg md:text-xl font-light text-white/50 max-w-md"
                            >
                                Be the first to receive updates on new collections, exclusive events, and style inspiration.
                            </motion.p>
                        </div>
                    </div>

                    <div className="lg:col-span-5 flex items-end">
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full relative group"
                        >
                            <div className="relative overflow-hidden w-full">
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    className="w-full bg-transparent border-b border-white/20 py-6 text-xl md:text-2xl outline-none text-[#F3EAD8] placeholder:text-white/20 focus:border-[#F3EAD8] transition-all duration-500 pr-12"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 group-hover:text-[#F3EAD8] transition-colors duration-300"
                                >
                                    <ArrowRight className="w-8 h-8" />
                                </button>
                                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[#F3EAD8] translate-x-[-100%] group-focus-within:translate-x-0 transition-transform duration-700 ease-out" />
                            </div>
                        </motion.form>
                    </div>
                </div>

                {/* Middle Section: Links */}
                <div className="border-t border-white/10 pt-20 pb-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-12 lg:gap-8">
                        {/* Address / Contact (Optional or Brand Info) */}
                        <div className="col-span-2 lg:col-span-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-8 text-white/40">Contact</h3>
                                <p className="text-xl font-light leading-relaxed text-[#E0D5C7]/80 mb-6">
                                    hello@doree.com<br />
                                    +91 98765 43210
                                </p>
                                <p className="text-sm font-light text-white/40">
                                    Mumbai, India<br />
                                    Open 9am - 6pm
                                </p>
                            </motion.div>
                        </div>

                        {/* Navigation Columns */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                            >
                                <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-8 text-white/40">Explore</h3>
                                <ul className="space-y-4">
                                    {footerLinks.shop.map((link) => (
                                        <li key={link.label}>
                                            <Link href={link.href} className="group flex items-center gap-2 text-sm text-[#E0D5C7]/70 hover:text-[#F3EAD8] transition-colors duration-300">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.3 }}
                            >
                                <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-8 text-white/40">Company</h3>
                                <ul className="space-y-4">
                                    {footerLinks.company.map((link) => (
                                        <li key={link.label}>
                                            <Link href={link.href} className="text-sm text-[#E0D5C7]/70 hover:text-[#F3EAD8] transition-colors duration-300">
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                                <h3 className="text-xs font-medium uppercase tracking-[0.2em] mb-8 text-white/40">Socials</h3>
                                <ul className="space-y-4">
                                    {[
                                        { label: "Instagram", icon: Instagram },
                                        { label: "Twitter", icon: Twitter },
                                        { label: "Facebook", icon: Facebook }
                                    ].map((social) => (
                                        <li key={social.label}>
                                            <Link href="#" className="group flex items-center justify-between w-full max-w-[120px] text-sm text-[#E0D5C7]/70 hover:text-[#F3EAD8] transition-colors duration-300 border-b border-white/5 pb-1 cursor-pointer">
                                                <span>{social.label}</span>
                                                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar & Watermark */}
                <div className="relative pt-12 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10">
                    <p className="text-xs font-medium text-white/20 tracking-wider">
                        &copy; {new Date().getFullYear()} DOREE. ALL RIGHTS RESERVED.
                    </p>

                    <div className="flex gap-8">
                        <Link href="/privacy" className="text-xs font-medium text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider">Privacy</Link>
                        <Link href="/terms" className="text-xs font-medium text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider">Terms</Link>
                    </div>

                    {/* Giant Watermark */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 pointer-events-none select-none opacity-[0.03] overflow-hidden w-full flex justify-center">
                        <h1 className="font-display text-[15vw] leading-none tracking-tighter text-white whitespace-nowrap">
                            DOREE
                        </h1>
                    </div>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
