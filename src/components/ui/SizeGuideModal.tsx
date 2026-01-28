"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SizeGuideModal({ isOpen, onClose }: SizeGuideModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-[100]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="fixed inset-0 flex items-center justify-center z-[101] pointer-events-none p-4"
                    >
                        <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl overflow-hidden relative">
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 hover:bg-neutral-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="p-8 md:p-12">
                                <h2 className="font-display text-3xl mb-2 text-center">Size Guide</h2>
                                <p className="text-neutral-500 text-center mb-8">Find your perfect fit</p>

                                {/* Tabs / Unit Switcher could go here */}

                                <div className="border border-neutral-200 mb-8">
                                    <div className="grid grid-cols-5 border-b border-neutral-200 bg-neutral-50 font-bold text-xs uppercase tracking-wider text-center py-4">
                                        <div>Size</div>
                                        <div>Chest</div>
                                        <div>Waist</div>
                                        <div>Hips</div>
                                        <div>Length</div>
                                    </div>

                                    {/* Rows */}
                                    {[
                                        { size: "XS", chest: "32-34", waist: "26-28", hips: "34-36", length: "27" },
                                        { size: "S", chest: "34-36", waist: "28-30", hips: "36-38", length: "27.5" },
                                        { size: "M", chest: "36-38", waist: "30-32", hips: "38-40", length: "28" },
                                        { size: "L", chest: "38-40", waist: "32-34", hips: "40-42", length: "28.5" },
                                        { size: "XL", chest: "40-42", waist: "34-36", hips: "42-44", length: "29" },
                                    ].map((row, i) => (
                                        <div key={row.size} className="grid grid-cols-5 text-sm text-center py-4 border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors">
                                            <div className="font-bold">{row.size}</div>
                                            <div className="text-neutral-600">{row.chest}"</div>
                                            <div className="text-neutral-600">{row.waist}"</div>
                                            <div className="text-neutral-600">{row.hips}"</div>
                                            <div className="text-neutral-600">{row.length}"</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-neutral-50 p-6">
                                    <h3 className="font-bold uppercase tracking-wider text-xs mb-3">How to Measure</h3>
                                    <ul className="text-sm text-neutral-600 space-y-2 list-disc list-inside">
                                        <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                                        <li><strong>Waist:</strong> Measure around the narrowest part (typically where your body bends side to side).</li>
                                        <li><strong>Hips:</strong> Measure around the fullest part of your hips.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
