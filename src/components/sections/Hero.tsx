"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Container from "@/components/ui/Container";

interface HeroProps {
    title?: string;
    subtitle?: string;
    text?: string;
    buttonLabel?: string;
    buttonLink?: string;
}

const FRAME_COUNT = 61;

const Hero = ({
    title = "Elegance Redefined",
    subtitle = "The New Collection",
    text = "Discover the craftsmanship that defines modern luxury.",
    buttonLabel = "Explore Collection",
    buttonLink = "/products",
}: HeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Scroll progress for the entire 400vh section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll progress to frame index (0 to 60)
    const currentIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

    // Content animations based on scroll
    const contentOpacity = useTransform(scrollYProgress, [0.8, 1], [1, 0]); // Fade out at the very end
    const textY = useTransform(scrollYProgress, [0, 0.2], [0, -50]); // Parallax effect for text

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `/frame-sequence/${i}.jpg`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === FRAME_COUNT) {
                    setIsLoaded(true);
                }
            };
            imgArray.push(img);
        }
        setImages(imgArray);
    }, []);

    // Draw frame on canvas
    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || images.length === 0) return;

        // Ensure index is valid integer
        const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.floor(index) - 1)
        );

        const img = images[frameIndex];
        if (!img) return;

        // Calculate aspect ratios
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        // Draw cover (like object-fit: cover)
        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Update canvas on scroll
    useMotionValueEvent(currentIndex, "change", (latest) => {
        if (isLoaded) {
            renderFrame(latest);
        }
    });

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
                // Re-render current frame on resize
                renderFrame(currentIndex.get());
            }
        };

        // Initial set
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, [isLoaded, currentIndex]);

    // Initial render when loaded
    useEffect(() => {
        if (isLoaded) {
            renderFrame(1);
        }
    }, [isLoaded]);

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Canvas Layer */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10 pointer-events-none" />

                {/* Content Layer */}
                <motion.div
                    style={{ opacity: contentOpacity, y: textY }}
                    className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white p-4"
                >
                    <Container className="flex flex-col items-center max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="inline-block py-1 px-3 border border-white/30 rounded-full uppercase tracking-[0.2em] text-xs md:text-sm font-medium mb-6 backdrop-blur-sm">
                                {subtitle}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 50, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                            className="font-display text-5xl md:text-7xl lg:text-9xl leading-[0.9] tracking-tight text-white mb-8 mix-blend-normal drop-shadow-2xl"
                        >
                            {title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="max-w-2xl mx-auto"
                        >
                            <p className="text-lg md:text-2xl font-light text-white/80 mb-10 leading-relaxed">
                                {text}
                            </p>

                            <Link
                                href={buttonLink}
                                className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full bg-white text-black transition-transform hover:scale-105"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white via-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="relative text-sm font-semibold uppercase tracking-[0.15em]">{buttonLabel}</span>
                            </Link>
                        </motion.div>
                    </Container>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                    >
                        <span className="text-[10px] uppercase tracking-widest text-white/50 animate-pulse">Scroll to Explore</span>
                        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent opacity-50" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
