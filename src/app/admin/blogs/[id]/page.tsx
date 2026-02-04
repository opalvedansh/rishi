"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";
import { getBlogById, Blog } from "@/lib/supabase/blog";
import { Loader2 } from "lucide-react";

export default function EditBlogPage() {
    const params = useParams();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchBlog(params.id as string);
        }
    }, [params.id]);

    async function fetchBlog(id: string) {
        setIsLoading(true);
        try {
            const data = await getBlogById(id);
            setBlog(data);
        } catch (error) {
            console.error("Error fetching blog:", error);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    if (!blog) {
        return <div>Blog post not found</div>;
    }

    return <BlogForm initialData={blog} isEditing />;
}
