"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { useState, useEffect } from "react";
import { getPublishedBlogs, Blog } from "@/lib/supabase/blog";
import { formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function BlogPage() {
    const [posts, setPosts] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        try {
            const data = await getPublishedBlogs();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching blog posts:", error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="bg-white min-h-screen pt-32 pb-24 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    return (
        <div className="bg-white pt-32 pb-24 min-h-screen">
            <Container>
                <div className="text-center mb-20">
                    <FadeIn>
                        <h1 className="font-display text-5xl md:text-7xl mb-6">The Journal</h1>
                        <p className="text-xl font-light text-neutral-500 max-w-2xl mx-auto">
                            Stories on style, craftsmanship, and the modern lifestyle.
                        </p>
                    </FadeIn>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 text-neutral-400">
                        <p>No journal entries found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                        {posts.map((post, index) => (
                            <FadeIn key={post.id} delay={index * 0.1}>
                                <Link href={`/blog/${post.slug}`} className="group block">
                                    <div className="aspect-[4/5] relative overflow-hidden bg-neutral-100 mb-6">
                                        {post.image ? (
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-sm">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider font-medium">
                                            {post.category}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-xs text-neutral-400 mb-3 uppercase tracking-widest">{formatDate(post.published_at || post.created_at)}</div>
                                        <h2 className="font-display text-2xl mb-3 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-neutral-500 font-light leading-relaxed line-clamp-3">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
