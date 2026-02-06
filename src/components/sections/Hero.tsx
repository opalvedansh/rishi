"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
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
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    // Scroll progress for the entire 400vh section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Apply spring physics for smooth interpolation
    // High stiffness + damping = responsive stop, no overshoot
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 300,
        damping: 50,
        restDelta: 0.0001,
    });

    // Map smooth progress to frame index
    const currentIndex = useTransform(smoothProgress, [0, 1], [1, FRAME_COUNT]);

    // Content animations based on scroll
    const contentOpacity = useTransform(smoothProgress, [0.7, 0.95], [1, 0]);
    const textY = useTransform(smoothProgress, [0, 0.3], [0, -80]);
    const scale = useTransform(smoothProgress, [0, 0.5], [1, 1.1]);

    // Preload images with progress tracking
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = [];

        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = `/frame-sequence/${i}.jpg`;
            img.onload = () => {
                loadedCount++;
                setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                if (loadedCount === FRAME_COUNT) {
                    setIsLoaded(true);
                }
            };
            imgArray.push(img);
        }
        imagesRef.current = imgArray;
    }, []);

    // Optimized canvas render function
    const renderFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d", { alpha: false });
        const images = imagesRef.current;

        if (!canvas || !ctx || images.length === 0) return;

        // Ensure index is valid integer
        const frameIndex = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.round(index) - 1)
        );

        // Skip if same frame
        if (frameIndex === currentFrameRef.current) return;
        currentFrameRef.current = frameIndex;

        const img = images[frameIndex];
        if (!img || !img.complete) return;

        // Calculate aspect ratios for cover fit
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

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

        // Use imageSmoothingQuality for better scaling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }, []);

    // Animation loop using requestAnimationFrame for smooth 60fps
    useEffect(() => {
        if (!isLoaded) return;

        const animate = () => {
            const frame = currentIndex.get();
            renderFrame(frame);
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isLoaded, currentIndex, renderFrame]);

    // Handle Resize with debounce
    useEffect(() => {
        let resizeTimeout: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (canvasRef.current) {
                    // Use device pixel ratio for crisp rendering
                    const dpr = Math.min(window.devicePixelRatio || 1, 2);
                    canvasRef.current.width = window.innerWidth * dpr;
                    canvasRef.current.height = window.innerHeight * dpr;

                    const ctx = canvasRef.current.getContext("2d");
                    if (ctx) {
                        ctx.scale(dpr, dpr);
                    }

                    // Force re-render
                    currentFrameRef.current = -1;
                    renderFrame(currentIndex.get());
                }
            }, 100);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [isLoaded, currentIndex, renderFrame]);

    // Initial render when loaded
    useEffect(() => {
        if (isLoaded && canvasRef.current) {
            currentFrameRef.current = -1;
            renderFrame(1);
        }
    }, [isLoaded, renderFrame]);

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-black">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Loading Overlay */}
                {!isLoaded && (
                    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center">
                        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-white rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${loadProgress}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                        <p className="mt-4 text-white/60 text-sm tracking-widest uppercase">
                            Loading Experience... {loadProgress}%
                        </p>
                    </div>
                )}

                {/* Canvas Layer with scale effect */}
                <motion.div style={{ scale }} className="absolute inset-0 will-change-transform">
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full"
                        style={{ imageRendering: "auto" }}
                    />
                </motion.div>

                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-10 pointer-events-none" />

                {/* Content Layer */}
                <motion.div
                    style={{ opacity: contentOpacity, y: textY }}
                    className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white p-4"
                >
                    <Container className="flex flex-col items-center max-w-5xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="inline-block py-1.5 px-4 border border-white/30 rounded-full uppercase tracking-[0.25em] text-xs font-medium mb-8 backdrop-blur-md bg-white/5">
                                {subtitle}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 60, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="font-display text-5xl md:text-7xl lg:text-[10rem] leading-[0.85] tracking-tight text-white mb-8 drop-shadow-2xl"
                        >
                            {title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="max-w-2xl mx-auto"
                        >
                            <p className="text-lg md:text-xl font-light text-white/70 mb-12 leading-relaxed">
                                {text}
                            </p>

                            <Link
                                href={buttonLink}
                                className="group relative inline-flex items-center justify-center px-10 py-4 overflow-hidden rounded-full bg-white text-black transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neutral-100 via-white to-neutral-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <span className="relative text-sm font-semibold uppercase tracking-[0.2em]">{buttonLabel}</span>
                            </Link>
                        </motion.div>
                    </Container>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1.5 }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
                    >
                        <motion.span
                            className="text-[10px] uppercase tracking-[0.3em] text-white/40"
                            animate={{ opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Scroll to Explore
                        </motion.span>
                        <motion.div
                            className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent"
                            animate={{ scaleY: [1, 0.7, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

