"use client";

import { DollarSign, ShoppingBag, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Package } from "lucide-react";

export default function AdminDashboard() {
    const stats = [
        {
            name: "Total Revenue",
            value: "₹45,231.89",
            change: "+20.1%",
            trend: "up",
            icon: DollarSign,
        },
        {
            name: "Active Orders",
            value: "12",
            change: "+4",
            trend: "up",
            icon: ShoppingBag,
            highlight: true,
        },
        {
            name: "Total Customers",
            value: "573",
            change: "+12.5%",
            trend: "up",
            icon: Users,
        },
        {
            name: "Products in Stock",
            value: "142",
            change: "-2",
            trend: "down",
            icon: Package,
        },
    ];

    const recentOrders = [
        { id: "#ORD-7752", customer: "Liam Johnson", total: "₹3,400", status: "Processing", date: "Just now" },
        { id: "#ORD-7751", customer: "Olivia Smith", total: "₹1,250", status: "Shipped", date: "2 hours ago" },
        { id: "#ORD-7750", customer: "Noah Williams", total: "₹8,900", status: "Delivered", date: "5 hours ago" },
        { id: "#ORD-7749", customer: "Emma Brown", total: "₹2,100", status: "Cancelled", date: "1 day ago" },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="font-display text-3xl font-bold text-neutral-900">Dashboard</h1>
                    <p className="text-neutral-500 mt-1">Overview of your store's performance.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-neutral-200 text-neutral-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors">
                        Download Report
                    </button>
                    <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors">
                        Add Product
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-xl shadow-sm border border-neutral-100 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.highlight ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.trend === "up" ? (
                                <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                    <ArrowUpRight className="w-3 h-3 mr-1" />
                                    {stat.change}
                                </span>
                            ) : (
                                <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                    <ArrowDownRight className="w-3 h-3 mr-1" />
                                    {stat.change}
                                </span>
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
                        <button className="text-sm text-neutral-500 hover:text-black font-medium">View All</button>
                    </div>
                    <div className="overflow-x-auto">
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
                                        <td className="px-6 py-4 font-medium text-neutral-900">{order.id}</td>
                                        <td className="px-6 py-4 text-neutral-600">{order.customer}</td>
                                        <td className="px-6 py-4 text-neutral-500">{order.date}</td>
                                        <td className="px-6 py-4 font-medium text-neutral-900">{order.total}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'Processing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    order.status === 'Shipped' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                        order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                                            'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products / Low Stock */}
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                    <h2 className="font-display text-lg font-bold mb-4">Stock Alerts</h2>
                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-neutral-100 hover:border-black/10 transition-colors">
                                <div className="w-12 h-12 bg-neutral-100 rounded-md flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm truncate">Oxford Heritage Knit</p>
                                    <p className="text-xs text-red-500 font-medium">Only 3 left in stock</p>
                                </div>
                                <button className="text-xs font-bold underline">Restock</button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-3 border border-neutral-200 rounded-lg text-sm font-bold text-neutral-600 hover:bg-neutral-50 hover:text-black transition-colors">
                        View Inventory
                    </button>
                </div>
            </div>
        </div>
    );
}
