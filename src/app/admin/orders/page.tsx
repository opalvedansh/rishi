"use client";

import { useState, useEffect } from "react";
import { Search, Filter, Eye, Truck, CheckCircle, XCircle, Clock, Loader2, Package, CreditCard, MapPin, ChevronDown, X, Phone, Save } from "lucide-react";
import { getAllOrders, Order, updateDeliveryStatus, updateOrderTracking, DeliveryStatus, DELIVERY_STEPS, getDeliveryStepIndex, CUSTOMER_CARE } from "@/lib/supabase/orders";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [isUpdating, setIsUpdating] = useState(false);

    // Status update form
    const [newStatus, setNewStatus] = useState<DeliveryStatus>("confirmed");
    const [statusMessage, setStatusMessage] = useState("");
    const [statusLocation, setStatusLocation] = useState("");

    // Tracking info form
    const [trackingNumber, setTrackingNumber] = useState("");
    const [courierName, setCourierName] = useState("");
    const [estimatedDelivery, setEstimatedDelivery] = useState("");

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setIsLoading(true);
        const data = await getAllOrders();
        setOrders(data);
        setIsLoading(false);
    }

    const getStatusColor = (status: DeliveryStatus) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
            case 'confirmed': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'processing': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'in_transit': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'out_for_delivery': return 'bg-green-50 text-green-700 border-green-100';
            case 'delivered': return 'bg-green-50 text-green-700 border-green-100';
            case 'cancelled': return 'bg-red-50 text-red-700 border-red-100';
            case 'returned': return 'bg-orange-50 text-orange-700 border-orange-100';
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
            case 'pending': return 'Pending Payment';
            case 'confirmed': return 'Order Confirmed';
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
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatOrderId = (id: string) => {
        return `#ORD-${id.slice(0, 6).toUpperCase()}`;
    };

    const filteredOrders = orders.filter(order => {
        const query = searchQuery.toLowerCase();
        const customerName = `${order.shipping_address.firstName} ${order.shipping_address.lastName}`.toLowerCase();
        const email = order.shipping_address.email.toLowerCase();
        const orderId = order.id.toLowerCase();

        const matchesSearch = customerName.includes(query) || email.includes(query) || orderId.includes(query);
        const matchesFilter = filterStatus === "all" || order.delivery_status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const totalItemCount = (order: Order) => order.items.reduce((sum, item) => sum + item.quantity, 0);

    const handleStatusUpdate = async () => {
        if (!selectedOrder || !statusMessage.trim()) return;

        setIsUpdating(true);
        const updated = await updateDeliveryStatus(
            selectedOrder.id,
            newStatus,
            statusMessage,
            statusLocation || undefined
        );

        if (updated) {
            setOrders(orders.map(o => o.id === updated.id ? updated : o));
            setSelectedOrder(updated);
            setStatusMessage("");
            setStatusLocation("");
        }
        setIsUpdating(false);
    };

    const handleTrackingUpdate = async () => {
        if (!selectedOrder) return;

        setIsUpdating(true);
        const updated = await updateOrderTracking(
            selectedOrder.id,
            trackingNumber,
            courierName,
            estimatedDelivery || undefined
        );

        if (updated) {
            setOrders(orders.map(o => o.id === updated.id ? updated : o));
            setSelectedOrder(updated);
        }
        setIsUpdating(false);
    };

    const openOrderModal = (order: Order) => {
        setSelectedOrder(order);
        setNewStatus(order.delivery_status);
        setTrackingNumber(order.tracking_number || "");
        setCourierName(order.courier_name || "");
        setEstimatedDelivery(order.estimated_delivery || "");
    };

    const statusFilters = [
        { value: "all", label: "All Orders" },
        { value: "pending", label: "Pending" },
        { value: "confirmed", label: "Confirmed" },
        { value: "processing", label: "Processing" },
        { value: "shipped", label: "Shipped" },
        { value: "in_transit", label: "In Transit" },
        { value: "out_for_delivery", label: "Out for Delivery" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const deliveryStatusOptions: { value: DeliveryStatus; label: string }[] = [
        { value: "confirmed", label: "Order Confirmed" },
        { value: "processing", label: "Processing" },
        { value: "shipped", label: "Shipped" },
        { value: "in_transit", label: "In Transit" },
        { value: "out_for_delivery", label: "Out for Delivery" },
        { value: "delivered", label: "Delivered" },
        { value: "cancelled", label: "Cancelled" },
        { value: "returned", label: "Returned" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-neutral-900">Orders</h1>
                    <p className="text-neutral-500 mt-1">Manage and fulfill customer orders.</p>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-white border border-neutral-200 text-neutral-600 px-4 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:border-black"
                    >
                        {statusFilters.map(filter => (
                            <option key={filter.value} value={filter.value}>{filter.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID, customer, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                    />
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <Package className="w-12 h-12 text-neutral-200 mb-4" />
                        <h3 className="font-medium text-neutral-600">No orders yet</h3>
                        <p className="text-sm text-neutral-400 mt-1">Orders will appear here once customers make purchases.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-neutral-50 border-b border-neutral-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Order</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Customer</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Date</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Total</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Items</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-neutral-500">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {filteredOrders.map((order) => {
                                        const StatusIcon = getStatusIcon(order.delivery_status);
                                        return (
                                            <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-4 font-bold text-neutral-900">
                                                    {formatOrderId(order.id)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-neutral-900">
                                                        {order.shipping_address.firstName} {order.shipping_address.lastName}
                                                    </p>
                                                    <p className="text-xs text-neutral-500">{order.shipping_address.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-neutral-500 text-sm">
                                                    {formatDate(order.created_at)}
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    ₹{order.amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.delivery_status)}`}>
                                                        <StatusIcon className="w-3 h-3" />
                                                        {getStatusLabel(order.delivery_status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-neutral-500">
                                                    {totalItemCount(order)} item{totalItemCount(order) !== 1 ? 's' : ''}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end">
                                                        <button
                                                            onClick={() => openOrderModal(order)}
                                                            className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-100 flex items-center justify-between text-sm">
                            <p className="text-neutral-500">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredOrders.length}</span> of <span className="font-medium">{orders.length}</span> results
                            </p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 border border-neutral-200 bg-white rounded-lg text-neutral-600 disabled:opacity-50">Previous</button>
                                <button className="px-4 py-2 border border-neutral-200 bg-white rounded-lg text-neutral-600 disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="font-display text-xl font-bold">Order {formatOrderId(selectedOrder.id)}</h2>
                                    <p className="text-sm text-neutral-500 mt-1">{formatDate(selectedOrder.created_at)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(selectedOrder.delivery_status)}`}>
                                        {getStatusLabel(selectedOrder.delivery_status)}
                                    </span>
                                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-neutral-100 rounded-lg">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Customer Info */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-neutral-500 mb-3">Customer Information</h3>
                                        <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                                            <p className="font-medium">{selectedOrder.shipping_address.firstName} {selectedOrder.shipping_address.lastName}</p>
                                            <p className="text-sm text-neutral-600">{selectedOrder.shipping_address.email}</p>
                                            <a href={`tel:${selectedOrder.shipping_address.phone}`} className="text-sm text-blue-600 flex items-center gap-1">
                                                <Phone className="w-3 h-3" />
                                                {selectedOrder.shipping_address.phone}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-neutral-500 mb-3">Shipping Address</h3>
                                        <div className="bg-neutral-50 rounded-lg p-4">
                                            <p className="text-sm text-neutral-600">
                                                {selectedOrder.shipping_address.address}<br />
                                                {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zip}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-neutral-500 mb-3">Order Items</h3>
                                        <div className="space-y-3">
                                            {selectedOrder.items.map((item, index) => (
                                                <div key={index} className="flex gap-4 bg-neutral-50 rounded-lg p-3">
                                                    <div className="w-14 h-18 relative rounded overflow-hidden bg-neutral-200">
                                                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{item.title}</p>
                                                        <p className="text-xs text-neutral-500">Size: {item.selectedSize} • Qty: {item.quantity}</p>
                                                        <p className="text-sm font-medium mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-neutral-200 flex justify-between">
                                            <span className="font-medium">Total</span>
                                            <span className="font-bold">₹{selectedOrder.amount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Payment Info */}
                                    <div>
                                        <h3 className="text-xs font-bold uppercase text-neutral-500 mb-3">Payment Details</h3>
                                        <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-neutral-600">Payment Status</span>
                                                <span className={`font-medium capitalize ${selectedOrder.payment_status === 'paid' ? 'text-green-600' :
                                                        selectedOrder.payment_status === 'failed' ? 'text-red-600' :
                                                            'text-yellow-600'
                                                    }`}>
                                                    {selectedOrder.payment_status}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-neutral-600">Razorpay Order ID</span>
                                                <span className="font-mono text-xs">{selectedOrder.razorpay_order_id}</span>
                                            </div>
                                            {selectedOrder.razorpay_payment_id && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-neutral-600">Payment ID</span>
                                                    <span className="font-mono text-xs">{selectedOrder.razorpay_payment_id}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Status Updates */}
                                <div className="space-y-6">
                                    {/* Update Tracking Info */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                        <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                            <Truck className="w-4 h-4" />
                                            Tracking Information
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-blue-800 mb-1">Tracking Number</label>
                                                <input
                                                    type="text"
                                                    value={trackingNumber}
                                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                                    placeholder="e.g. AWB123456789"
                                                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-blue-800 mb-1">Courier Name</label>
                                                <input
                                                    type="text"
                                                    value={courierName}
                                                    onChange={(e) => setCourierName(e.target.value)}
                                                    placeholder="e.g. Delhivery, BlueDart"
                                                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-blue-800 mb-1">Estimated Delivery</label>
                                                <input
                                                    type="text"
                                                    value={estimatedDelivery}
                                                    onChange={(e) => setEstimatedDelivery(e.target.value)}
                                                    placeholder="e.g. Feb 5 - Feb 7, 2026"
                                                    className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            <button
                                                onClick={handleTrackingUpdate}
                                                disabled={isUpdating}
                                                className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                Save Tracking Info
                                            </button>
                                        </div>
                                    </div>

                                    {/* Update Status */}
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <h3 className="font-bold text-green-900 mb-3 flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4" />
                                            Update Status
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-green-800 mb-1">New Status</label>
                                                <select
                                                    value={newStatus}
                                                    onChange={(e) => setNewStatus(e.target.value as DeliveryStatus)}
                                                    className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                                                >
                                                    {deliveryStatusOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-green-800 mb-1">Status Message *</label>
                                                <input
                                                    type="text"
                                                    value={statusMessage}
                                                    onChange={(e) => setStatusMessage(e.target.value)}
                                                    placeholder="e.g. Package has been dispatched"
                                                    className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-green-800 mb-1">Location (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={statusLocation}
                                                    onChange={(e) => setStatusLocation(e.target.value)}
                                                    placeholder="e.g. Mumbai Hub"
                                                    className="w-full px-3 py-2 bg-white border border-green-200 rounded-lg text-sm focus:outline-none focus:border-green-500"
                                                />
                                            </div>
                                            <button
                                                onClick={handleStatusUpdate}
                                                disabled={isUpdating || !statusMessage.trim()}
                                                className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                                Update Status
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tracking History */}
                                    {selectedOrder.tracking_updates && selectedOrder.tracking_updates.length > 0 && (
                                        <div>
                                            <h3 className="text-xs font-bold uppercase text-neutral-500 mb-3">Tracking History</h3>
                                            <div className="bg-neutral-50 rounded-lg p-4 max-h-48 overflow-y-auto">
                                                <div className="space-y-3">
                                                    {[...selectedOrder.tracking_updates].reverse().map((update, index) => (
                                                        <div key={index} className="flex gap-3">
                                                            <div className={`w-2 h-2 rounded-full mt-1.5 ${index === 0 ? 'bg-green-500' : 'bg-neutral-300'}`} />
                                                            <div>
                                                                <p className="text-sm font-medium">{update.message}</p>
                                                                <p className="text-xs text-neutral-500">
                                                                    {formatDate(update.timestamp)}
                                                                    {update.location && ` • ${update.location}`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
