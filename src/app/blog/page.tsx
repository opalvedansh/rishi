"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";

const posts = [
    {
        title: "The Art of Layering",
        excerpt: "Mastering the transition between seasons with our latest knitwear collection.",
        category: "Style Guide",
        date: "October 12, 2025",
        image: "/assets/IMG_2363.PNG",
        slug: "art-of-layering",
    },
    {
        title: "Behind the Seams",
        excerpt: "A look into the atelier and the hands that craft our signature pieces.",
        category: "Craftsmanship",
        date: "September 28, 2025",
        image: "/assets/IMG_2256.PNG",
        slug: "behind-the-seams",
    },
    {
        title: "Minimalist Living",
        excerpt: "How decluttering your wardrobe can lead to a more focused and peaceful life.",
        category: "Lifestyle",
        date: "September 15, 2025",
        image: "/assets/IMG_2176.PNG",
        slug: "minimalist-living",
    },
    {
        title: "Fabric Focus: Organic Cotton",
        excerpt: "Why we choose organic cotton and how it benefits both you and the planet.",
        category: "Sustainability",
        date: "September 02, 2025",
        image: "/assets/IMG_2354.PNG",
        slug: "fabric-focus",
    },
    {
        title: "The City Guide: London",
        excerpt: "Our favorite spots in the capital for coffee, culture, and inspiration.",
        category: "Travel",
        date: "August 20, 2025",
        image: "/assets/IMG_2204.PNG",
        slug: "city-guide-london",
    },
    {
        title: "Wardrobe Essentials",
        excerpt: "The five pieces every modern man needs in his rotation.",
        category: "Style Guide",
        date: "August 10, 2025",
        image: "/assets/IMG_2258.PNG",
        slug: "wardrobe-essentials",
    },
];

export default function BlogPage() {
    return (
        <div className="bg-white pt-32 pb-24">
            <Container>
                <div className="text-center mb-20">
                    <FadeIn>
                        <h1 className="font-display text-5xl md:text-7xl mb-6">The Journal</h1>
                        <p className="text-xl font-light text-neutral-500 max-w-2xl mx-auto">
                            Stories on style, craftsmanship, and the modern lifestyle.
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                    {posts.map((post, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <Link href={`/blog/${post.slug}`} className="group block">
                                <div className="aspect-[4/5] relative overflow-hidden bg-neutral-100 mb-6">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider font-medium">
                                        {post.category}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-xs text-neutral-400 mb-3 uppercase tracking-widest">{post.date}</div>
                                    <h2 className="font-display text-2xl mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                                        {post.title}
                                    </h2>
                                    <p className="text-neutral-500 font-light leading-relaxed">
                                        {post.excerpt}
                                    </p>
                                </div>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </Container>
        </div>
    );
}
