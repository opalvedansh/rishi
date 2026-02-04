"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import FadeIn from "@/components/animations/FadeIn";
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    FileText,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Search,
    Bell,
    MessageSquare,
    Users,
    Tag,
    BookOpen
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoading, signOut } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Admin email whitelist
    const ADMIN_EMAILS = ["vedanshlovesmom88@gmail.com", "doreebysvd@gmail.com", "masterrishi7@gmail.com"];

    // Protect Admin Route
    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push("/login?redirect=/admin");
            } else if (!ADMIN_EMAILS.includes(user.email || "")) {
                // User is logged in but not an admin
                router.push("/");
            }
        }
    }, [user, isLoading, router]);

    // Show nothing while loading or if user is not an admin
    if (isLoading || !user || !ADMIN_EMAILS.includes(user.email || "")) {
        return null;
    }

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Coupons', href: '/admin/coupons', icon: Tag },
        { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
        { name: 'Blogs', href: '/admin/blogs', icon: BookOpen },
        { name: 'Content (CMS)', href: '/admin/content', icon: FileText },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-neutral-100 flex font-sans">
            {/* Sidebar (Desktop) */}
            <aside
                className={`hidden lg:flex flex-col bg-[#0F0F0F] text-white transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-72" : "w-20"
                    }`}
            >
                <div className="h-20 flex items-center px-6 border-b border-white/10">
                    <Link href="/" className="font-display text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        {isSidebarOpen ? (
                            <span>Doree<span className="text-neutral-500">.</span>Admin</span>
                        ) : (
                            <span>D<span className="text-neutral-500">.</span></span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 py-8 px-3 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-all duration-200 group ${isActive
                                    ? "bg-white text-black font-medium"
                                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                                    }`}
                                title={!isSidebarOpen ? item.name : undefined}
                            >
                                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-black" : "text-neutral-400 group-hover:text-white"}`} />
                                {isSidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => signOut()}
                        className={`flex items-center gap-4 px-3 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${!isSidebarOpen && "justify-center"
                            }`}
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && <span>Sign Out</span>}
                    </button>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="mt-4 w-full flex items-center justify-center p-2 text-neutral-500 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? (
                            <span className="text-xs uppercase tracking-widest">Collapse</span>
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header (Mobile & Desktop details) */}
                <header className="h-20 bg-white border-b border-neutral-200 flex items-center justify-between px-4 lg:px-8">
                    <div className="lg:hidden">
                        <button onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6 text-neutral-600" />
                        </button>
                    </div>

                    <div className="hidden lg:flex items-center gap-4 text-sm text-neutral-500">
                        <span>Welcome back, <span className="text-black font-medium">{user.user_metadata?.first_name || 'Admin'}</span></span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-neutral-400 hover:text-black transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center text-white font-bold">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-neutral-50 p-4 lg:p-8">
                    <FadeIn>
                        {children}
                    </FadeIn>
                </main>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            className="fixed inset-y-0 left-0 w-64 bg-[#0F0F0F] text-white z-50 lg:hidden flex flex-col"
                        >
                            <div className="h-20 flex items-center px-6 border-b border-white/10 justify-between">
                                <span className="font-display text-2xl font-bold">Doree<span className="text-neutral-500">.</span></span>
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-6 h-6 text-neutral-400" />
                                </button>
                            </div>
                            <nav className="flex-1 py-8 px-3 space-y-1">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-4 px-3 py-3 rounded-lg ${pathname === item.href
                                            ? "bg-white text-black font-medium"
                                            : "text-neutral-400 hover:text-white"
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
