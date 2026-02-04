"use client";

import Image from "next/image";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const values = [
    {
        title: "Craftsmanship",
        description: "Every stitch is a testament to our dedication to quality. We collaborate with master artisans who have honed their skills over generations.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
    },
    {
        title: "Sustainability",
        description: "We believe in fashion that lasts. Our materials are ethically sourced, and our processes are designed to minimize environmental impact.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
    },
    {
        title: "Timelessness",
        description: "We don't chase trends. We create pieces that are designed to remain relevant and stylish for years to come.",
        icon: (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        ),
    },
];

import { ChevronDown } from "lucide-react";

export default function AboutPage() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div className="bg-white">
            {/* Spectacular Hero Section */}
            <section ref={ref} className="relative h-[90vh] min-h-[600px] overflow-hidden flex items-center justify-center text-white">
                {/* Parallax Background */}
                <motion.div style={{ y }} className="absolute inset-0 z-0">
                    <Image
                        src="/assets/IMG_2172.PNG"
                        alt="About Us Hero"
                        fill
                        className="object-cover scale-105"
                        priority
                    />
                    {/* Cinematic Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/80" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />
                    {/* Grain Texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />
                </motion.div>

                <Container className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                    >
                        <span className="inline-block py-1 px-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-xs font-medium tracking-[0.2em] uppercase text-[#D4A574] mb-6">
                            Est. 2024
                        </span>
                        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mb-6 tracking-tight">
                            <span className="block text-[#F3EAD8] drop-shadow-2xl">Our</span>
                            <span className="block bg-gradient-to-r from-[#D4A574] via-[#E8C4A0] to-[#D4A574] bg-clip-text text-transparent italic drop-shadow-lg pb-4">
                                Story
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-xl md:text-2xl font-light max-w-2xl mx-auto text-[#E8DFD0]/90 leading-relaxed"
                    >
                        Crafting a legacy of elegance, one stitch at a time.
                    </motion.p>
                </Container>

                {/* Scroll Indicator */}
                <motion.div
                    style={{ opacity }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
                >
                    <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <ChevronDown className="w-5 h-5" />
                    </motion.div>
                </motion.div>
            </section>

            {/* Narrative Section 1 */}
            <section className="py-24 md:py-32">
                <Container>
                    <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                        <div className="w-full md:w-1/2">
                            <FadeIn direction="right">
                                <div className="aspect-[4/5] relative overflow-hidden bg-neutral-100">
                                    <Image
                                        src="/assets/IMG_2256.PNG"
                                        alt="Our Beginning"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </FadeIn>
                        </div>
                        <div className="w-full md:w-1/2">
                            <FadeIn direction="up">
                                <h2 className="font-display text-3xl md:text-4xl mb-6 text-[var(--color-heading-text)]">The Beginning</h2>
                                <p className="text-neutral-500 text-lg leading-relaxed font-light mb-6">
                                    It started with a simple idea: that luxury shouldn't be complicated. Founded in a small studio, we began by dissecting the classics, understanding what made them timeless, and then reconstructing them for the modern individual.
                                </p>
                                <p className="text-neutral-500 text-lg leading-relaxed font-light">
                                    Our journey hasn't been about reinventing the wheel, but rather refining it. removing the unnecessary, polishing the essential, and ensuring that every piece we produce carries a sense of purpose.
                                </p>
                            </FadeIn>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-[#f8f6f3]">
                <Container>
                    <div className="text-center mb-16">
                        <FadeIn>
                            <h2 className="font-display text-3xl md:text-4xl mb-4">Our Principles</h2>
                        </FadeIn>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {values.map((value, index) => (
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 text-black shadow-sm">
                                        {value.icon}
                                    </div>
                                    <h3 className="font-display text-xl mb-4">{value.title}</h3>
                                    <p className="text-neutral-500 font-light leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Narrative Section 2 (Inverted) */}
            <section className="py-24 md:py-32">
                <Container>
                    <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-24">
                        <div className="w-full md:w-1/2">
                            <FadeIn direction="left">
                                <div className="aspect-[4/5] relative overflow-hidden bg-neutral-100">
                                    <Image
                                        src="/assets/IMG_2357.PNG"
                                        alt="Our Future"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </FadeIn>
                        </div>
                        <div className="w-full md:w-1/2">
                            <FadeIn direction="up">
                                <h2 className="font-display text-3xl md:text-4xl mb-6 text-[var(--color-heading-text)]">The Future of Luxury</h2>
                                <p className="text-neutral-500 text-lg leading-relaxed font-light mb-6">
                                    As we look ahead, our commitment remains improved. We are constantly exploring new sustainable materials, refining our supply chain, and finding ways to give back to the communities that support us.
                                </p>
                                <p className="text-neutral-500 text-lg leading-relaxed font-light">
                                    Join us as we continue to define what it means to live effortlessly.
                                </p>
                            </FadeIn>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}
