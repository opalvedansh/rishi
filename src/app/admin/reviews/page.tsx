"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    Check, X, Eye, Edit2, Trash2, Search, Filter,
    MessageSquare, Star, MoreVertical, AlertCircle, Save
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    getAllReviews, updateReviewStatus, updateReviewContent, deleteReview, Review
} from "@/lib/supabase/reviews";

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

    // Edit Modal State
    const [editingReview, setEditingReview] = useState<any | null>(null);
    const [editForm, setEditForm] = useState({ heading: "", comment: "", rating: 5 });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        loadReviews();
    }, []);

    async function loadReviews() {
        setIsLoading(true);
        try {
            const data = await getAllReviews();
            setReviews(data);
        } catch (err) {
            console.error("Failed to load reviews", err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        // Optimistic update
        setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));

        const success = await updateReviewStatus(id, status);
        if (!success) {
            // Revert on failure
            loadReviews();
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this review?")) return;

        setReviews(reviews.filter(r => r.id !== id));

        const success = await deleteReview(id);
        if (!success) {
            loadReviews();
            alert("Failed to delete review");
        }
    };

    const openEditModal = (review: any) => {
        setEditingReview(review);
        setEditForm({
            heading: review.heading || "",
            comment: review.comment || "",
            rating: review.rating
        });
    };

    const handleSaveEdit = async () => {
        if (!editingReview) return;
        setIsSaving(true);

        try {
            const success = await updateReviewContent(editingReview.id, editForm);
            if (success) {
                setReviews(reviews.map(r =>
                    r.id === editingReview.id
                        ? { ...r, ...editForm }
                        : r
                ));
                setEditingReview(null);
            } else {
                alert("Failed to update review");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredReviews = reviews.filter(review => {
        const matchesSearch =
            (review.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (review.heading?.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (review.products?.title?.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilter = filterStatus === 'all' || review.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    const pendingCount = reviews.filter(r => r.status === 'pending').length;

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Reviews & Ratings</h1>
                    <p className="text-neutral-500 text-sm mt-1">Manage, moderate, and respond to customer reviews</p>
                </div>
                {pendingCount > 0 && (
                    <div className="bg-orange-50 text-orange-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-orange-100">
                        <AlertCircle className="w-4 h-4" />
                        {pendingCount} Pending Review{pendingCount !== 1 ? 's' : ''}
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            filterStatus === 'all' ? "bg-black text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        )}
                    >
                        All Reviews
                    </button>
                    <button
                        onClick={() => setFilterStatus('pending')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            filterStatus === 'pending' ? "bg-orange-500 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        )}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilterStatus('approved')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            filterStatus === 'approved' ? "bg-green-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        )}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => setFilterStatus('rejected')}
                        className={cn(
                            "px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                            filterStatus === 'rejected' ? "bg-red-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        )}
                    >
                        Rejected
                    </button>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search by customer or product..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-lg border border-neutral-200 text-sm focus:border-black focus:outline-none"
                    />
                </div>
            </div>

            {/* Reviews List */}
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="p-12 text-center text-neutral-500">Loading reviews...</div>
                ) : filteredReviews.length === 0 ? (
                    <div className="p-12 text-center text-neutral-500">No reviews found matching your criteria.</div>
                ) : (
                    <div className="divide-y divide-neutral-100">
                        {filteredReviews.map((review) => (
                            <div key={review.id} className="p-6 hover:bg-neutral-50 transition-colors">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Product Info */}
                                    <div className="lg:w-64 flex-shrink-0">
                                        {review.products && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 relative rounded-md overflow-hidden bg-neutral-100 flex-shrink-0">
                                                    {review.products.image && (
                                                        <Image
                                                            src={review.products.image}
                                                            alt={review.products.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <p className="text-sm font-medium text-neutral-900 line-clamp-2">
                                                    {review.products.title}
                                                </p>
                                            </div>
                                        )}
                                        <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500">
                                            <MessageSquare className="w-3 h-3" />
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </div>
                                    </div>

                                    {/* Review Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={cn(
                                                                "w-4 h-4",
                                                                i < review.rating ? "fill-[#FFB800] text-[#FFB800]" : "fill-neutral-200 text-neutral-200"
                                                            )}
                                                        />
                                                    ))}
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full",
                                                    review.status === 'approved' ? "bg-green-100 text-green-700" :
                                                        review.status === 'rejected' ? "bg-red-100 text-red-700" :
                                                            "bg-orange-100 text-orange-700"
                                                )}>
                                                    {review.status}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {review.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(review.id, 'approved')}
                                                            title="Approve"
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                                            title="Reject"
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {review.status === 'rejected' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(review.id, 'approved')}
                                                        className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg hover:bg-neutral-200"
                                                    >
                                                        Restore
                                                    </button>
                                                )}
                                                {review.status === 'approved' && (
                                                    <button
                                                        onClick={() => handleStatusUpdate(review.id, 'rejected')}
                                                        className="px-3 py-1.5 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-lg hover:bg-neutral-200"
                                                    >
                                                        Reject
                                                    </button>
                                                )}

                                                <div className="h-4 w-px bg-neutral-200 mx-1"></div>

                                                <button
                                                    onClick={() => openEditModal(review)}
                                                    className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="font-bold text-neutral-900 mb-1">{review.heading}</h3>
                                        <p className="text-neutral-600 text-sm leading-relaxed">{review.comment}</p>

                                        <div className="mt-3 text-xs text-neutral-400 font-medium">
                                            By {review.name} {review.email && <span className="text-neutral-300">({review.email})</span>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingReview && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg">Edit Review</h3>
                            <button onClick={() => setEditingReview(null)} className="p-1 hover:bg-neutral-100 rounded-full">
                                <X className="w-5 h-5 text-neutral-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Rating</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setEditForm({ ...editForm, rating: star })}
                                            className="focus:outline-none"
                                        >
                                            <Star
                                                className={cn(
                                                    "w-6 h-6",
                                                    star <= editForm.rating ? "fill-[#FFB800] text-[#FFB800]" : "fill-neutral-200 text-neutral-200"
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={editForm.heading}
                                    onChange={(e) => setEditForm({ ...editForm, heading: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-black focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-700 mb-1">Review</label>
                                <textarea
                                    rows={4}
                                    value={editForm.comment}
                                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-neutral-200 focus:border-black focus:outline-none resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    onClick={() => setEditingReview(null)}
                                    className="px-4 py-2 text-neutral-500 font-medium hover:bg-neutral-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={isSaving}
                                    className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-neutral-800 disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
