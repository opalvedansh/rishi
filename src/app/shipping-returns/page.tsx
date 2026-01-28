"use client";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";

export default function ShippingPage() {
    return (
        <Container className="py-24 md:py-32">
            <FadeIn>
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl md:text-5xl mb-8">Shipping & Returns</h1>

                    <div className="prose prose-neutral">
                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">Shipping Policy</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We offer free standard shipping on all orders over ₹5,000. Orders are processed within 1-2 business days.
                            </p>
                            <ul className="list-disc pl-5 text-neutral-600 space-y-2 mb-4">
                                <li><strong>Standard Shipping:</strong> 3-5 Business Days (₹100 for orders under ₹5,000)</li>
                                <li><strong>Express Shipping:</strong> 1-2 Business Days (₹250)</li>
                                <li><strong>International Shipping:</strong> 7-14 Business Days (Calculated at checkout)</li>
                            </ul>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">Return Policy</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We have a 14-day return policy, which means you have 14 days after receiving your item to request a return.
                            </p>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">How to Start a Return</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                To start a return, you can contact us at support@doree.com. If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">Damages and Issues</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
                            </p>
                        </section>
                    </div>
                </div>
            </FadeIn>
        </Container>
    );
}
