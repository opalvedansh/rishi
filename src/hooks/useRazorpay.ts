"use client";

import { useCallback, useEffect, useState } from "react";

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface RazorpayOptions {
    amount: number;
    currency?: string;
    name: string;
    description?: string;
    orderId: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    onSuccess: (response: RazorpayResponse) => void;
    onError: (error: any) => void;
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

export function useRazorpay() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if already loaded
        if (window.Razorpay) {
            setIsLoaded(true);
            return;
        }

        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => console.error("Failed to load Razorpay SDK");
        document.body.appendChild(script);

        return () => {
            // Cleanup not needed as Razorpay should persist
        };
    }, []);

    const createOrder = useCallback(async (amount: number): Promise<string | null> => {
        try {
            const response = await fetch("/api/razorpay/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || "Failed to create order");
            }

            return data.order.id;
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            return null;
        }
    }, []);

    const verifyPayment = useCallback(async (response: RazorpayResponse): Promise<boolean> => {
        try {
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(response),
            });

            const data = await verifyResponse.json();
            return data.verified === true;
        } catch (error) {
            console.error("Error verifying payment:", error);
            return false;
        }
    }, []);

    const openCheckout = useCallback((options: RazorpayOptions) => {
        if (!isLoaded || !window.Razorpay) {
            console.error("Razorpay SDK not loaded");
            options.onError(new Error("Razorpay SDK not loaded"));
            return;
        }

        const razorpayOptions = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: options.amount * 100, // Convert to paise
            currency: options.currency || "INR",
            name: options.name,
            description: options.description || "",
            order_id: options.orderId,
            prefill: options.prefill || {},
            theme: options.theme || { color: "#000000" },
            handler: async (response: RazorpayResponse) => {
                const isValid = await verifyPayment(response);
                if (isValid) {
                    options.onSuccess(response);
                } else {
                    options.onError(new Error("Payment verification failed"));
                }
            },
            modal: {
                ondismiss: () => {
                    setIsLoading(false);
                },
            },
        };

        const razorpay = new window.Razorpay(razorpayOptions);
        razorpay.on("payment.failed", (response: any) => {
            options.onError(response.error);
        });
        razorpay.open();
    }, [isLoaded, verifyPayment]);

    return {
        isLoaded,
        isLoading,
        setIsLoading,
        createOrder,
        openCheckout,
        verifyPayment,
    };
}
