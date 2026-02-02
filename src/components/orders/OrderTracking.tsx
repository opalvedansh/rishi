"use client";

import { Order, DELIVERY_STEPS, getDeliveryStepIndex, CUSTOMER_CARE, DeliveryStatus } from "@/lib/supabase/orders";
import { Package, Truck, CheckCircle, MapPin, Phone, MessageCircle, Mail, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface OrderTrackingProps {
    order: Order;
}

export default function OrderTracking({ order }: OrderTrackingProps) {
    const currentStepIndex = getDeliveryStepIndex(order.delivery_status);
    const isCancelled = order.delivery_status === 'cancelled' || order.delivery_status === 'returned';
    const isPending = order.delivery_status === 'pending';

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStepIcon = (index: number) => {
        if (index === 0) return Package;
        if (index === 1) return Package;
        if (index <= 3) return Truck;
        if (index === 4) return MapPin;
        return CheckCircle;
    };

    return (
        <div className="space-y-6">
            {/* Tracking Progress */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-display font-bold text-lg mb-6">Order Status</h3>

                {isPending && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-yellow-800">Awaiting Payment</p>
                            <p className="text-sm text-yellow-600">Complete your payment to confirm this order.</p>
                        </div>
                    </div>
                )}

                {isCancelled && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-red-800">
                                {order.delivery_status === 'cancelled' ? 'Order Cancelled' : 'Order Returned'}
                            </p>
                            <p className="text-sm text-red-600">
                                {order.delivery_status === 'cancelled'
                                    ? 'This order has been cancelled.'
                                    : 'This order has been returned.'}
                            </p>
                        </div>
                    </div>
                )}

                {!isPending && !isCancelled && (
                    <>
                        {/* Progress Bar */}
                        <div className="relative mb-8">
                            {/* Background Line */}
                            <div className="absolute top-5 left-5 right-5 h-1 bg-neutral-200 rounded-full" />

                            {/* Progress Line */}
                            <motion.div
                                className="absolute top-5 left-5 h-1 bg-green-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{
                                    width: `${Math.max(0, (currentStepIndex / (DELIVERY_STEPS.length - 1)) * 100)}%`
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{ maxWidth: 'calc(100% - 40px)' }}
                            />

                            {/* Steps */}
                            <div className="relative flex justify-between">
                                {DELIVERY_STEPS.map((step, index) => {
                                    const isCompleted = index <= currentStepIndex;
                                    const isCurrent = index === currentStepIndex;
                                    const StepIcon = getStepIcon(index);

                                    return (
                                        <div key={step.status} className="flex flex-col items-center">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                                className={`
                                                    w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300
                                                    ${isCompleted
                                                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                                                        : 'bg-neutral-100 text-neutral-400 border-2 border-neutral-200'
                                                    }
                                                    ${isCurrent ? 'ring-4 ring-green-100' : ''}
                                                `}
                                            >
                                                {isCompleted && index === currentStepIndex ? (
                                                    <StepIcon className="w-5 h-5" />
                                                ) : isCompleted ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <StepIcon className="w-4 h-4" />
                                                )}
                                            </motion.div>
                                            <p className={`mt-3 text-xs font-medium text-center max-w-[80px] ${isCompleted ? 'text-neutral-900' : 'text-neutral-400'}`}>
                                                {step.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Estimated Delivery */}
                        {order.estimated_delivery && (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                                <Truck className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="text-sm text-green-600">Estimated Delivery</p>
                                    <p className="font-medium text-green-800">{order.estimated_delivery}</p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Tracking Details */}
            {order.tracking_number && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h3 className="font-display font-bold text-lg mb-4">Shipment Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-50 rounded-xl p-4">
                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Tracking Number</p>
                            <p className="font-mono font-medium">{order.tracking_number}</p>
                        </div>
                        {order.courier_name && (
                            <div className="bg-neutral-50 rounded-xl p-4">
                                <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Courier</p>
                                <p className="font-medium">{order.courier_name}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Tracking Timeline */}
            {order.tracking_updates && order.tracking_updates.length > 0 && (
                <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                    <h3 className="font-display font-bold text-lg mb-4">Tracking History</h3>
                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-neutral-200" />

                        <div className="space-y-4">
                            {[...order.tracking_updates].reverse().map((update, index) => (
                                <div key={index} className="flex gap-4">
                                    <div className={`
                                        w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10
                                        ${index === 0 ? 'bg-green-500' : 'bg-neutral-200'}
                                    `}>
                                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-neutral-400'}`} />
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className={`font-medium text-sm ${index === 0 ? 'text-neutral-900' : 'text-neutral-600'}`}>
                                            {update.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-xs text-neutral-400">{formatDate(update.timestamp)}</p>
                                            {update.location && (
                                                <>
                                                    <span className="text-neutral-300">•</span>
                                                    <p className="text-xs text-neutral-500 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {update.location}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Customer Care */}
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white">
                <h3 className="font-display font-bold text-lg mb-2">Need Help with Your Order?</h3>
                <p className="text-neutral-400 text-sm mb-6">Our customer support team is here to assist you</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                        href={`tel:${CUSTOMER_CARE.phone}`}
                        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors"
                    >
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400">Call Us</p>
                            <p className="font-medium">{CUSTOMER_CARE.phone}</p>
                        </div>
                    </a>

                    <a
                        href={`https://wa.me/${CUSTOMER_CARE.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors"
                    >
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400">WhatsApp</p>
                            <p className="font-medium">{CUSTOMER_CARE.whatsapp}</p>
                        </div>
                    </a>

                    <a
                        href={`mailto:${CUSTOMER_CARE.email}`}
                        className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-colors sm:col-span-2"
                    >
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs text-neutral-400">Email Support</p>
                            <p className="font-medium">{CUSTOMER_CARE.email}</p>
                        </div>
                    </a>
                </div>

                <p className="text-xs text-neutral-500 mt-4 text-center">
                    Available {CUSTOMER_CARE.hours}
                </p>
            </div>
        </div>
    );
}
