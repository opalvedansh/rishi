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

export default function AboutPage() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

    return (
        <div className="bg-white">
            {/* Hero Section with Parallax */}
            <section ref={ref} className="relative h-[70vh] min-h-[500px] overflow-hidden flex items-center justify-center text-white">
                <motion.div style={{ y }} className="absolute inset-0 z-0">
                    <Image
                        src="/assets/IMG_2172.PNG" // Using one of the uploaded images
                        alt="About Us Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </motion.div>

                <Container className="relative z-10 text-center">
                    <FadeIn>
                        <h1 className="font-display text-5xl md:text-7xl mb-6">Our Story</h1>
                        <p className="text-xl font-light max-w-2xl mx-auto text-white/90">
                            Crafting a legacy of elegance, one stitch at a time.
                        </p>
                    </FadeIn>
                </Container>
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
