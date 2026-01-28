"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export const AccordionItem = ({ title, children, defaultOpen = false, className }: AccordionItemProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn("border-b border-neutral-200", className)}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-6 text-left group"
            >
                <span className="font-medium text-sm result uppercase tracking-wider group-hover:text-[var(--color-primary)] transition-colors">
                    {title}
                </span>
                <span className="relative ml-4 flex-shrink-0">
                    <motion.div
                        initial={false}
                        animate={{ rotate: isOpen ? 180 : 0, opacity: isOpen ? 0 : 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                    >
                        <Plus className="w-4 h-4" />
                    </motion.div>
                    <motion.div
                        initial={false}
                        animate={{ rotate: isOpen ? 0 : -180, opacity: isOpen ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Minus className="w-4 h-4" />
                    </motion.div>
                </span>
            </button>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-6 text-neutral-500 font-light leading-relaxed">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
