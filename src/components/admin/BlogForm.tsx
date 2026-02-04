"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Save, ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import { createBlog, updateBlog, Blog } from "@/lib/supabase/blog";
import { createClient } from "@/utils/supabase/client";
import { v4 as uuidv4 } from "uuid";

interface BlogFormProps {
    initialData?: Blog;
    isEditing?: boolean;
}

export default function BlogForm({ initialData, isEditing = false }: BlogFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        excerpt: initialData?.excerpt || "",
        content: initialData?.content || "",
        category: initialData?.category || "Style",
        image: initialData?.image || "",
        is_published: initialData?.is_published || false,
    });

    // Auto-generate slug from title if not editing and slug is empty
    useEffect(() => {
        if (!isEditing && formData.title && !formData.slug) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.title, isEditing]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setIsUploading(true);

        try {
            const supabase = createClient();
            const fileExt = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `blog-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('content') // Assuming 'content' bucket exists, or create 'blogs' bucket
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('content').getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image: data.publicUrl }));
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const blogData = {
                ...formData,
                published_at: formData.is_published && !initialData?.is_published ? new Date().toISOString() : initialData?.published_at,
            };

            if (isEditing && initialData) {
                await updateBlog(initialData.id, blogData);
            } else {
                await createBlog(blogData);
            }

            router.push("/admin/blogs");
            router.refresh();
        } catch (error) {
            console.error("Error saving blog:", error);
            alert("Failed to save blog post");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/blogs"
                        className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-display text-3xl font-bold text-neutral-900">
                            {isEditing ? "Edit Post" : "New Post"}
                        </h1>
                        <p className="text-neutral-500 mt-1">
                            {isEditing ? "Update your blog post details" : "Create a new journal entry"}
                        </p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isEditing ? "Update Post" : "Publish Post"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Title</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                                placeholder="Enter post title"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Slug</label>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-colors font-mono text-sm"
                                placeholder="post-url-slug"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Excerpt</label>
                            <textarea
                                value={formData.excerpt}
                                onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                                rows={3}
                                placeholder="Short summary for preview cards..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Content</label>
                            <textarea
                                value={formData.content}
                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-colors font-mono"
                                rows={20}
                                placeholder="Write your content here (Markdown or HTML)..."
                                required
                            />
                            <p className="text-xs text-neutral-400 mt-2">Supports basic HTML tags.</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                        <h3 className="font-bold text-neutral-900 mb-4">Publishing</h3>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50">
                                <input
                                    type="checkbox"
                                    checked={formData.is_published}
                                    onChange={e => setFormData({ ...formData, is_published: e.target.checked })}
                                    className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-black"
                                />
                                <span className="text-sm font-medium text-neutral-700">Published</span>
                            </label>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                        <label className="block text-sm font-bold text-neutral-900 mb-4">Category</label>
                        <select
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                        >
                            <option value="Style">Style Guide</option>
                            <option value="Craftsmanship">Craftsmanship</option>
                            <option value="Lifestyle">Lifestyle</option>
                            <option value="Sustainability">Sustainability</option>
                            <option value="Travel">Travel</option>
                            <option value="News">News</option>
                        </select>
                    </div>

                    {/* Image */}
                    <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                        <label className="block text-sm font-bold text-neutral-900 mb-4">Featured Image</label>

                        {formData.image ? (
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200 mb-4">
                                <Image
                                    src={formData.image}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image: "" })}
                                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-neutral-500 hover:text-red-500 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center mb-4 hover:bg-neutral-50 transition-colors">
                                <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                                <p className="text-xs text-neutral-500">Upload or drop image</p>
                            </div>
                        )}

                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                            />
                            <button
                                type="button"
                                disabled={isUploading}
                                className="w-full bg-white border border-neutral-200 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                {isUploading ? "Uploading..." : "Select Image"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
