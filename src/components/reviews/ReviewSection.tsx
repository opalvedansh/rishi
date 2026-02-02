"use client";

import { useState, useEffect } from "react";
import { Star, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";
import { createReview, getReviewsByProductId, Review } from "@/lib/supabase/reviews";

interface ReviewSectionProps {
    productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        heading: "",
        rating: 5,
        comment: "",
    });

    useEffect(() => {
        loadReviews();
    }, [productId]);

    async function loadReviews() {
        try {
            const data = await getReviewsByProductId(productId);
            setReviews(data);
        } catch (err) {
            console.error("Failed to load reviews:", err);
        } finally {
            setIsLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            await createReview({
                product_id: productId,
                ...formData,
            });
            setSuccess(true);
            setFormData({ name: "", email: "", heading: "", rating: 5, comment: "" });
            setShowForm(false);
        } catch (err) {
            setError("Failed to submit review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <section className="py-16 bg-white border-t border-neutral-100">
            <Container>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left: Summary & Form Toggle */}
                    <div className="lg:col-span-4">
                        <FadeIn>
                            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-6">Customer Reviews</h2>

                            <div className="bg-neutral-50 rounded-2xl p-6 lg:p-8 mb-8">
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-5xl font-bold text-neutral-900 leading-none">{averageRating}</span>
                                    <span className="text-neutral-500 mb-1">out of 5</span>
                                </div>
                                <div className="flex items-center gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={cn(
                                                "w-5 h-5",
                                                star <= Math.round(Number(averageRating))
                                                    ? "fill-[#FFB800] text-[#FFB800]"
                                                    : "fill-neutral-200 text-neutral-200"
                                            )}
                                        />
                                    ))}
                                    <span className="text-sm text-neutral-500 ml-2">({reviews.length} Reviews)</span>
                                </div>

                                <button
                                    onClick={() => setShowForm(!showForm)}
                                    className="w-full h-12 bg-black text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-neutral-800 transition-colors"
                                >
                                    {showForm ? "Cancel Review" : "Write a Review"}
                                </button>
                            </div>
                        </FadeIn>
                    </div>

                    {/* Right: Reviews List & Form */}
                    <div className="lg:col-span-8">
                        {/* Write Review Form */}
                        <AnimatePresence>
                            {showForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-white border-2 border-neutral-100 rounded-2xl p-6 lg:p-8">
                                        <h3 className="font-bold text-lg mb-6">Write your review</h3>

                                        {success ? (
                                            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex items-center gap-3">
                                                <Check className="w-5 h-5" />
                                                <p>Thank you! Your review has been submitted and is pending approval.</p>
                                            </div>
                                        ) : (
                                            <form onSubmit={handleSubmit} className="space-y-6">
                                                <div>
                                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Rating</label>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, rating: star })}
                                                                onMouseEnter={() => { /* Optional: add hover effect */ }}
                                                                className="focus:outline-none transition-transform hover:scale-110"
                                                            >
                                                                <Star
                                                                    className={cn(
                                                                        "w-8 h-8",
                                                                        star <= formData.rating
                                                                            ? "fill-[#FFB800] text-[#FFB800]"
                                                                            : "fill-neutral-200 text-neutral-200"
                                                                    )}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-neutral-700 mb-2">Name</label>
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="Your Name"
                                                            value={formData.name}
                                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 focus:border-black focus:outline-none transition-colors"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-neutral-700 mb-2">Email (Optional)</label>
                                                        <input
                                                            type="email"
                                                            placeholder="Your Email"
                                                            value={formData.email}
                                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                            className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 focus:border-black focus:outline-none transition-colors"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Review Title</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Summarize your experience"
                                                        value={formData.heading}
                                                        onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                                        className="w-full h-12 px-4 rounded-xl border-2 border-neutral-200 focus:border-black focus:outline-none transition-colors"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-neutral-700 mb-2">Review</label>
                                                    <textarea
                                                        required
                                                        rows={4}
                                                        placeholder="Write your review here..."
                                                        value={formData.comment}
                                                        onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                                        className="w-full p-4 rounded-xl border-2 border-neutral-200 focus:border-black focus:outline-none transition-colors resize-none"
                                                    />
                                                </div>

                                                {error && (
                                                    <div className="text-red-600 text-sm flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4" />
                                                        {error}
                                                    </div>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="h-12 px-8 bg-black text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? "Submitting..." : "Submit Review"}
                                                </button>
                                            </form>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Reviews List */}
                        <div className="space-y-6">
                            {isLoading ? (
                                <p className="text-neutral-500">Loading reviews...</p>
                            ) : reviews.length === 0 ? (
                                <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-neutral-100 border-dashed">
                                    <p className="text-neutral-500 font-medium">No reviews yet. Be the first to write one!</p>
                                </div>
                            ) : (
                                reviews.map((review, index) => (
                                    <FadeIn key={review.id} delay={index * 0.1}>
                                        <div className="border-b border-neutral-100 pb-8 last:border-0">
                                            <div className="flex items-center gap-1 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={cn(
                                                            "w-4 h-4",
                                                            i < review.rating
                                                                ? "fill-[#FFB800] text-[#FFB800]"
                                                                : "fill-neutral-200 text-neutral-200"
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <h4 className="font-bold text-lg text-neutral-900 mb-2">{review.heading}</h4>
                                            <p className="text-neutral-600 leading-relaxed mb-4">{review.comment}</p>
                                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                                <span className="font-medium text-neutral-900">{review.name}</span>
                                                <span>•</span>
                                                <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
