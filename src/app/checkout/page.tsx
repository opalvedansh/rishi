"use client";

import { useState, useEffect } from "react";
import { useShop } from "@/context/ShopContext";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, Loader2, CreditCard, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRazorpay } from "@/hooks/useRazorpay";
import { createOrder, updateOrderPayment } from "@/lib/supabase/orders";
import { validateCoupon, incrementCouponUsage, Coupon } from "@/lib/supabase/coupons";
import { Tag, X } from "lucide-react";

export default function CheckoutPage() {
    const { cart, cartCount, clearCart } = useShop();
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const { isLoaded: razorpayLoaded, createOrder: createRazorpayOrder, openCheckout } = useRazorpay();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?redirect=/checkout");
        }
    }, [user, authLoading, router]);

    // Form State
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phone: ""
    });

    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
    const [couponError, setCouponError] = useState("");
    const [discountAmount, setDiscountAmount] = useState(0);
    const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping: number = 0;
    const total = subtotal + shipping - discountAmount;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setIsVerifyingCoupon(true);
        setCouponError("");

        try {
            const result = await validateCoupon(couponCode, subtotal);

            if (result.valid && result.coupon) {
                setAppliedCoupon(result.coupon);
                setDiscountAmount(result.discountAmount || 0);
                setCouponError("");
            } else {
                setCouponError(result.message || "Invalid coupon");
                setAppliedCoupon(null);
                setDiscountAmount(0);
            }
        } catch (error) {
            setCouponError("Failed to apply coupon");
        } finally {
            setIsVerifyingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponCode("");
        setCouponError("");
    };

    const handleRazorpayPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentError(null);
        setIsPaymentProcessing(true);

        try {
            // Create Razorpay order
            const orderId = await createRazorpayOrder(total);

            if (!orderId) {
                throw new Error("Failed to create order. Please try again.");
            }

            // Create order in database (pending status)
            const dbOrder = await createOrder({
                user_id: user!.id,
                razorpay_order_id: orderId,
                amount: total,
                shipping_address: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    zip: formData.zip,
                },
                coupon_code: appliedCoupon?.code,
                discount_amount: discountAmount,
                items: cart.map(item => ({
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    selectedSize: item.selectedSize,
                })),
            });

            if (!dbOrder) {
                throw new Error("Failed to save order. Please try again.");
            }

            // Open Razorpay checkout
            openCheckout({
                amount: total,
                name: "Doree",
                description: `Order for ${cartCount} item(s)`,
                orderId: orderId,
                prefill: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: "#000000",
                },
                onSuccess: async (response) => {
                    // Update order with payment details
                    await updateOrderPayment(
                        response.razorpay_order_id,
                        response.razorpay_payment_id,
                        'paid'
                    );

                    if (appliedCoupon) {
                        await incrementCouponUsage(appliedCoupon.code);
                    }

                    // Clear cart and redirect
                    clearCart();
                    router.push(`/checkout/success?order_id=${dbOrder.id}`);
                },
                onError: async (error) => {
                    console.error("Payment failed:", error);
                    await updateOrderPayment(orderId, "", 'failed');
                    setPaymentError(error?.description || "Payment failed. Please try again.");
                    setIsPaymentProcessing(false);
                },
            });
        } catch (error: any) {
            console.error("Checkout error:", error);
            setPaymentError(error.message || "Something went wrong. Please try again.");
            setIsPaymentProcessing(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    if (cartCount === 0) {
        return (
            <div className="min-h-screen bg-white pt-32 pb-24">
                <Container>
                    <div className="text-center max-w-md mx-auto">
                        <h1 className="font-display text-3xl mb-4">Your cart is empty</h1>
                        <p className="text-neutral-500 mb-8">Add some stylish items to your cart to proceed to checkout.</p>
                        <Link href="/products" className="bg-black text-white px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity">
                            Continue Shopping
                        </Link>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 pt-24 md:pt-32 pb-24">
            <Container>
                <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Cart
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                    {/* Left Column: Form */}
                    <FadeIn>
                        <form onSubmit={handleRazorpayPayment}>
                            {/* Contact Section */}
                            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm mb-6">
                                <h2 className="font-display text-xl mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">1</div>
                                    Contact Information
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                            placeholder="you@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm mb-8">
                                <h2 className="font-display text-xl mb-6 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">2</div>
                                    Shipping Address
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">First Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">Last Name</label>
                                        <input
                                            required
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">Address</label>
                                        <input
                                            required
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                            placeholder="Street address, apartment, suite, etc."
                                        />
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">City</label>
                                        <input
                                            required
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">State</label>
                                        <input
                                            required
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500 mb-1">ZIP Code</label>
                                        <input
                                            required
                                            type="text"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleChange}
                                            className="w-full border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
                            {paymentError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                                    {paymentError}
                                </div>
                            )}

                            {/* Payment Button */}
                            <button
                                type="submit"
                                disabled={isPaymentProcessing || !razorpayLoaded}
                                className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-medium text-lg hover:opacity-95 transition-all flex items-center justify-center gap-3 shadow-lg relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isPaymentProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : !razorpayLoaded ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Loading Payment...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        <span>Pay ₹{total.toLocaleString()}</span>
                                        <span className="bg-gradient-to-r from-transparent via-white/10 to-transparent absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-xs text-neutral-400 mt-4 flex items-center justify-center gap-2">
                                <Lock className="w-3 h-3" />
                                100% Secure Checkout via Razorpay
                            </p>

                            {/* Payment Methods */}
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <div className="text-xs text-neutral-400">Accepted:</div>
                                <div className="flex gap-2">
                                    <div className="px-2 py-1 bg-neutral-100 rounded text-[10px] font-medium">VISA</div>
                                    <div className="px-2 py-1 bg-neutral-100 rounded text-[10px] font-medium">Mastercard</div>
                                    <div className="px-2 py-1 bg-neutral-100 rounded text-[10px] font-medium">UPI</div>
                                    <div className="px-2 py-1 bg-neutral-100 rounded text-[10px] font-medium">Net Banking</div>
                                </div>
                            </div>
                        </form>
                    </FadeIn>

                    {/* Right Column: Order Summary */}
                    <FadeIn delay={0.1}>
                        <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm sticky top-32">
                            <h2 className="font-display text-xl mb-6">Order Summary</h2>

                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4">
                                        <div className="relative w-16 h-20 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute top-0 right-0 bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-bl-md font-medium">
                                                {item.quantity}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium line-clamp-2">{item.title}</h3>
                                            <p className="text-xs text-neutral-500 mt-1">Size: {item.selectedSize}</p>
                                        </div>
                                        <div className="text-sm font-medium">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-neutral-100 pt-6 space-y-3">
                                {/* Coupon Input */}
                                <div className="mb-4">
                                    {!appliedCoupon ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="Coupon Code"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    className="flex-1 border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black uppercase font-medium placeholder:normal-case"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleApplyCoupon}
                                                    disabled={isVerifyingCoupon || !couponCode}
                                                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isVerifyingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                                                </button>
                                            </div>
                                            {couponError && (
                                                <p className="text-xs text-red-500 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {couponError}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Tag className="w-4 h-4 text-green-600" />
                                                <div>
                                                    <p className="text-sm font-bold text-green-700">{appliedCoupon.code}</p>
                                                    <p className="text-xs text-green-600">{appliedCoupon.discount_percent}% Discount Applied</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={removeCoupon}
                                                className="test-neutral-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between text-sm text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-neutral-600">
                                    <span>Shipping</span>
                                    {shipping === 0 ? (
                                        <span className="text-green-600 font-medium">Free</span>
                                    ) : (
                                        <span>₹{shipping.toLocaleString()}</span>
                                    )}
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600 font-medium">
                                        <span>Discount</span>
                                        <span>-₹{discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="border-t border-neutral-100 pt-4 flex justify-between items-end">
                                    <span className="font-medium text-lg">Total</span>
                                    <div className="text-right">
                                        <span className="text-lg font-bold block">₹{total.toLocaleString()}</span>
                                        <span className="text-[10px] text-neutral-400">Including Taxes</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </Container>
        </div>
    );
}
