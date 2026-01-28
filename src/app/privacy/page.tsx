"use client";

import Container from "@/components/ui/Container";
import FadeIn from "@/components/animations/FadeIn";

export default function PrivacyPage() {
    return (
        <Container className="py-24 md:py-32">
            <FadeIn>
                <div className="max-w-3xl mx-auto">
                    <h1 className="font-display text-4xl md:text-5xl mb-8">Privacy Policy</h1>
                    <div className="prose prose-neutral">
                        <p className="text-neutral-500 mb-8 leading-relaxed">
                            Last updated: January 29, 2026
                        </p>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">1. Information We Collect</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                When you make a purchase from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address, and email address. When you browse our store, we also automatically receive your computer’s internet protocol (IP) address.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">2. Consent</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                How do you get my consent? When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">3. Disclosure</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
                            </p>
                        </section>

                        <section className="mb-12">
                            <h2 className="font-bold text-xl mb-4">4. Security</h2>
                            <p className="text-neutral-600 leading-relaxed mb-4">
                                To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
                            </p>
                        </section>
                    </div>
                </div>
            </FadeIn>
        </Container>
    );
}
