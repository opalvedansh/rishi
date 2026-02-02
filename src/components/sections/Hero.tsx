"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Container from "@/components/ui/Container";

interface HeroProps {
    title?: string;
    subtitle?: string;
    text?: string;
    videoUrl?: string;
    buttonLabel?: string;
    buttonLink?: string;
}

const Hero = ({
    title = "Elegance Redefined",
    subtitle = "The New Collection",
    text = "Discover the craftsmanship that defines modern luxury.",
    videoUrl = "https://www.youtube.com/embed/_9VUPq3SxOc?autoplay=1&mute=1&controls=0&loop=1&playlist=_9VUPq3SxOc",
    buttonLabel = "Explore Collection",
    buttonLink = "/collections/all",
}: HeroProps) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section ref={ref} className="relative h-[100dvh] w-full overflow-hidden bg-black text-white flex items-center justify-center">
            {/* Background Video with Parallax */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0 pointer-events-none"
            >
                <div className="absolute inset-0 bg-black/30 z-10" />
                {/* Gradient Overlay for Text Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />

                <iframe
                    src={videoUrl}
                    className="w-full h-full object-cover scale-[1.7] md:scale-150 pointer-events-none"
                    allow="autoplay; encrypted-media; loop"
                    allowFullScreen
                    title="Hero Video"
                />
            </motion.div>

            {/* Content */}
            <Container className="relative z-20 text-center flex flex-col items-center max-w-5xl px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                    <span className="inline-block py-1 px-3 border border-white/30 rounded-full uppercase tracking-[0.2em] text-xs md:text-sm font-medium mb-6 md:mb-8 backdrop-blur-sm">
                        {subtitle}
                    </span>
                </motion.div>

                <div className="overflow-hidden mb-6 md:mb-8">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                        className="font-display text-6xl md:text-7xl lg:text-9xl leading-[0.9] tracking-tight text-white mix-blend-normal drop-shadow-2xl"
                    >
                        {title}
                    </motion.h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
                    className="prose prose-invert text-lg md:text-2xl font-light mb-10 md:mb-12 max-w-2xl text-white/80"
                    dangerouslySetInnerHTML={{ __html: text }}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
                >
                    <Link
                        href={buttonLink}
                        className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-full bg-white text-black transition-transform hover:scale-105"
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-white via-neutral-200 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"></span>
                        <span className="relative text-sm font-semibold uppercase tracking-[0.15em]">{buttonLabel}</span>
                    </Link>
                </motion.div>
            </Container>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-widest text-white/50">Scroll</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent opacity-50" />
            </motion.div>
        </section>
    );
};

export default Hero;
