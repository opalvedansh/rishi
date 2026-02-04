"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/data/products";

import { createClient } from "@/utils/supabase/client";

// Define the shape of a Cart Item (Product + Quantity + Selected Size)
export interface CartItem extends Product {
    quantity: number;
    selectedSize: string;
}

interface ShopContextType {
    cart: CartItem[];
    wishlist: Product[];
    addToCart: (product: Product, quantity: number, size: string) => void;
    removeFromCart: (productId: string, size: string) => void;
    updateQuantity: (productId: string, size: string, quantity: number) => void;
    toggleWishlist: (product: Product) => void;
    isInWishlist: (productId: string) => boolean;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const supabase = createClient();

    // Load from LocalStorage on mount AND Refresh Prices
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        const storedWishlist = localStorage.getItem("wishlist");

        // Initial load from local storage
        let initialCart: CartItem[] = [];
        if (storedCart) {
            initialCart = JSON.parse(storedCart);
            setCart(initialCart);
        }
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
        setIsLoaded(true);

        // REFRESH PRICES FROM SERVER
        if (initialCart.length > 0) {
            const refreshPrices = async () => {
                const productIds = initialCart.map(item => item.id);

                const { data: latestProducts, error } = await supabase
                    .from('products')
                    .select('id, price, title, images')
                    .in('id', productIds);

                if (error || !latestProducts) {
                    console.error("Failed to refresh cart prices:", error);
                    return;
                }

                setCart(prevCart => {
                    return prevCart.map(item => {
                        const freshData = latestProducts.find(p => p.id === item.id);
                        if (freshData) {
                            // Update price, title, and image just in case
                            // Note: images in DB is an array, item.image is a string (first image)
                            // We handle the image mapping if needed, but primary goal is PRICE.
                            return {
                                ...item,
                                price: freshData.price,
                                title: freshData.title,
                                // Only update image if strictly needed, usually the first one
                                image: freshData.images?.[0] || item.image
                            };
                        }
                        return item;
                    });
                });
            };

            refreshPrices();
        }
    }, []);

    // Save to LocalStorage whenever cart or wishlist changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("cart", JSON.stringify(cart));
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
        }
    }, [cart, wishlist, isLoaded]);

    const addToCart = (product: Product, quantity: number, size: string) => {
        setCart((prevCart) => {
            const existingItemIndex = prevCart.findIndex(
                (item) => item.id === product.id && item.selectedSize === size
            );

            if (existingItemIndex > -1) {
                // Update quantity if item with same size exists
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += quantity;
                return newCart;
            } else {
                // Add new item
                return [...prevCart, { ...product, quantity, selectedSize: size }];
            }
        });
    };

    const removeFromCart = (productId: string, size: string) => {
        setCart((prevCart) => prevCart.filter(item => !(item.id === productId && item.selectedSize === size)));
    };

    const updateQuantity = (productId: string, size: string, quantity: number) => {
        if (quantity < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId && item.selectedSize === size
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const toggleWishlist = (product: Product) => {
        setWishlist((prev) => {
            const exists = prev.find((item) => item.id === product.id);
            if (exists) {
                return prev.filter((item) => item.id !== product.id);
            } else {
                return [...prev, product];
            }
        });
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((item) => item.id === productId);
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <ShopContext.Provider
            value={{
                cart,
                wishlist,
                addToCart,
                removeFromCart,
                updateQuantity,
                toggleWishlist,
                isInWishlist,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) {
        throw new Error("useShop must be used within a ShopProvider");
    }
    return context;
};
