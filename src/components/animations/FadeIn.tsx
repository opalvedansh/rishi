"use client";

import { motion, useInView, UseInViewOptions } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    fullWidth?: boolean; // If true, doesn't force inline-block
    amount?: UseInViewOptions["amount"];
    once?: boolean;
}

const FadeIn = ({
    children,
    className = "",
    delay = 0,
    duration = 0.6,
    direction = "up",
    fullWidth = false,
    amount = 0.2,
    once = true,
}: FadeInProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { amount, once });

    const getVariants = () => {
        const distance = 40;

        let initial = { opacity: 0, x: 0, y: 0 };

        if (direction === "up") initial.y = distance;
        if (direction === "down") initial.y = -distance;
        if (direction === "left") initial.x = distance;
        if (direction === "right") initial.x = -distance;

        return {
            hidden: initial,
            visible: {
                opacity: 1,
                x: 0,
                y: 0,
                transition: {
                    duration,
                    delay,
                    ease: "circOut",
                },
            },
        } as any;
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={getVariants()}
            className={className}
            style={{ width: fullWidth ? "100%" : "auto" }}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
