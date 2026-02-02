"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import {
    LogOut,
    Package,
    User,
    Heart,
    Loader2,
    ChevronRight,
    CreditCard,
    Settings,
    ShoppingBag,
    CheckCircle,
    Clock,
    XCircle,
    ChevronDown,
    ChevronUp,
    Truck,
    MapPin,
    Phone,
    MessageCircle,
    ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getOrdersByUser, Order, DELIVERY_STEPS, getDeliveryStepIndex, CUSTOMER_CARE, DeliveryStatus } from "@/lib/supabase/orders";

export default function AccountPage() {
    const { user, isLoading, signOut } = useAuth();
    const { wishlist } = useShop();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login?redirect=/account");
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        async function loadOrders() {
            if (user) {
                setOrdersLoading(true);
                const userOrders = await getOrdersByUser(user.id);
                setOrders(userOrders);
                setOrdersLoading(false);
            }
        }
        loadOrders();
    }, [user]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-50">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    const tabs = [
        { id: "overview", label: "Overview", icon: User },
        { id: "orders", label: "Orders", icon: ShoppingBag, count: orders.length },
        { id: "wishlist", label: "Wishlist", icon: Heart },
        { id: "settings", label: "Settings", icon: Settings },
    ];

    const getStatusColor = (status: DeliveryStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'in_transit': return 'bg-purple-50 text-purple-700 border-purple-200';
            case 'out_for_delivery': return 'bg-green-50 text-green-700 border-green-200';
            case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
            case 'returned': return 'bg-orange-50 text-orange-700 border-orange-200';
            default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
        }
    };

    const getStatusIcon = (status: DeliveryStatus) => {
        switch (status) {
            case 'pending': return Clock;
            case 'confirmed': return CheckCircle;
            case 'processing': return Package;
            case 'shipped': return Truck;
            case 'in_transit': return Truck;
            case 'out_for_delivery': return MapPin;
            case 'delivered': return CheckCircle;
            case 'cancelled': return XCircle;
            case 'returned': return XCircle;
            default: return Clock;
        }
    };

    const getStatusLabel = (status: DeliveryStatus) => {
        switch (status) {
            case 'pending': return 'Pending';
            case 'confirmed': return 'Confirmed';
            case 'processing': return 'Processing';
            case 'shipped': return 'Shipped';
            case 'in_transit': return 'In Transit';
            case 'out_for_delivery': return 'Out for Delivery';
            case 'delivered': return 'Delivered';
            case 'cancelled': return 'Cancelled';
            case 'returned': return 'Returned';
            default: return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatOrderId = (id: string) => {
        return `#ORD-${id.slice(0, 6).toUpperCase()}`;
    };

    const totalItemCount = (order: Order) => order.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalSpent = orders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.amount, 0);

    // Mini tracking progress for order cards
    const MiniTracker = ({ order }: { order: Order }) => {
        const currentStepIndex = getDeliveryStepIndex(order.delivery_status);
        const isCancelled = order.delivery_status === 'cancelled' || order.delivery_status === 'returned';

        if (isCancelled || order.delivery_status === 'pending') return null;

        return (
            <div className="mt-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-1">
                    {DELIVERY_STEPS.slice(0, 4).map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        return (
                            <div key={step.status} className="flex-1 flex items-center">
                                <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-neutral-200'}`} />
                                {index < 3 && (
                                    <div className={`flex-1 h-0.5 ${index < currentStepIndex ? 'bg-green-500' : 'bg-neutral-200'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-2">
                    <span className="text-[10px] text-neutral-400">Confirmed</span>
                    <span className="text-[10px] text-neutral-400">Delivered</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-neutral-50 pt-28 pb-32">
            <Container>
                <FadeIn>
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
                        {/* Premium Sidebar */}
                        <aside className="w-full lg:w-72 flex-shrink-0 sticky top-32">
                            <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
                                {/* User Profile Card */}
                                <div className="p-6 border-b border-neutral-100 bg-neutral-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center text-xl font-display font-bold">
                                            {user.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-display font-bold text-neutral-900 truncate">
                                                {user.user_metadata?.first_name
                                                    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name || ''}`
                                                    : 'Valued Customer'}
                                            </p>
                                            <p className="text-xs text-neutral-500 truncate mt-0.5">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <nav className="p-3 space-y-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group ${activeTab === tab.id
                                                ? "bg-black text-white shadow-lg shadow-black/10"
                                                : "text-neutral-500 hover:bg-neutral-100 hover:text-black"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-white" : "text-neutral-400 group-hover:text-black transition-colors"}`} />
                                                <span>{tab.label}</span>
                                            </div>
                                            {tab.id === 'wishlist' && wishlist.length > 0 && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white text-black" : "bg-neutral-200 text-neutral-600"}`}>
                                                    {wishlist.length}
                                                </span>
                                            )}
                                            {tab.id === 'orders' && orders.length > 0 && (
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white text-black" : "bg-neutral-200 text-neutral-600"}`}>
                                                    {orders.length}
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </nav>

                                <div className="p-3 mt-2 border-t border-neutral-100">
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>

                            {/* Customer Care Card */}
                            <div className="mt-6 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h4 className="font-display font-bold text-lg mb-1">Customer Support</h4>
                                    <p className="text-white/60 text-xs mb-4 leading-relaxed">
                                        {CUSTOMER_CARE.hours}
                                    </p>
                                    <div className="space-y-2">
                                        <a
                                            href={`tel:${CUSTOMER_CARE.phone}`}
                                            className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors"
                                        >
                                            <Phone className="w-4 h-4" />
                                            {CUSTOMER_CARE.phone}
                                        </a>
                                        <a
                                            href={`https://wa.me/${CUSTOMER_CARE.whatsapp.replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            WhatsApp
                                        </a>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                            </div>
                        </aside>

                        {/* Content Area */}
                        <div className="flex-1 min-w-0">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTab === "overview" && (
                                        <div className="space-y-8">
                                            <div>
                                                <h1 className="font-display text-3xl font-bold mb-2">My Overview</h1>
                                                <p className="text-neutral-500">Welcome back to your personal dashboard.</p>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300">
                                                    <div className="w-10 h-10 bg-black/5 rounded-full flex items-center justify-center mb-4">
                                                        <ShoppingBag className="w-5 h-5 text-black" />
                                                    </div>
                                                    <p className="text-3xl font-display font-bold mb-1">{orders.length}</p>
                                                    <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">Total Orders</p>
                                                </div>
                                                <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300">
                                                    <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mb-4">
                                                        <Heart className="w-5 h-5 text-red-500" />
                                                    </div>
                                                    <p className="text-3xl font-display font-bold mb-1">{wishlist.length}</p>
                                                    <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">In Wishlist</p>
                                                </div>
                                                <div className="bg-white p-6 rounded-2xl border border-neutral-200/60 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-transform duration-300">
                                                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                                        <CreditCard className="w-5 h-5 text-green-500" />
                                                    </div>
                                                    <p className="text-3xl font-display font-bold mb-1">₹{totalSpent.toLocaleString()}</p>
                                                    <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold">Total Spent</p>
                                                </div>
                                            </div>

                                            {/* Recent Activity Section */}
                                            <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
                                                <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                                                    <h3 className="font-display font-bold text-lg">Recent Orders</h3>
                                                    <button onClick={() => setActiveTab('orders')} className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black flex items-center gap-1 transition-colors">
                                                        View All <ChevronRight className="w-3 h-3" />
                                                    </button>
                                                </div>

                                                {ordersLoading ? (
                                                    <div className="py-16 flex items-center justify-center">
                                                        <Loader2 className="w-6 h-6 animate-spin text-neutral-300" />
                                                    </div>
                                                ) : orders.length === 0 ? (
                                                    <div className="py-16 px-6 text-center">
                                                        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                                            <Package className="w-8 h-8 text-neutral-300" />
                                                        </div>
                                                        <h4 className="font-bold text-neutral-900 mb-2">No recent orders</h4>
                                                        <p className="text-neutral-500 text-sm max-w-xs mx-auto mb-6">
                                                            Start exploring our collection to find your new favorite essentials.
                                                        </p>
                                                        <Link
                                                            href="/products"
                                                            className="inline-flex items-center justify-center px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 transition-colors"
                                                        >
                                                            Start Shopping
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <div className="divide-y divide-neutral-100">
                                                        {orders.slice(0, 3).map((order) => {
                                                            const StatusIcon = getStatusIcon(order.delivery_status);
                                                            return (
                                                                <Link
                                                                    key={order.id}
                                                                    href={`/track-order?id=${order.id}`}
                                                                    className="p-4 flex items-center gap-4 hover:bg-neutral-50 transition-colors"
                                                                >
                                                                    <div className="w-12 h-14 bg-neutral-100 rounded-lg relative overflow-hidden">
                                                                        {order.items[0] && (
                                                                            <Image src={order.items[0].image} alt="" fill className="object-cover" />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-sm">{formatOrderId(order.id)}</p>
                                                                        <p className="text-xs text-neutral-500">{formatDate(order.created_at)} • {totalItemCount(order)} item(s)</p>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className="font-bold text-sm">₹{order.amount.toLocaleString()}</p>
                                                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(order.delivery_status)}`}>
                                                                            <StatusIcon className="w-2.5 h-2.5" />
                                                                            {getStatusLabel(order.delivery_status)}
                                                                        </span>
                                                                    </div>
                                                                    <ChevronRight className="w-4 h-4 text-neutral-300" />
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === "orders" && (
                                        <div className="space-y-6">
                                            <div>
                                                <h1 className="font-display text-3xl font-bold mb-2">Order History</h1>
                                                <p className="text-neutral-500">Track current orders and view past receipts.</p>
                                            </div>

                                            {ordersLoading ? (
                                                <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-12 flex items-center justify-center">
                                                    <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
                                                </div>
                                            ) : orders.length === 0 ? (
                                                <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-12 text-center">
                                                    <div className="w-20 h-20 bg-neutral-50 rounded-2xl rotate-45 flex items-center justify-center mx-auto mb-8 border border-neutral-100">
                                                        <div className="-rotate-45">
                                                            <ShoppingBag className="w-10 h-10 text-neutral-300" />
                                                        </div>
                                                    </div>
                                                    <h3 className="font-display font-bold text-2xl mb-3">No orders yet</h3>
                                                    <p className="text-neutral-500 max-w-md mx-auto mb-8 leading-relaxed">
                                                        Looks like you haven't made your first purchase yet. Check out our latest collection and treat yourself to something special.
                                                    </p>
                                                    <Link
                                                        href="/products"
                                                        className="inline-flex items-center justify-center h-12 px-8 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 hover:scale-105 transition-all duration-300"
                                                    >
                                                        Shop Now
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {orders.map((order) => {
                                                        const StatusIcon = getStatusIcon(order.delivery_status);
                                                        const isExpanded = expandedOrder === order.id;

                                                        return (
                                                            <div key={order.id} className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm overflow-hidden">
                                                                {/* Order Header */}
                                                                <div className="p-5">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="w-14 h-16 bg-neutral-100 rounded-lg relative overflow-hidden">
                                                                                {order.items[0] && (
                                                                                    <Image src={order.items[0].image} alt="" fill className="object-cover" />
                                                                                )}
                                                                                {order.items.length > 1 && (
                                                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-bold">
                                                                                        +{order.items.length - 1}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="text-left">
                                                                                <p className="font-bold">{formatOrderId(order.id)}</p>
                                                                                <p className="text-xs text-neutral-500 mt-0.5">{formatDate(order.created_at)} • {totalItemCount(order)} item(s)</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="text-right">
                                                                                <p className="font-bold">₹{order.amount.toLocaleString()}</p>
                                                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.delivery_status)}`}>
                                                                                    <StatusIcon className="w-3 h-3" />
                                                                                    {getStatusLabel(order.delivery_status)}
                                                                                </span>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                                                                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                                                                            >
                                                                                {isExpanded ? (
                                                                                    <ChevronUp className="w-5 h-5 text-neutral-400" />
                                                                                ) : (
                                                                                    <ChevronDown className="w-5 h-5 text-neutral-400" />
                                                                                )}
                                                                            </button>
                                                                        </div>
                                                                    </div>

                                                                    {/* Mini Tracker */}
                                                                    <MiniTracker order={order} />
                                                                </div>

                                                                {/* Order Details (Expanded) */}
                                                                <AnimatePresence>
                                                                    {isExpanded && (
                                                                        <motion.div
                                                                            initial={{ height: 0, opacity: 0 }}
                                                                            animate={{ height: "auto", opacity: 1 }}
                                                                            exit={{ height: 0, opacity: 0 }}
                                                                            transition={{ duration: 0.2 }}
                                                                            className="overflow-hidden"
                                                                        >
                                                                            <div className="px-5 pb-5 border-t border-neutral-100 pt-5 space-y-4">
                                                                                {/* Track Order Button */}
                                                                                <Link
                                                                                    href={`/track-order?id=${order.id}`}
                                                                                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
                                                                                >
                                                                                    <Truck className="w-4 h-4" />
                                                                                    Track Order
                                                                                    <ExternalLink className="w-3 h-3" />
                                                                                </Link>

                                                                                {/* Items */}
                                                                                <div>
                                                                                    <p className="text-xs font-bold uppercase text-neutral-500 mb-3">Items</p>
                                                                                    <div className="space-y-3">
                                                                                        {order.items.map((item, index) => (
                                                                                            <div key={index} className="flex gap-3 bg-neutral-50 rounded-xl p-3">
                                                                                                <div className="w-14 h-18 relative rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0">
                                                                                                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                                                                </div>
                                                                                                <div className="flex-1 min-w-0">
                                                                                                    <p className="font-medium text-sm truncate">{item.title}</p>
                                                                                                    <p className="text-xs text-neutral-500 mt-0.5">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                                                                                                    <p className="font-bold text-sm mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>

                                                                                {/* Shipping Address */}
                                                                                <div>
                                                                                    <p className="text-xs font-bold uppercase text-neutral-500 mb-2">Shipping Address</p>
                                                                                    <div className="bg-neutral-50 rounded-xl p-3 text-sm text-neutral-600">
                                                                                        <p className="font-medium text-neutral-900">{order.shipping_address.firstName} {order.shipping_address.lastName}</p>
                                                                                        <p>{order.shipping_address.address}</p>
                                                                                        <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}</p>
                                                                                        <p className="mt-1">{order.shipping_address.phone}</p>
                                                                                    </div>
                                                                                </div>

                                                                                {/* Need Help */}
                                                                                <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-3">
                                                                                    <div className="text-sm">
                                                                                        <p className="font-medium">Need help with this order?</p>
                                                                                        <p className="text-xs text-neutral-500">Contact our support team</p>
                                                                                    </div>
                                                                                    <a
                                                                                        href={`tel:${CUSTOMER_CARE.phone}`}
                                                                                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                                                                                    >
                                                                                        <Phone className="w-4 h-4" />
                                                                                        Call Now
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "wishlist" && (
                                        <div className="space-y-6">
                                            <div>
                                                <h1 className="font-display text-3xl font-bold mb-2">My Wishlist</h1>
                                                <p className="text-neutral-500">Curated by you, saved for later.</p>
                                            </div>

                                            {wishlist.length === 0 ? (
                                                <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-12 text-center">
                                                    <div className="w-20 h-20 bg-red-50 rounded-2xl rotate-12 flex items-center justify-center mx-auto mb-8 border border-red-100">
                                                        <div className="-rotate-12">
                                                            <Heart className="w-10 h-10 text-red-300 fill-red-50" />
                                                        </div>
                                                    </div>
                                                    <h3 className="font-display font-bold text-2xl mb-3">Your wishlist is empty</h3>
                                                    <p className="text-neutral-500 max-w-md mx-auto mb-8 leading-relaxed">
                                                        Heart items you love to save them here. It's the perfect way to keep track of your favorites.
                                                    </p>
                                                    <Link
                                                        href="/products"
                                                        className="inline-flex items-center justify-center h-12 px-8 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-neutral-800 hover:scale-105 transition-all duration-300"
                                                    >
                                                        Explore Collection
                                                    </Link>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                                    {wishlist.map((item) => (
                                                        <Link
                                                            key={item.id}
                                                            href={`/products/${item.handle}`}
                                                            className="bg-white p-4 rounded-2xl border border-neutral-200/60 shadow-sm flex gap-5 hover:border-black/20 hover:shadow-md transition-all duration-300 group"
                                                        >
                                                            <div className="w-24 h-32 bg-neutral-100 relative rounded-xl overflow-hidden flex-shrink-0">
                                                                <Image
                                                                    src={item.image}
                                                                    alt={item.title}
                                                                    fill
                                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                                />
                                                            </div>
                                                            <div className="flex-1 flex flex-col justify-center py-2">
                                                                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">{item.category}</span>
                                                                <h4 className="font-display font-bold text-lg mb-1 line-clamp-1 group-hover:text-neutral-600 transition-colors">{item.title}</h4>
                                                                <p className="font-bold text-neutral-900 mb-4">₹{item.price.toLocaleString()}</p>
                                                                <span className="text-xs font-medium underline">View Details</span>
                                                            </div>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "settings" && (
                                        <div className="space-y-6">
                                            <div>
                                                <h1 className="font-display text-3xl font-bold mb-2">Settings</h1>
                                                <p className="text-neutral-500">Manage your profile and account preferences.</p>
                                            </div>

                                            <div className="bg-white rounded-2xl border border-neutral-200/60 shadow-sm p-8">
                                                <div className="max-w-xl">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">First Name</label>
                                                            <input
                                                                type="text"
                                                                defaultValue={user.user_metadata?.first_name}
                                                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Last Name</label>
                                                            <input
                                                                type="text"
                                                                defaultValue={user.user_metadata?.last_name}
                                                                className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-8">
                                                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Email Address</label>
                                                        <input
                                                            type="email"
                                                            disabled
                                                            defaultValue={user.email}
                                                            className="w-full bg-neutral-100 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-500 cursor-not-allowed"
                                                        />
                                                    </div>

                                                    <button className="px-8 py-3 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 hover:shadow-lg transition-all duration-300">
                                                        Save Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </FadeIn>
            </Container>
        </div>
    );
}
