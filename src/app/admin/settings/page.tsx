"use client";

import { useState } from "react";
import {
    Store, Mail, Phone, MapPin, Globe, CreditCard, Truck, Bell,
    Moon, Sun, Shield, Key, Save, Loader2, Check, Upload, Trash2,
    Palette, Eye, EyeOff, AlertCircle, Instagram, Facebook, MessageCircle, Package
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("general");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);

    // Form states
    const [storeSettings, setStoreSettings] = useState({
        storeName: "Doree",
        storeEmail: "Doreebysvd@gmail.com",
        storePhone: "+91 98765 43210",
        storeAddress: "Flat no 130, Surya Vihar Part 2, Sector 91, Faridabad, Haryana - 121003",
        currency: "INR",
        timezone: "Asia/Kolkata",
    });

    const [shippingSettings, setShippingSettings] = useState({
        freeShippingThreshold: "999",
        standardShippingRate: "99",
        expressShippingRate: "199",
        processingDays: "1-2",
        deliveryDays: "3-5",
    });

    const [notificationSettings, setNotificationSettings] = useState({
        orderConfirmation: true,
        orderShipped: true,
        orderDelivered: true,
        lowStock: true,
        newCustomer: false,
        newsletter: true,
    });

    const [socialSettings, setSocialSettings] = useState({
        instagram: "https://instagram.com/doree",
        facebook: "https://facebook.com/doree",
        whatsapp: "+919876543210",
    });

    const [paymentSettings, setPaymentSettings] = useState({
        razorpayKeyId: "rzp_test_xxxxx",
        razorpayKeySecret: "••••••••••••••••",
        codEnabled: true,
        upiEnabled: true,
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: "general", name: "General", icon: Store },
        { id: "shipping", name: "Shipping", icon: Truck },
        { id: "payments", name: "Payments", icon: CreditCard },
        { id: "notifications", name: "Notifications", icon: Bell },
        { id: "social", name: "Social Media", icon: Globe },
    ];

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <h1 className="font-display text-3xl font-bold text-neutral-900">Settings</h1>
                    <p className="text-neutral-500 mt-1">Manage your store configuration and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-all disabled:opacity-50 shadow-lg"
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : saved ? (
                        <>
                            <Check className="w-5 h-5" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            {/* Success Banner */}
            <AnimatePresence>
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"
                    >
                        <Check className="w-5 h-5" />
                        Settings saved successfully!
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-2 sticky top-24">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                    ? "bg-black text-white font-medium"
                                    : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9 space-y-6">
                    {/* General Settings */}
                    {activeTab === "general" && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            {/* Store Information */}
                            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                        <Store className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-neutral-900">Store Information</h2>
                                        <p className="text-xs text-neutral-500">Basic details about your store</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Store Name</label>
                                            <input
                                                type="text"
                                                value={storeSettings.storeName}
                                                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Store Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                                <input
                                                    type="email"
                                                    value={storeSettings.storeEmail}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone Number</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                                <input
                                                    type="tel"
                                                    value={storeSettings.storePhone}
                                                    onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                                                    className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Currency</label>
                                            <select
                                                value={storeSettings.currency}
                                                onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="INR">₹ INR - Indian Rupee</option>
                                                <option value="USD">$ USD - US Dollar</option>
                                                <option value="EUR">€ EUR - Euro</option>
                                                <option value="GBP">£ GBP - British Pound</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Store Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-neutral-400" />
                                            <textarea
                                                rows={2}
                                                value={storeSettings.storeAddress}
                                                onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Store Logo */}
                            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                        <Palette className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-neutral-900">Branding</h2>
                                        <p className="text-xs text-neutral-500">Logo and visual identity</p>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 bg-neutral-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-300">
                                            <span className="font-display text-2xl font-bold text-neutral-400">D</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-neutral-900 mb-1">Store Logo</h3>
                                            <p className="text-sm text-neutral-500 mb-3">Recommended size: 200x200px. PNG or SVG.</p>
                                            <div className="flex gap-2">
                                                <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2">
                                                    <Upload className="w-4 h-4" />
                                                    Upload Logo
                                                    <input type="file" className="hidden" accept="image/*" />
                                                </label>
                                                <button className="px-4 py-2 border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors flex items-center gap-2">
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Shipping Settings */}
                    {activeTab === "shipping" && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-neutral-900">Shipping Rates</h2>
                                        <p className="text-xs text-neutral-500">Configure delivery charges</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Free Shipping Threshold (₹)</label>
                                            <input
                                                type="number"
                                                value={shippingSettings.freeShippingThreshold}
                                                onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                            />
                                            <p className="text-xs text-neutral-400 mt-2">Orders above this amount get free shipping</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Standard Shipping (₹)</label>
                                            <input
                                                type="number"
                                                value={shippingSettings.standardShippingRate}
                                                onChange={(e) => setShippingSettings({ ...shippingSettings, standardShippingRate: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Express Shipping (₹)</label>
                                            <input
                                                type="number"
                                                value={shippingSettings.expressShippingRate}
                                                onChange={(e) => setShippingSettings({ ...shippingSettings, expressShippingRate: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-neutral-700 mb-2">Processing Time</label>
                                            <select
                                                value={shippingSettings.processingDays}
                                                onChange={(e) => setShippingSettings({ ...shippingSettings, processingDays: e.target.value })}
                                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="1-2">1-2 business days</option>
                                                <option value="2-3">2-3 business days</option>
                                                <option value="3-5">3-5 business days</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Zones Info Card */}
                            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 mb-1">Delivery Zones</h3>
                                        <p className="text-sm text-neutral-600 mb-3">Currently shipping to all India. Contact support to add international shipping zones.</p>
                                        <button className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors">
                                            Contact Support →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Payment Settings */}
                    {activeTab === "payments" && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-neutral-900">Razorpay Integration</h2>
                                        <p className="text-xs text-neutral-500">Configure your payment gateway</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-amber-800 font-medium">Security Notice</p>
                                            <p className="text-xs text-amber-700">Never share your API keys. Store them securely in environment variables.</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Razorpay Key ID</label>
                                        <div className="relative">
                                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                            <input
                                                type="text"
                                                value={paymentSettings.razorpayKeyId}
                                                onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeyId: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Razorpay Key Secret</label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                                            <input
                                                type={showApiKey ? "text" : "password"}
                                                value={paymentSettings.razorpayKeySecret}
                                                onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeySecret: e.target.value })}
                                                className="w-full pl-11 pr-12 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all font-mono text-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowApiKey(!showApiKey)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                                            >
                                                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-100">
                                        <h3 className="font-semibold text-neutral-900 mb-4">Payment Methods</h3>
                                        <div className="space-y-3">
                                            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="w-5 h-5 text-neutral-600" />
                                                    <span className="font-medium">Cards & UPI (Razorpay)</span>
                                                </div>
                                                <div className="w-11 h-6 bg-green-500 rounded-full relative">
                                                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow"></div>
                                                </div>
                                            </label>
                                            <label className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Package className="w-5 h-5 text-neutral-600" />
                                                    <span className="font-medium">Cash on Delivery (COD)</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    checked={paymentSettings.codEnabled}
                                                    onChange={(e) => setPaymentSettings({ ...paymentSettings, codEnabled: e.target.checked })}
                                                    className="w-5 h-5 rounded border-neutral-300 text-black focus:ring-black"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === "notifications" && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-neutral-900">Email Notifications</h2>
                                        <p className="text-xs text-neutral-500">Choose which emails you receive</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    {[
                                        { key: "orderConfirmation", label: "Order Confirmation", desc: "When a new order is placed" },
                                        { key: "orderShipped", label: "Order Shipped", desc: "When an order is marked as shipped" },
                                        { key: "orderDelivered", label: "Order Delivered", desc: "When an order is delivered" },
                                        { key: "lowStock", label: "Low Stock Alert", desc: "When product stock is low" },
                                        { key: "newCustomer", label: "New Customer", desc: "When someone creates an account" },
                                        { key: "newsletter", label: "Newsletter Subscriptions", desc: "When someone subscribes to newsletter" },
                                    ].map((item) => (
                                        <label
                                            key={item.key}
                                            className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100 transition-colors"
                                        >
                                            <div>
                                                <span className="font-medium text-neutral-900 block">{item.label}</span>
                                                <span className="text-xs text-neutral-500">{item.desc}</span>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                                                onChange={(e) =>
                                                    setNotificationSettings({
                                                        ...notificationSettings,
                                                        [item.key]: e.target.checked,
                                                    })
                                                }
                                                className="w-5 h-5 rounded border-neutral-300 text-black focus:ring-black"
                                            />
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Social Media Settings */}
                    {activeTab === "social" && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                                <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                                        <Globe className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-neutral-900">Social Media Links</h2>
                                        <p className="text-xs text-neutral-500">Connect your social accounts</p>
                                    </div>
                                </div>
                                <div className="p-6 space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Instagram</label>
                                        <div className="relative">
                                            <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-500" />
                                            <input
                                                type="url"
                                                value={socialSettings.instagram}
                                                onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                                placeholder="https://instagram.com/yourbrand"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">Facebook</label>
                                        <div className="relative">
                                            <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-600" />
                                            <input
                                                type="url"
                                                value={socialSettings.facebook}
                                                onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                                placeholder="https://facebook.com/yourbrand"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-neutral-700 mb-2">WhatsApp Business</label>
                                        <div className="relative">
                                            <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                                            <input
                                                type="tel"
                                                value={socialSettings.whatsapp}
                                                onChange={(e) => setSocialSettings({ ...socialSettings, whatsapp: e.target.value })}
                                                className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                        <p className="text-xs text-neutral-400 mt-2">Include country code for WhatsApp click-to-chat</p>
                                    </div>
                                </div>
                            </div>

                            {/* Social Preview */}
                            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">Live Preview</h3>
                                <div className="flex items-center gap-4">
                                    {socialSettings.instagram && (
                                        <a href={socialSettings.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center hover:scale-110 transition-transform">
                                            <Instagram className="w-5 h-5" />
                                        </a>
                                    )}
                                    {socialSettings.facebook && (
                                        <a href={socialSettings.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:scale-110 transition-transform">
                                            <Facebook className="w-5 h-5" />
                                        </a>
                                    )}
                                    {socialSettings.whatsapp && (
                                        <a href={`https://wa.me/${socialSettings.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 transition-transform">
                                            <MessageCircle className="w-5 h-5" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
