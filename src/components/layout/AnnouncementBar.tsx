"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const AnnouncementBar = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="bg-[var(--color-announcement-bg)] text-white relative transition-all duration-300">
            <div className="container mx-auto px-4 py-2.5 text-center text-sm font-medium tracking-wide">
                <p>
                    ❄️ Winter Sale! Get a Discount of Flat 10% OFF on using WINTER10.{" "}
                    <span className="underline cursor-pointer hover:opacity-80">
                        Shop Now!
                    </span>
                </p>
            </div>
            <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close announcement"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default AnnouncementBar;
