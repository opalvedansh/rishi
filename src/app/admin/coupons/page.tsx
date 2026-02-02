"use client";

import { useState, useEffect } from "react";
import {
    Plus, Search, Tag, Trash2, Power, Eye,
    Calendar, Check, X, AlertCircle, Copy
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    getAllCoupons, createCoupon, toggleCouponStatus, deleteCoupon, Coupon
} from "@/lib/supabase/coupons";
import FadeIn from "@/components/animations/FadeIn";

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        code: "",
        discount_percent: 10,
        min_order_value: 0,
        usage_limit: "",
        expires_at: "",
    });

    useEffect(() => {
        loadCoupons();
    }, []);

    async function loadCoupons() {
        setIsLoading(true);
        try {
            const data = await getAllCoupons();
            setCoupons(data);
        } catch (err) {
            console.error("Failed to load coupons", err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        try {
            const newCoupon = await createCoupon({
                code: formData.code,
                discount_percent: Number(formData.discount_percent),
                min_order_value: Number(formData.min_order_value),
                usage_limit: formData.usage_limit ? Number(formData.usage_limit) : undefined,
                expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : undefined,
                is_active: true
            });

            if (newCoupon) {
                setCoupons([newCoupon, ...coupons]);
                setShowCreateModal(false);
                setFormData({
                    code: "",
                    discount_percent: 10,
                    min_order_value: 0,
                    usage_limit: "",
                    expires_at: "",
                });
            }
        } catch (error) {
            alert("Failed to create coupon. Code might already exist.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setCoupons(coupons.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));

        const success = await toggleCouponStatus(id, !currentStatus);
        if (!success) {
            loadCoupons();
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;

        setCoupons(coupons.filter(c => c.id !== id));

        const success = await deleteCoupon(id);
        if (!success) {
            loadCoupons();
            alert("Failed to delete coupon");
        }
    };

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(`Copied ${code} to clipboard`);
    };

    const filteredCoupons = coupons.filter(coupon =>
        coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Discount Coupons</h1>
                    <p className="text-neutral-500 text-sm mt-1">Manage discount codes and promotions</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-neutral-800 transition-colors shadow-lg shadow-black/20"
                >
                    <Plus className="w-4 h-4" />
                    Create Coupon
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6 flex items-center shadow-sm max-w-md">
                <Search className="w-4 h-4 text-neutral-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search coupon codes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm focus:outline-none"
                />
            </div>

            {/* Coupons List */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-neutral-500">Loading coupons...</div>
                ) : filteredCoupons.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500">
                        {searchQuery ? "No coupons found matching your search." : "No coupons created yet."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-neutral-200">
                                <tr>
                                    <th className="px-6 py-4">Code</th>
                                    <th className="px-6 py-4">Discount</th>
                                    <th className="px-6 py-4">Usage</th>
                                    <th className="px-6 py-4">Min Order</th>
                                    <th className="px-6 py-4">Expiry</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-neutral-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => copyCode(coupon.code)}
                                                className="font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-1 rounded hover:bg-neutral-200 flex items-center gap-2 group"
                                            >
                                                {coupon.code}
                                                <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-green-600">
                                            {coupon.discount_percent}% OFF
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600">
                                            <span className="font-medium text-black">{coupon.used_count}</span>
                                            {coupon.usage_limit && <span className="text-neutral-400"> / {coupon.usage_limit}</span>}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600">
                                            ₹{coupon.min_order_value.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-600">
                                            {coupon.expires_at
                                                ? new Date(coupon.expires_at).toLocaleDateString()
                                                : <span className="text-neutral-400">No Expiry</span>
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={cn(
                                                "px-2 py-1 rounded-full text-xs font-bold uppercase",
                                                coupon.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-neutral-100 text-neutral-500"
                                            )}>
                                                {coupon.is_active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleToggleStatus(coupon.id, coupon.is_active)}
                                                    className={cn(
                                                        "p-2 rounded-lg transition-colors",
                                                        coupon.is_active
                                                            ? "text-green-600 hover:bg-green-50"
                                                            : "text-neutral-400 hover:bg-neutral-100 hover:text-black"
                                                    )}
                                                    title={coupon.is_active ? "Deactivate" : "Activate"}
                                                >
                                                    <Power className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(coupon.id)}
                                                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <FadeIn className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg">Create New Coupon</h3>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-1 hover:bg-neutral-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Coupon Code</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. SUMMER2024"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '') })}
                                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-black focus:outline-none font-mono uppercase"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">Discount (%)</label>
                                    <div className="relative">
                                        <input
                                            required
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={formData.discount_percent}
                                            onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-black focus:outline-none pl-4 pr-8"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">%</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">Min Order (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.min_order_value}
                                        onChange={(e) => setFormData({ ...formData, min_order_value: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-black focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">Usage Limit</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Unlimited"
                                        value={formData.usage_limit}
                                        onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-black focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-1">Expiry Date</label>
                                    <input
                                        type="date"
                                        value={formData.expires_at}
                                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                        className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-black focus:outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 py-3 text-neutral-600 font-bold hover:bg-neutral-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="flex-1 py-3 bg-black text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50"
                                >
                                    {isCreating ? "Creating..." : "Create Coupon"}
                                </button>
                            </div>
                        </form>
                    </FadeIn>
                </div>
            )}
        </div>
    );
}
