"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { cn } from "@/lib/utils";

interface PromotionItem {
    image: string;
    title: string;
    subtitle: string;
    description: string;
    link: string;
}

const promotions: PromotionItem[] = [
    {
        image: "/assets/IMG_2204.PNG",
        title: "The Cambridge Cable-Knit",
        subtitle: "Timeless Craftsmanship",
        description: "Experience the embrace of true craftsmanship with the Cambridge Cable-Knit. A definitive staple for the season.",
        link: "/products/cambridge-cable-knit",
    },
    {
        image: "/assets/IMG_2369.PNG",
        title: "Alcott Fine-Gauge Crewneck",
        subtitle: "Modern Sophistication",
        description: "Simplicity is the ultimate form of sophistication. Designed for those who appreciate the subtle details.",
        link: "/products/alcott-crewneck",
    },
    {
        image: "/assets/IMG_2354.PNG",
        title: "The Lucas Cotton Sweater",
        subtitle: "Iconic Comfort",
        description: "Reimagining the iconic cable-knit specifically for the modern wardrobe. Soft, durable, and effortlessly stylish.",
        link: "/products/lucas-sweater",
    },
];

const FeaturedPromotion = () => {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <Container>
                <div className="text-center mb-20">
                    <FadeIn>
                        <span className="uppercase tracking-[0.2em] text-xs font-medium text-neutral-500 mb-3 block">Editorial</span>
                        <h2 className="font-display text-4xl md:text-5xl text-[var(--color-heading-text)]">Season Highlights</h2>
                    </FadeIn>
                </div>

                <div className="flex flex-col gap-32">
                    {promotions.map((promo, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex flex-col md:flex-row items-center gap-12 md:gap-24",
                                index % 2 === 1 ? "md:flex-row-reverse" : ""
                            )}
                        >
                            <div className="w-full md:w-1/2">
                                <FadeIn direction={index % 2 === 0 ? "right" : "left"} duration={0.8}>
                                    <Link href={promo.link} className="block relative aspect-[4/5] overflow-hidden group">
                                        <div className="absolute inset-0 bg-neutral-100 transition-transform duration-1000 group-hover:scale-110">
                                            <Image
                                                src={promo.image}
                                                alt={promo.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 50vw"
                                            />
                                        </div>
                                    </Link>
                                </FadeIn>
                            </div>

                            <div className="w-full md:w-1/2 text-center md:text-left">
                                <FadeIn direction="up" delay={0.2}>
                                    <span className="block text-xs font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-4">{promo.subtitle}</span>
                                    <h3 className="font-display text-3xl md:text-4xl font-medium mb-6 leading-tight">
                                        <Link href={promo.link} className="hover:text-[var(--color-primary)] transition-colors">
                                            {promo.title}
                                        </Link>
                                    </h3>
                                    <p className="text-neutral-500 mb-8 leading-relaxed font-light text-lg max-w-md mx-auto md:mx-0">{promo.description}</p>

                                    <Link
                                        href={promo.link}
                                        className="group inline-flex items-center justify-center px-8 py-4 border border-black text-xs font-bold uppercase tracking-[0.15em] hover:bg-black hover:text-white transition-all duration-300"
                                    >
                                        Shop Now
                                    </Link>
                                </FadeIn>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default FeaturedPromotion;
