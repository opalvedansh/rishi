"use client";

import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getAllOrders, Order } from "@/lib/supabase/orders";
import { getProducts, Product } from "@/lib/supabase/products";

interface DashboardStats {
    totalRevenue: number;
    activeOrders: number;
    totalProducts: number;
    outOfStockProducts: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        activeOrders: 0,
        totalProducts: 0,
        outOfStockProducts: 0,
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            try {
                // Fetch orders and products in parallel
                const [orders, products] = await Promise.all([
                    getAllOrders(),
                    getProducts(),
                ]);

                // Calculate stats
                const totalRevenue = orders
                    .filter((o: Order) => o.delivery_status !== 'cancelled')
                    .reduce((sum: number, order: Order) => sum + order.amount, 0);

                const activeOrders = orders.filter((o: Order) =>
                    o.delivery_status === 'pending' || o.delivery_status === 'processing' || o.delivery_status === 'shipped'
                ).length;

                const outOfStockProducts = products.filter((p: Product) => p.in_stock === false).length;

                setStats({
                    totalRevenue,
                    activeOrders,
                    totalProducts: products.length,
                    outOfStockProducts,
                });

                // Get recent 5 orders
                setRecentOrders(orders.slice(0, 5));

                // Get products that are out of stock
                setLowStockProducts(products.filter((p: Product) => p.in_stock === false).slice(0, 3));

            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboardData();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-neutral-50 text-neutral-700 border-neutral-100';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
        );
    }

    const statsData = [
        {
            name: "Total Revenue",
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: DollarSign,
        },
        {
            name: "Active Orders",
            value: stats.activeOrders.toString(),
            icon: ShoppingBag,
            highlight: true,
        },
        {
            name: "Total Products",
            value: stats.totalProducts.toString(),
            icon: Package,
        },
        {
            name: "Out of Stock",
            value: stats.outOfStockProducts.toString(),
            trend: stats.outOfStockProducts > 0 ? "down" : "up",
            icon: Package,
        },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-neutral-900">Dashboard</h1>
                    <p className="text-neutral-500 mt-1">Overview of your store's performance.</p>
                </div>
                <div className="flex gap-2">
                    <Link
                        href="/admin/products/new"
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                    >
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.highlight ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.trend && (
                                stat.trend === "up" ? (
                                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        <ArrowUpRight className="w-3 h-3 mr-1" />
                                        Good
                                    </span>
                                ) : (
                                    <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                        <ArrowDownRight className="w-3 h-3 mr-1" />
                                        Alert
                                    </span>
                                )
                            )}
                        </div>
                        <h3 className="text-neutral-500 text-sm font-medium">{stat.name}</h3>
                        <p className="text-2xl font-display font-bold text-neutral-900 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                    <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
                        <h2 className="font-display text-lg font-bold">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm text-neutral-500 hover:text-black font-medium">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        {recentOrders.length === 0 ? (
                            <div className="p-8 text-center text-neutral-500">
                                <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-neutral-300" />
                                <p className="font-medium">No orders yet</p>
                                <p className="text-sm">Orders will appear here when customers place them.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-neutral-50 text-neutral-500">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">Order ID</th>
                                        <th className="px-6 py-4 font-medium">Customer</th>
                                        <th className="px-6 py-4 font-medium">Date</th>
                                        <th className="px-6 py-4 font-medium">Total</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-neutral-900">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-600">
                                                {order.shipping_address?.firstName} {order.shipping_address?.lastName}
                                            </td>
                                            <td className="px-6 py-4 text-neutral-500">{formatDate(order.created_at)}</td>
                                            <td className="px-6 py-4 font-medium text-neutral-900">₹{order.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${getStatusColor(order.delivery_status)}`}>
                                                    {order.delivery_status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Out of Stock Products */}
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                    <h2 className="font-display text-lg font-bold mb-4">Stock Alerts</h2>
                    <div className="space-y-4">
                        {lowStockProducts.length === 0 ? (
                            <div className="text-center py-6 text-neutral-500">
                                <Package className="w-10 h-10 mx-auto mb-2 text-green-400" />
                                <p className="text-sm font-medium text-green-600">All products in stock!</p>
                            </div>
                        ) : (
                            lowStockProducts.map((product) => (
                                <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg border border-neutral-100 hover:border-black/10 transition-colors">
                                    <div className="w-12 h-12 bg-neutral-100 rounded-md flex-shrink-0 overflow-hidden">
                                        {product.image && (
                                            <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">{product.title}</p>
                                        <p className="text-xs text-red-500 font-medium">Out of stock</p>
                                    </div>
                                    <Link href={`/admin/products/${product.id}`} className="text-xs font-bold underline">
                                        Edit
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                    <Link
                        href="/admin/products"
                        className="w-full mt-6 py-3 border border-neutral-200 rounded-lg text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-black transition-colors flex items-center justify-center"
                    >
                        View All Products
                    </Link>
                </div>
            </div>
        </div>
    );
}
