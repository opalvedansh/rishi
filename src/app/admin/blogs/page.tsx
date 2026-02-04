"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Loader2,
    BookOpen
} from "lucide-react";
import { getBlogs, deleteBlog, Blog } from "@/lib/supabase/blog";
import { formatDate } from "@/lib/utils";

export default function AdminBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchBlogs();
    }, []);

    async function fetchBlogs() {
        setIsLoading(true);
        try {
            const data = await getBlogs();
            setBlogs(data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this blog post?")) return;

        setDeletingId(id);
        try {
            await deleteBlog(id);
            setBlogs(blogs.filter(b => b.id !== id));
        } catch (error) {
            console.error("Error deleting blog:", error);
            alert("Failed to delete blog post");
        } finally {
            setDeletingId(null);
        }
    }

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-neutral-900">Blog Posts</h1>
                    <p className="text-neutral-500 mt-1">Manage your journal entries and articles.</p>
                </div>
                <Link
                    href="/admin/blogs/new"
                    className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-neutral-800 transition-colors flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search blogs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                    />
                </div>
            </div>

            {/* Blog Table */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                {blogs.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">No blogs yet</h3>
                        <p className="text-neutral-500 mb-6">Create your first blog post to get started</p>
                        <Link
                            href="/admin/blogs/new"
                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-neutral-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create Post
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-neutral-50 border-b border-neutral-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Post</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Category</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Date</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-neutral-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {filteredBlogs.map((blog) => (
                                    <tr key={blog.id} className="hover:bg-neutral-50/50 transition-colors bg-white">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 relative rounded-md overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
                                                    {blog.image ? (
                                                        <Image
                                                            src={blog.image}
                                                            alt={blog.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-neutral-200">
                                                            <BookOpen className="w-4 h-4 text-neutral-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-neutral-900 line-clamp-1">{blog.title}</p>
                                                    <p className="text-xs text-neutral-500 line-clamp-1">{blog.excerpt || "No excerpt"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                                                {blog.category || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {blog.is_published ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-neutral-500">
                                            {formatDate(blog.created_at)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/blogs/${blog.id}`}
                                                    className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    disabled={deletingId === blog.id}
                                                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete"
                                                >
                                                    {deletingId === blog.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
