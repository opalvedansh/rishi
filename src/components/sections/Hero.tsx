"use client";

import Link from "next/link";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

interface HeroProps {
    title?: string;
    subtitle?: string;
    text?: string;
    buttonLabel?: string;
    buttonLink?: string;
}

// Total frames in sequence (frames 78-203 = 126 frames)
const FRAME_COUNT = 126;

// Frame path generator
const getFramePath = (index: number): string => {
    const paddedIndex = String(index).padStart(4, "0");
    return `/frames/${paddedIndex}.webp`;
};

const Hero = ({
    title = "Crafted for you",
    subtitle = "The New Collection",
    text = "Where precision meets artistry. Experience fabric that moves with intention.",
    buttonLabel = "Discover the Collection",
    buttonLink = "/products",
}: HeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(-1);
    const rafRef = useRef<number | null>(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    // Direct scroll progress - no springs, no elasticity
    // This creates the Apple-level precision feel
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll directly to frame index (linear, no easing)
    const frameIndex = useTransform(scrollYProgress, [0, 1], [1, FRAME_COUNT]);

    // Typography timing - staged reveals based on scroll
    // Scene 1 (0-8%): Authority entrance - hold first frame, no text
    // Scene 2 (8-40%): Abstract reveal - brand name fades in
    // Scene 3 (40-70%): Product emergence - tagline appears
    // Scene 4 (70-95%): Full reveal - description text
    // Scene 5 (95-100%): Conversion - CTA appears

    const subtitleOpacity = useTransform(scrollYProgress, [0.08, 0.15], [0, 1]);
    const titleOpacity = useTransform(scrollYProgress, [0.12, 0.22], [0, 1]);
    const descriptionOpacity = useTransform(scrollYProgress, [0.55, 0.65], [0, 1]);
    const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 1]);

    // Subtle content fade at the very end for transition (excluding CTA)
    const contentFadeOut = useTransform(scrollYProgress, [0.92, 1], [1, 0]);

    // Preload images with intelligent batching
    useEffect(() => {
        let loadedCount = 0;
        const imgArray: HTMLImageElement[] = new Array(FRAME_COUNT);

        // Priority batch: first 20 frames for immediate display
        const priorityCount = 20;

        const loadImage = (i: number): Promise<void> => {
            return new Promise((resolve) => {
                const img = new Image();
                img.src = getFramePath(i);
                img.onload = () => {
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                    if (loadedCount === FRAME_COUNT) {
                        setIsLoaded(true);
                    }
                    resolve();
                };
                img.onerror = () => {
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
                    if (loadedCount === FRAME_COUNT) {
                        setIsLoaded(true);
                    }
                    resolve();
                };
                imgArray[i - 1] = img;
            });
        };

        // Load priority frames first (synchronously feel)
        const loadPriorityFrames = async () => {
            const priorityPromises: Promise<void>[] = [];
            for (let i = 1; i <= priorityCount; i++) {
                priorityPromises.push(loadImage(i));
            }
            await Promise.all(priorityPromises);

            // Then load rest in parallel
            const remainingPromises: Promise<void>[] = [];
            for (let i = priorityCount + 1; i <= FRAME_COUNT; i++) {
                remainingPromises.push(loadImage(i));
            }
            await Promise.all(remainingPromises);
        };

        loadPriorityFrames();
        imagesRef.current = imgArray;
    }, []);

    // Optimized canvas render - crisp, clean, no blur
    const renderFrame = useCallback((index: number) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d", { alpha: false });
        const images = imagesRef.current;

        if (!canvas || !ctx || images.length === 0) return;

        // Clamp and round frame index
        const frameIdx = Math.min(
            FRAME_COUNT - 1,
            Math.max(0, Math.round(index) - 1)
        );

        // Skip if same frame (performance optimization)
        if (frameIdx === currentFrameRef.current) return;
        currentFrameRef.current = frameIdx;

        const img = images[frameIdx];
        if (!img || !img.complete) return;

        // Use viewport dimensions (not DPR-scaled canvas dimensions)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        // Calculate contain fit using viewport dimensions
        const viewportRatio = viewportWidth / viewportHeight;
        const imgRatio = img.width / img.height;

        let drawWidth: number, drawHeight: number, offsetX: number, offsetY: number;

        if (viewportRatio > imgRatio) {
            // Viewport wider than image - fit by height (image full height, centered horizontally)
            drawHeight = viewportHeight;
            drawWidth = viewportHeight * imgRatio;
            offsetX = (viewportWidth - drawWidth) / 2;
            offsetY = 0;
        } else {
            // Viewport taller than image - fit by width (image full width, centered vertically)
            drawWidth = viewportWidth;
            drawHeight = viewportWidth / imgRatio;
            offsetX = 0;
            offsetY = (viewportHeight - drawHeight) / 2;
        }

        // High quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // White background (matches sequence aesthetic)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Scale draw coordinates by DPR for crisp rendering
        ctx.drawImage(
            img,
            offsetX * dpr,
            offsetY * dpr,
            drawWidth * dpr,
            drawHeight * dpr
        );
    }, []);

    // Animation loop - 60fps smooth rendering
    useEffect(() => {
        if (!isLoaded) return;

        const animate = () => {
            const frame = frameIndex.get();
            renderFrame(frame);
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isLoaded, frameIndex, renderFrame]);

    // Handle canvas resize with DPR support
    useEffect(() => {
        let resizeTimeout: NodeJS.Timeout;

        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (canvasRef.current) {
                    const dpr = Math.min(window.devicePixelRatio || 1, 2);
                    canvasRef.current.width = window.innerWidth * dpr;
                    canvasRef.current.height = window.innerHeight * dpr;

                    // Force re-render (no ctx.scale - we handle DPR in drawing)
                    currentFrameRef.current = -1;
                    renderFrame(frameIndex.get());
                }
            }, 50);
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(resizeTimeout);
        };
    }, [isLoaded, frameIndex, renderFrame]);

    // Initial render when loaded
    useEffect(() => {
        if (isLoaded && canvasRef.current) {
            currentFrameRef.current = -1;
            renderFrame(1);
        }
    }, [isLoaded, renderFrame]);

    return (
        <section ref={containerRef} className="relative h-[250vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                {/* Loading Overlay - Minimal, Premium */}
                {!isLoaded && (
                    <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center">
                        <div className="w-32 h-[2px] bg-neutral-200 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-neutral-900 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${loadProgress}%` }}
                                transition={{ duration: 0.2, ease: "linear" }}
                            />
                        </div>
                        <p className="mt-6 text-neutral-400 text-[11px] tracking-[0.3em] uppercase font-light">
                            {loadProgress}%
                        </p>
                    </div>
                )}

                {/* Canvas Layer - The dominant visual */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{
                        imageRendering: "auto",
                        willChange: "transform"
                    }}
                />

                {/* Subtle Vignette - Cinematic depth without overwhelming */}
                <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.03) 100%)"
                    }}
                />

                {/* Content Layer - Staged Typography */}
                <motion.div
                    style={{ opacity: contentFadeOut }}
                    className="relative z-20 h-full flex flex-col items-center justify-end pb-24 md:pb-32 text-center px-6"
                >
                    {/* Subtitle - First to appear */}
                    <motion.span
                        style={{ opacity: subtitleOpacity }}
                        className="inline-block text-neutral-500 uppercase tracking-[0.35em] text-[10px] md:text-xs font-light mb-4"
                    >
                        {subtitle}
                    </motion.span>

                    {/* Title - Main brand statement */}
                    <motion.h1
                        style={{ opacity: titleOpacity }}
                        className="font-light text-3xl md:text-5xl lg:text-6xl tracking-tight text-neutral-900 mb-6 max-w-3xl leading-tight"
                    >
                        {title}
                    </motion.h1>

                    {/* Description - Supporting text */}
                    <motion.p
                        style={{ opacity: descriptionOpacity }}
                        className="text-neutral-500 text-sm md:text-base font-light max-w-md mb-10 leading-relaxed"
                    >
                        {text}
                    </motion.p>
                </motion.div>

                {/* CTA - Appears last and STAYS visible (outside contentFadeOut container) */}
                <motion.div
                    style={{ opacity: ctaOpacity }}
                    className="absolute z-30 bottom-24 md:bottom-32 left-1/2 -translate-x-1/2"
                >
                    <Link
                        href={buttonLink}
                        className="group inline-flex items-center justify-center px-8 py-3.5 bg-neutral-900 text-white transition-all duration-500 hover:bg-neutral-800"
                    >
                        <span className="text-[11px] md:text-xs font-medium uppercase tracking-[0.2em]">
                            {buttonLabel}
                        </span>
                    </Link>
                </motion.div>

                {/* Scroll Indicator - Minimal, disappears as you scroll */}
                <motion.div
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0])
                    }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
                >
                    <span className="text-[9px] uppercase tracking-[0.4em] text-neutral-400 font-light">
                        Scroll
                    </span>
                    <motion.div
                        className="w-[1px] h-8 bg-neutral-300"
                        animate={{ scaleY: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
