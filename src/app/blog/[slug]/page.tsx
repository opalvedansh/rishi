"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { getBlogBySlug, Blog } from "@/lib/supabase/blog";
import { formatDate } from "@/lib/utils";
import { Loader2, ArrowLeft } from "lucide-react";

export default function BlogDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [post, setPost] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params.slug) {
            fetchPost(params.slug as string);
        }
    }, [params.slug]);

    async function fetchPost(slug: string) {
        setIsLoading(true);
        try {
            const data = await getBlogBySlug(slug);
            if (!data) {
                // Handle 404 - maybe redirect or show error
                // For now just keep post null
            } else {
                setPost(data);
            }
        } catch (error) {
            console.error("Error fetching blog post:", error);
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

    if (!post) {
        return (
            <div className="bg-white min-h-screen pt-32 pb-24 flex flex-col items-center justify-center text-center">
                <h1 className="font-display text-4xl mb-4">Post not found</h1>
                <Link href="/blog" className="text-neutral-500 hover:text-black hover:underline">
                    Back to Journal
                </Link>
            </div>
        );
    }

    return (
        <article className="bg-white pt-32 pb-24 min-h-screen">
            <Container>
                <div className="max-w-3xl mx-auto">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-black mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Journal
                    </Link>

                    <FadeIn>
                        <header className="mb-12 text-center">
                            <div className="flex items-center justify-center gap-4 text-xs tracking-widest uppercase mb-6">
                                <span className="text-black font-medium">{post.category}</span>
                                <span className="text-neutral-300">•</span>
                                <span className="text-neutral-500">{formatDate(post.published_at || post.created_at)}</span>
                            </div>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-8 leading-tight">
                                {post.title}
                            </h1>
                            {post.excerpt && (
                                <p className="text-xl font-light text-neutral-500 leading-relaxed max-w-2xl mx-auto">
                                    {post.excerpt}
                                </p>
                            )}
                        </header>

                        {post.image && (
                            <div className="relative aspect-[16/9] mb-16 rounded-lg overflow-hidden bg-neutral-100">
                                <Image
                                    src={post.image}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}

                        <div className="prose prose-lg prose-neutral mx-auto font-light">
                            {/* Simple rendering for now. For Markdown support, we would use a library like react-markdown */}
                            <div dangerouslySetInnerHTML={{ __html: post.content?.replace(/\n/g, '<br />') || "" }} />
                        </div>
                    </FadeIn>
                </div>
            </Container>
        </article>
    );
}
